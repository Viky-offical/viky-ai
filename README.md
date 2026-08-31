# Viky AI — real video generator

## What this adds
- Real Google Veo 3.1 generation instead of the old demo timeout.
- Text-to-video.
- Image/video reference upload through the existing `viky-videos` private bucket.
- Native Veo audio: dialogue, ambient sound and effects can be generated from the same prompt.
- Secure server-side Gemini API key.
- Secure atomic credit deduction through Supabase.
- Generated MP4 saved into Supabase Storage.
- Recent Videos card gets a playable video link.

## Important Veo limitation
Veo 3.1 currently generates native clips of 4, 6 or 8 seconds. Video extension can add 7 seconds per extension and can reach up to 148 seconds for a Veo-generated video. It does NOT natively create 20-minute or unlimited-length videos in one request.

## Install
1. Run `setup.sql` in Supabase SQL Editor.
2. In Supabase Edge Function Secrets add:
   - GEMINI_API_KEY = your Gemini API key
   - SUPABASE_SERVICE_ROLE_KEY = your Supabase service-role key
3. Deploy:
   - generate-video
   - video-status
4. In `index.html`, after your existing `app.js`, add:
   `<script src="video-generator.js"></script>`
5. Keep the Gemini key ONLY in Edge Function Secrets. Never put it in HTML/JS.

The frontend already uses the project's publishable Supabase key; that key is safe to expose as a publishable client key. The service-role key and Gemini key must remain server-side.
