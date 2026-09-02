import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SECRET_KEY")!;
    const geminiKey = Deno.env.get("GEMINI_API_KEY")!;

    const authorization = req.headers.get("Authorization");

    if (!authorization) {
      throw new Error("Not authenticated");
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const userClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: authorization,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Invalid session");
    }

    const body = await req.json();
    const jobId = String(body.job_id || "").trim();

    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const { data: job, error: jobError } = await admin
      .from("video_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (jobError) {
      throw jobError;
    }

    if (job.status === "completed") {
      return jsonResponse({
        status: "completed",
        video_url: job.video_url,
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${job.operation_name}`,
      {
        headers: {
          "x-goog-api-key": geminiKey,
        },
      }
    );

    const operation = await response.json();

    if (!response.ok) {
      throw new Error(
        operation?.error?.message ||
          "Veo status request failed."
      );
    }

    // Still generating
    if (!operation.done) {
      return jsonResponse({
        status: "processing",
      });
    }

    // Veo generation failed
    if (operation.error) {
      await admin
        .from("video_jobs")
        .update({
          status: "failed",
          error_message: operation.error.message,
        })
        .eq("id", jobId);

      return jsonResponse({
        status: "failed",
        error_message: operation.error.message,
      });
    }

    const videoUri =
      operation.response
        ?.generateVideoResponse
        ?.generatedSamples?.[0]
        ?.video?.uri;

    if (!videoUri) {
      throw new Error("Veo returned no video URI.");
    }

    // Download video from Google
    const videoResponse = await fetch(videoUri, {
      headers: {
        "x-goog-api-key": geminiKey,
      },
    });

    if (!videoResponse.ok) {
      throw new Error("Could not download generated video.");
    }

    const videoBytes = new Uint8Array(
      await videoResponse.arrayBuffer()
    );

    // Save video to Supabase Storage
    const storagePath = `${user.id}/${jobId}.mp4`;

    const upload = await admin.storage
      .from("viky-videos")
      .upload(storagePath, videoBytes, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (upload.error) {
      throw upload.error;
    }

    // Create private signed URL
    const signed = await admin.storage
      .from("viky-videos")
      .createSignedUrl(storagePath, 604800);

    if (signed.error) {
      throw signed.error;
    }

    // Save completed job
    await admin
      .from("video_jobs")
      .update({
        status: "completed",
        video_path: storagePath,
        video_url: signed.data.signedUrl,
      })
      .eq("id", jobId);

    return jsonResponse({
      status: "completed",
      video_url: signed.data.signedUrl,
    });
  } catch (error) {
    return jsonResponse(
      {
        status: "failed",
        error_message:
          error instanceof Error
            ? error.message
            : String(error),
      },
      400
    );
  }
});

function jsonResponse(
  data: unknown,
  status = 200
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
