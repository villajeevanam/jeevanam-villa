import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH environment variable is required but was not provided.");
}

// ─── EMAIL TEMPLATE ───────────────────────────────────────────────────────────

function buildEmailHtml(d: Record<string, string>): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:10px 16px;color:#9a8060;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:160px;vertical-align:top">${label}</td><td style="padding:10px 16px;color:#f0ead6;font-size:14px;vertical-align:top">${value}</td></tr>`
      : "";

  const nights = (() => {
    if (!d.checkIn || !d.checkOut) return "";
    const diff = new Date(d.checkOut).getTime() - new Date(d.checkIn).getTime();
    const n = Math.round(diff / 86400000);
    return n > 0 ? `${n} night${n > 1 ? "s" : ""}` : "";
  })();

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a">
        
        <tr>
          <td style="background:linear-gradient(135deg,#1a1207,#0f0f0f);padding:36px 32px;text-align:center;border-bottom:1px solid #2a2a2a">
            <h1 style="margin:0 0 6px;font-size:26px;color:#c8a96e;font-family:Georgia,serif;letter-spacing:0.05em">Villa Jeevanam</h1>
            <p style="margin:0;color:#9a8060;font-size:12px;letter-spacing:0.15em;text-transform:uppercase">New Booking Request</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 8px">
            <p style="margin:0;color:#c8a96e;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;border-bottom:1px solid #2a2a2a;padding-bottom:10px">Guest Details</p>
          </td>
        </tr>
        <tr><td style="padding:0 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", d.name)}
            ${row("Phone", d.phone)}
            ${d.email ? row("Email", d.email) : ""}
          </table>
        </td></tr>

        <tr>
          <td style="padding:20px 32px 8px">
            <p style="margin:0;color:#c8a96e;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;border-bottom:1px solid #2a2a2a;padding-bottom:10px">Booking Details</p>
          </td>
        </tr>
        <tr><td style="padding:0 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row("Room Type", d.roomType)}
            ${row("Meal Plan", d.plan)}
            ${row("No. of Rooms", d.numRooms)}
            ${row("Adults", d.adults)}
            ${d.children512 && d.children512 !== "0" ? row("Children (5–12 yrs)", d.children512) : ""}
            ${d.childrenBelow5 && d.childrenBelow5 !== "0" ? row("Children (below 5)", d.childrenBelow5 + " (complimentary)") : ""}
            ${row("Extra Bed", d.extraBed === "yes" ? "Yes" : "No")}
            ${row("Check-in", d.checkIn)}
            ${row("Check-out", d.checkOut)}
            ${nights ? row("Duration", nights) : ""}
          </table>
        </td></tr>

        ${d.requests ? `
        <tr>
          <td style="padding:20px 32px 8px">
            <p style="margin:0;color:#c8a96e;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;border-bottom:1px solid #2a2a2a;padding-bottom:10px">Special Requests</p>
          </td>
        </tr>
        <tr><td style="padding:0 32px">
          <p style="color:#c0b090;font-size:14px;line-height:1.6;margin:12px 0 0">${d.requests}</p>
        </td></tr>
        ` : ""}

        <tr>
          <td style="padding:28px 32px 32px;text-align:center">
            <p style="margin:0 0 16px;color:#9a8060;font-size:12px">Please contact the guest at your earliest convenience to confirm the booking and arrange advance payment.</p>
            <a href="tel:+91${(d.phone || "").replace(/\D/g, "")}" style="display:inline-block;background:#c8a96e;color:#0f0f0f;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:700;font-size:13px;letter-spacing:0.05em">Call Guest Now</a>
          </td>
        </tr>

        <tr>
          <td style="background:#111;padding:16px 32px;text-align:center;border-top:1px solid #2a2a2a">
            <p style="margin:0;color:#555;font-size:11px">Villa Jeevanam · villajeevanam@gmail.com · +91 97979 82421</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── BOOKING API VITE PLUGIN ──────────────────────────────────────────────────

function bookingApiPlugin(): Plugin {
  const handler = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url?.includes("/api/booking")) return next();
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }
    if (req.method !== "POST") return next();

    let rawBody = "";
    req.on("data", (chunk: Buffer) => { rawBody += chunk.toString(); });
    req.on("end", async () => {
      const corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
      try {
        const data = JSON.parse(rawBody || "{}");
        const apiKey = process.env.RESEND_API_KEY;

        if (apiKey) {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Villa Jeevanam Booking <onboarding@resend.dev>",
              to: ["villajeevanam@gmail.com"],
              subject: "New Booking Request – Villa Jeevanam",
              html: buildEmailHtml(data),
            }),
          });
          if (!emailRes.ok) {
            const err = await emailRes.text();
            console.error("[booking-api] Resend error:", err);
          } else {
            console.log("[booking-api] Email sent successfully via Resend");
          }
        } else {
          console.warn("[booking-api] RESEND_API_KEY not set — email skipped");
        }

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        console.error("[booking-api] Error:", e);
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: "Server error" }));
      }
    });
  };

  return {
    name: "booking-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// ─── VITE CONFIG ──────────────────────────────────────────────────────────────

export default defineConfig({
  base: basePath,
  plugins: [
    bookingApiPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({ root: path.resolve(import.meta.dirname, "..") }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true, deny: ["**/.*"] },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
