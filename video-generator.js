/* Viky AI — Real Veo 3.1 Video Generator Bridge
   Load this AFTER app.js:
   <script src="video-generator.js"></script>
*/

(() => {
  "use strict";

  // =========================================================
  // SUPABASE
  // =========================================================

  const SUPABASE_URL =
    "https://qhcjicfxolurbjnvobur.supabase.co";

  const SUPABASE_ANON_KEY =
    "sb_publishable_D6EylVAso_ihWIS33ObsYg_onCINCKo";

  const BUCKET = "viky-videos";

  const sb = window.supabase?.createClient?.(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  // =========================================================
  // HELPERS
  // =========================================================

  const $ = (selector) =>
    document.querySelector(selector);

  function selectedChoice(group, fallback) {
    const button = document.querySelector(
      `${group} button.selected`
    );

    return (
      button?.textContent?.trim() ||
      fallback
    );
  }

  // =========================================================
  // DURATION
  // Veo 3.1 native durations:
  // 4 / 6 / 8 seconds
  // =========================================================

  function normalizeDuration(text) {
    const value = String(text || "");

    const match = value.match(
      /(\d+(?:\.\d+)?)\s*(sec|secs|second|seconds|min|minute|minutes)/i
    );

    if (!match) {
      return 8;
    }

    const number = Number(match[1]);

    const unit = match[2].toLowerCase();

    let seconds = number;

    if (
      unit === "min" ||
      unit === "minute" ||
      unit === "minutes"
    ) {
      seconds = number * 60;
    }

    if (seconds <= 4) {
      return 4;
    }

    if (seconds <= 6) {
      return 6;
    }

    return 8;
  }

  // =========================================================
  // STATUS BOX
  // =========================================================

  function addGeneratorStatus() {
    if ($("#vikyGenStatus")) {
      return;
    }

    const box =
      document.createElement("div");

    box.id = "vikyGenStatus";

    box.style.cssText = [
      "margin-top:14px",
      "padding:12px 14px",
      "border:1px solid rgba(99,245,176,.18)",
      "border-radius:12px",
      "background:rgba(6,12,18,.85)",
      "color:#aebdce",
      "font-size:12px",
      "line-height:1.5",
      "display:none",
      "word-break:break-word"
    ].join(";");

    const note =
      document.querySelector(".note");

    if (note?.parentNode) {
      note.parentNode.insertBefore(
        box,
        note
      );
    }
  }

  function status(
    text,
    error = false
  ) {
    addGeneratorStatus();

    const box =
      $("#vikyGenStatus");

    if (!box) {
      return;
    }

    box.style.display = "block";

    box.style.borderColor = error
      ? "rgba(255,90,90,.35)"
      : "rgba(99,245,176,.22)";

    box.style.color = error
      ? "#ff9a9a"
      : "#aebdce";

    box.textContent = String(text);
  }

  // =========================================================
  // ESCAPE HTML
  // =========================================================

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char])
    );
  }

  // =========================================================
  // USER
  // =========================================================

  async function getUser() {
    if (!sb) {
      throw new Error(
        "Supabase is not loaded."
      );
    }

    const {
      data,
      error
    } = await sb.auth.getUser();

    if (error) {
      throw new Error(
        error.message ||
        "Unable to read your login session."
      );
    }

    if (!data?.user) {
      throw new Error(
        "Please sign in first."
      );
    }

    return data.user;
  }

  // =========================================================
  // STORAGE UPLOAD
  // =========================================================

  async function uploadMedia(
    file,
    userId
  ) {
    if (!file) {
      return null;
    }

    if (!sb) {
      throw new Error(
        "Supabase is not loaded."
      );
    }

    const extension =
      (
        file.name
          ?.split(".")
          .pop() ||
        "bin"
      ).toLowerCase();

    const path =
      `${userId}/${crypto.randomUUID()}.${extension}`;

    const {
      error
    } = await sb.storage
      .from(BUCKET)
      .upload(
        path,
        file,
        {
          upsert: false,
          contentType:
            file.type ||
            "application/octet-stream"
        }
      );

    if (error) {
      throw new Error(
        `Media upload failed: ${error.message}`
      );
    }

    return path;
  }

  // =========================================================
  // IMPORTANT:
  // THIS VERSION SHOWS THE REAL EDGE FUNCTION ERROR.
  // =========================================================

  async function getFunctionErrorMessage(
    error
  ) {
    let serverMessage = "";

    try {
      const response =
        error?.context;

      if (response) {
        const copy =
          typeof response.clone === "function"
            ? response.clone()
            : response;

        const contentType =
          copy.headers?.get?.(
            "content-type"
          ) || "";

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          const json =
            await copy.json();

          serverMessage =
            json?.error ||
            json?.message ||
            json?.details ||
            "";

          if (
            typeof serverMessage !==
            "string"
          ) {
            serverMessage =
              JSON.stringify(
                serverMessage
              );
          }
        } else {
          serverMessage =
            await copy.text();
        }
      }
    } catch (readError) {
      console.warn(
        "Could not read Edge Function error response:",
        readError
      );
    }

    if (
      serverMessage &&
      serverMessage.trim()
    ) {
      return serverMessage.trim();
    }

    return (
      error?.message ||
      "Edge Function failed."
    );
  }

  // =========================================================
  // INVOKE EDGE FUNCTION
  // =========================================================

  async function invoke(
    functionName,
    body
  ) {
    if (!sb) {
      throw new Error(
        "Supabase is not loaded."
      );
    }

    const {
      data,
      error
    } = await sb.functions.invoke(
      functionName,
      {
        body
      }
    );

    if (error) {
      const message =
        await getFunctionErrorMessage(
          error
        );

      console.error(
        `Viky AI ${functionName} error:`,
        error
      );

      throw new Error(
        message
      );
    }

    if (
      data?.error
    ) {
      throw new Error(
        typeof data.error ===
          "string"
          ? data.error
          : JSON.stringify(
              data.error
            )
      );
    }

    return data;
  }

  // =========================================================
  // RENDER COMPLETED VIDEO
  // =========================================================

  function renderResult(job) {
    const list =
      $("#recentList");

    if (!list) {
      return;
    }

    list
      .querySelector(".empty")
      ?.remove();

    const item =
      document.createElement("div");

    item.className =
      "video-item";

    const title =
      job?.title ||
      "AI Video";

    const videoUrl =
      job?.video_url ||
      "";

    const captionsUrl =
      job?.captions_url ||
      "";

    item.innerHTML = `
      <div class="thumb" style="overflow:hidden">
        ${
          videoUrl
            ? `
              <video
                src="${escapeHtml(videoUrl)}"
                muted
                playsinline
                preload="metadata"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                "
              ></video>
            `
            : ""
        }
      </div>

      <div style="min-width:0">

        <b>
          ${escapeHtml(title)}
        </b>

        <small>
          ✓ Veo generation complete
        </small>

        ${
          videoUrl
            ? `
              <a
                href="${escapeHtml(videoUrl)}"
                target="_blank"
                rel="noopener"
                style="
                  display:inline-block;
                  margin-top:5px;
                  color:#63f5b0;
                "
              >
                Open video
              </a>
            `
            : ""
        }

        ${
          captionsUrl
            ? `
              <a
                href="${escapeHtml(captionsUrl)}"
                target="_blank"
                rel="noopener"
                style="
                  display:inline-block;
                  margin:5px 0 0 8px;
                  color:#2388ff;
                "
              >
                Captions
              </a>
            `
            : ""
        }

      </div>
    `;

    list.prepend(item);
  }

  // =========================================================
  // POLL VIDEO JOB
  // =========================================================

  async function pollJob(
    jobId,
    button
  ) {
    let attempts = 0;

    while (true) {
      attempts++;

      const data =
        await invoke(
          "video-status",
          {
            job_id: jobId
          }
        );

      if (
        data?.status ===
        "completed"
      ) {
        if (button) {
          button.disabled = false;

          button.innerHTML =
            `⚡ GENERATE VIDEO <span>20 credits</span>`;
        }

        status(
          "✓ Video ready — Veo native audio is included."
        );

        renderResult(data);

        return data;
      }

      if (
        data?.status ===
        "failed"
      ) {
        if (button) {
          button.disabled = false;

          button.innerHTML =
            `⚡ GENERATE VIDEO <span>20 credits</span>`;
        }

        throw new Error(
          data?.error ||
          "Video generation failed."
        );
      }

      status(
        data?.message ||
        "⏳ Veo is generating your video…"
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            7000
          )
      );
    }
  }

  // =========================================================
  // MAIN GENERATOR
  // =========================================================

  async function generateRealVideo(
    event
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const button =
      $("#generate");

    try {
      // -----------------------------------------------------
      // PROMPT
      // -----------------------------------------------------

      const prompt =
        $("#prompt")
          ?.value
          ?.trim();

      if (!prompt) {
        status(
          "Please enter a video prompt.",
          true
        );

        return;
      }

      // -----------------------------------------------------
      // USER
      // -----------------------------------------------------

      status(
        "Checking your login session…"
      );

      const user =
        await getUser();

      // -----------------------------------------------------
      // MODE
      // -----------------------------------------------------

      const mode =
        document.querySelector(
          ".mode.active"
        )?.dataset.mode ||
        document.querySelector(
          '[data-mode="text"].active'
        )?.dataset.mode ||
        "text";

      // -----------------------------------------------------
      // DURATION
      // -----------------------------------------------------

      const durationText =
        selectedChoice(
          ".duration",
          "8 sec"
        );

      const durationSeconds =
        normalizeDuration(
          durationText
        );

      // -----------------------------------------------------
      // ASPECT RATIO
      // -----------------------------------------------------

      const aspectRatio =
        selectedChoice(
          ".ratio",
          "16:9"
        );

      const safeAspectRatio =
        aspectRatio === "9:16"
          ? "9:16"
          : "16:9";

      // -----------------------------------------------------
      // QUALITY + STYLE
      // -----------------------------------------------------

      const selects =
        document.querySelectorAll(
          ".settings-grid select"
        );

      const quality =
        selects[0]?.value ||
        "720p (HD)";

      const style =
        selects[1]?.value ||
        "Realistic Cinematic";

      // -----------------------------------------------------
      // CREATIVE PROMPT
      // -----------------------------------------------------

      const finalPrompt = [
        `Visual style: ${style}.`,

        `Aspect ratio: ${safeAspectRatio}.`,

        prompt,

        "Generate synchronized natural audio, dialogue, ambient sound and sound effects when appropriate.",

        "If characters speak, keep spoken dialogue synchronized with their visible mouth movements.",

        "Keep character appearance consistent throughout the shot.",

        "Use natural movement, realistic expressions and cinematic camera motion.",

        "Do not add subtitles or captions unless explicitly requested."
      ].join("\n");

      // -----------------------------------------------------
      // OPTIONAL MEDIA
      // -----------------------------------------------------

      const file =
        $("#mediaInput")
          ?.files?.[0];

      let mediaPath =
        null;

      if (file) {
        status(
          "Uploading your reference media securely…"
        );

        mediaPath =
          await uploadMedia(
            file,
            user.id
          );
      }

      // -----------------------------------------------------
      // BUTTON
      // -----------------------------------------------------

      if (button) {
        button.disabled = true;

        button.innerHTML =
          "⏳ STARTING VEO…";
      }

      status(
        "Starting real Veo 3.1 generation…"
      );

      // -----------------------------------------------------
      // GENERATE VIDEO
      // -----------------------------------------------------

      const job =
        await invoke(
          "generate-video",
          {
            mode,

            prompt:
              finalPrompt,

            duration_seconds:
              durationSeconds,

            requested_duration_seconds:
              durationText,

            aspect_ratio:
              safeAspectRatio,

            quality,

            style,

            media_path:
              mediaPath
          }
        );

      // -----------------------------------------------------
      // JOB CREATED
      // -----------------------------------------------------

      if (!job?.job_id) {
        throw new Error(
          "The generation job was not created."
        );
      }

      status(
        "✓ Veo job started. Generation may take a few minutes…"
      );

      // -----------------------------------------------------
      // WAIT
      // -----------------------------------------------------

      await pollJob(
        job.job_id,
        button
      );

    } catch (error) {

      console.error(
        "Viky AI generation error:",
        error
      );

      if (button) {
        button.disabled = false;

        button.innerHTML =
          `⚡ GENERATE VIDEO <span>20 credits</span>`;
      }

      status(
        error?.message ||
        "Generation failed.",
        true
      );
    }
  }

  // =========================================================
  // INSTALL
  // =========================================================

  function install() {
    if (!sb) {
      console.warn(
        "Viky AI: Supabase JS is unavailable."
      );

      return;
    }

    const button =
      $("#generate");

    if (!button) {
      console.warn(
        "Viky AI: Generate button not found."
      );

      return;
    }

    // Prevent old demo generation handler
    // from running after this real generator.
    button.addEventListener(
      "click",
      generateRealVideo,
      true
    );

    addGeneratorStatus();

    // -------------------------------------------------------
    // CAPABILITY NOTE
    // -------------------------------------------------------

    const note =
      document.querySelector(".note");

    if (
      note &&
      !$("#veoCapabilityNote")
    ) {
      const capability =
        document.createElement(
          "div"
        );

      capability.id =
        "veoCapabilityNote";

      capability.style.cssText =
        [
          "margin-top:8px",
          "color:#64758a",
          "font-size:10px",
          "text-align:center"
        ].join(";");

      capability.textContent =
        "Powered by Veo 3.1 • native synchronized audio • 4/6/8s native clips";

      note.parentNode?.appendChild(
        capability
      );
    }
  }

  // =========================================================
  // START
  // =========================================================

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }

})();
