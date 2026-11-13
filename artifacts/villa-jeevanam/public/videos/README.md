# Jeevanam homepage video

Replaceable homepage video slot: add your own optimized MP4 at `public/videos/jeevanam-villa.mp4`.

The homepage hero will play it muted, inline, and on loop. Until the file is added (or if it cannot load), the existing Jeevanam Villa exterior image remains visible as the poster and fallback. Keep the video landscape (16:9), compressed for web, and ideally under 20 MB for a fast first visit. The video should not contain audio because the hero is intentionally muted for autoplay.

To use a different filename or format, update the `src` on the `.hero-video` element in `src/App.jsx`.
