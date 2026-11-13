# Jeevanam Villa website

This is the Vercel website project inside the `villajeevanam/jeevanam-villa` repository.

## Local development

```sh
npm ci
npm run dev
```

Build the production site with `npm run build`. The site uses Vite, React, and Motion. Its pages are composed in `src/App.jsx`; shared navigation and footer stay in place while routes transition in the browser.

## Homepage film

Replace `public/videos/jeevanam-villa.mp4` with the villa's homepage video. The hero plays it muted and loops it, with the villa exterior image as its fallback.

## Routes

- `/` — home
- `/rooms` — rooms and amenities
- `/rates` — meal plans and cancellation policy
- `/experiences` — Ladakh story and gallery
- `/reviews` — guest reviews
- `/location` — arrival information and map
- `/book` — reservation form
