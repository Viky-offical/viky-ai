/* Viky AI — real Veo video generator bridge
   Load this AFTER app.js:
   <script src="video-generator.js"></script>
*/
(() => {
  "use strict";

  const SUPABASE_URL = "https://qhcjicfxolurbjnvobur.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_D6EylVAso_ihWIS33ObsYg_onCINCKo";
  const BUCKET = "viky-videos";

  const sb = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const $ = (s) => document.querySelector(s);

  function selectedText(selector, fallback) {
    const el = document.querySelector(selector);
    return el?.value || fallback;
  }

  function selectedChoice(group, fallback) {
    const btn = document.querySelector(`${group} button.selected`);
    return (btn?.textContent || fallback).trim();
  }

  function normalizeDuration(text) {
    const m = String(text).match(/(\d+(?:\.\d+)?)\s*(sec|min)/i);
    if (!m) return 8;
    const n = Number(m[1]);
    const seconds = m[2].toLowerCase() === "min" ? n * 60 : n;
    // Veo 3.1 native generation supports 4/6/8 seconds.
    if (seconds <= 4) return 4;
    if (seconds <= 6) return 6;
    return 8;
  }

  function addGeneratorStatus() {
    if ($("#vikyGenStatus")) return;
    const box = document.createElement("div");
    box.id = "vikyGenStatus";
    box.style.cssText = [
      "margin-top:14px;padding:12px 14px;border:1px solid rgba(99,245,176,.18)",
      "border-radius:12px;background:rgba(6,12,18,.85);color:#aebdce;font-size:12px",
      "display:none"
    ].join(";");
    const note = document.querySelector(".note");
    note?.parentNode?.insertBefore(box, note);
  }

  function status(text, error = false) {
    addGeneratorStatus();
    const box = $("#vikyGenStatus");
    if (!box) return;
    box.style.display = "block";
    box.style.borderColor = error ? "rgba(255,90,90,.35)" : "rgba(99,245,176,.22)";
    box.style.color = error ? "#ff9a9a" : "#aebdce";
    box.textContent = text;
  }

  function renderResult(job) {
    const list = $("#recentList");
    if (!list) return;

    list.querySelector(".empty")?.remove();

    const item = document.createElement("div");
    item.className = "video-item";
    const title = job.title || "AI Video";
    const url = job.video_url || "";
    const captions = job.captions_url || "";

    item.innerHTML = `
      <div class="thumb" style="overflow:hidden">
        ${url ? `<video src="${url}" muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover"></video>` : ""}
      </div>
      <div style="min-width:0">
        <b>${escapeHtml(title)}</b>
        <small>✓ Veo generation complete</small>
        ${url ? `<a href="${url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:5px;color:#63f5b0">Open video</a>` : ""}
        ${captions ? `<a href="${captions}" target="_blank" rel="noopener" style="display:inline-block;margin:5px 0 0 8px;color:#2388ff">Captions</a>` : ""}
      </div>
    `;
    list.prepend(item);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  async function uploadMedia(file, userId) {
    if (!file) return null;
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await sb.storage.from(BUCKET).upload(path, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream"
    });
    if (error) throw error;
    return path;
  }

  async function getUser() {
    if (!sb) throw new Error("Supabase is not loaded.");
    const { data, error } = await sb.auth.getUser();
    if (error || !data?.user) throw new Error("Please sign in first.");
    return data.user;
  }

  async function invoke(name, body) {
    const { data, error } = await sb.functions.invoke(name, { body });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }

  async function pollJob(jobId, button) {
    for (;;) {
      const data = await invoke("video-status", { job_id: jobId });

      if (data.status === "completed") {
        if (button) {
          button.disabled = false;
          button.innerHTML = `⚡ GENERATE VIDEO <span>20 credits</span>`;
        }
        status("✓ Video ready — audio is included by Veo.");
        renderResult(data);
        return;
      }

      if (data.status === "failed") {
        if (button) {
          button.disabled = false;
          button.innerHTML = `⚡ GENERATE VIDEO <span>20 credits</span>`;
        }
        throw new Error(data.error || "Video generation failed.");
      }

      status(data.message || "⏳ Veo is generating your video…");
      await new Promise(r => setTimeout(r, 7000));
    }
  }

  async function generateRealVideo(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const button = $("#generate");
    const prompt = $("#prompt")?.value?.trim();
    if (!prompt) {
      status("Please enter a video prompt.", true);
      return;
    }

    const user = await getUser();
    const mode =
      document.querySelector(".mode.active")?.dataset.mode ||
      document.querySelector('[data-mode="text"].active')?.dataset.mode ||
      "text";

    const durationText = selectedChoice(".duration", "8 sec");
    const durationSeconds = normalizeDuration(durationText);
    const aspectRatio = selectedChoice(".ratio", "16:9");

    const selects = document.querySelectorAll(".settings-grid select");
    const quality = selects[0]?.value || "720p (HD)";
    const style = selects[1]?.value || "Realistic Cinematic";

    // Keep prompt as the single creative input. Dialogue in the prompt is passed
    // directly to Veo so native speech/audio can be generated with the video.
    const finalPrompt = [
      `Visual style: ${style}.`,
      `Aspect ratio: ${aspectRatio}.`,
      prompt,
      "Generate synchronized natural audio, dialogue, ambient sound and sound effects when appropriate.",
      "If characters speak, keep the spoken dialogue synchronized with their visible mouth movements."
    ].join("\n");

    const file = $("#mediaInput")?.files?.[0];
    let mediaPath = null;

    try {
      if (file) {
        status("Uploading your reference media securely…");
        mediaPath = await uploadMedia(file, user.id);
      }

      if (button) {
        button.disabled = true;
        button.innerHTML = "⏳ STARTING VEO…";
      }

      status("Starting real Veo 3.1 generation…");

      const job = await invoke("generate-video", {
        mode,
        prompt: finalPrompt,
        duration_seconds: durationSeconds,
        requested_duration_seconds: durationText,
        aspect_ratio: aspectRatio,
        quality,
        style,
        media_path: mediaPath
      });

      if (job?.job_id) {
        status("Veo job started. This can take a few minutes.");
        await pollJob(job.job_id, button);
      } else {
        throw new Error("The generation job was not created.");
      }
    } catch (err) {
      console.error(err);
      if (button) {
        button.disabled = false;
        button.innerHTML = `⚡ GENERATE VIDEO <span>20 credits</span>`;
      }
      status(err?.message || "Generation failed.", true);
    }
  }

  function install() {
    if (!sb) {
      console.warn("Viky video generator: Supabase JS is unavailable.");
      return;
    }

    const btn = $("#generate");
    if (!btn) return;

    // Capture phase prevents the old demo setTimeout handler in app.js
    // from also running.
    btn.addEventListener("click", generateRealVideo, true);

    addGeneratorStatus();

    // Add a small, honest capability note without changing the existing HTML.
    const note = document.querySelector(".note");
    if (note && !$("#veoCapabilityNote")) {
      const p = document.createElement("div");
      p.id = "veoCapabilityNote";
      p.style.cssText = "margin-top:8px;color:#64758a;font-size:10px;text-align:center";
      p.textContent = "Powered by Veo 3.1 • native synchronized audio • 4/6/8s native clips";
      note.parentNode?.appendChild(p);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
