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

    const admin = createClient(
      supabaseUrl,
      serviceKey
    );

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

    const prompt = String(body.prompt || "").trim();

    if (!prompt) {
      throw new Error("Video prompt is required.");
    }

    const requestedDuration = Number(body.duration || 6);

    const seconds = [4, 6, 8].includes(requestedDuration)
      ? requestedDuration
      : 8;

    const style =
      body.style === "real"
        ? "photorealistic live-action"
        : "AI-generated cinematic";

    const finalPrompt = `
${style}.

${prompt}

Generate natural synchronized audio.
Use appropriate character voices based on the characters in the scene.
Keep dialogue synchronized with the characters speaking.
Create cinematic composition, consistent characters, natural movement,
realistic expressions and high-quality video.
`;

    // Check admin
    const { data: role } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    const isAdmin =
      role?.role === "admin" ||
      user.email === "daimvirk555@gmail.com";

    // Normal users spend 20 credits
    if (!isAdmin) {
      const { data: creditResult, error: creditError } =
        await admin.rpc("consume_viky_credits", {
          p_user_id: user.id,
          p_amount: 20,
        });

      if (creditError) {
        throw creditError;
      }

      if (!creditResult) {
        throw new Error("Not enough credits.");
      }
    }

    // Call Veo 3.1
    const veoResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": geminiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: finalPrompt,
            },
          ],
          parameters: {
            duration_seconds: seconds,
            aspect_ratio: "16:9",
          },
        }),
      }
    );

    const operation = await veoResponse.json();

    if (!veoResponse.ok) {
      throw new Error(
        operation?.error?.message ||
          "Veo video generation request failed."
      );
    }

    // Save video job
    const { data: job, error: jobError } = await admin
      .from("video_jobs")
      .insert({
        user_id: user.id,
        prompt: prompt,
        status: "processing",
        operation_name: operation.name,
        requested_duration: requestedDuration,
      })
      .select("id")
      .single();

    if (jobError) {
      throw jobError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        job_id: job.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
