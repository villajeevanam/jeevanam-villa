import { Router } from "express";

const router = Router();

const PLANS: Record<string, { fullName: string; desc: string }> = {
  EP:  { fullName: "European Plan",          desc: "Room Only" },
  CP:  { fullName: "Continental Plan",       desc: "Room + Breakfast" },
  MAP: { fullName: "Modified American Plan", desc: "Room + Breakfast + Dinner" },
  AP:  { fullName: "American Plan",          desc: "All Meals Included" },
};

function nightsBetween(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return "";
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const n = Math.round(diff / 86400000);
  return n > 0 ? `${n} night${n > 1 ? "s" : ""}` : "";
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 16px;color:#9a8060;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:160px;vertical-align:top">${label}</td>
    <td style="padding:10px 16px;color:#f0ead6;font-size:14px;vertical-align:top">${value}</td>
  </tr>`;
}

function buildEmailHtml(d: Record<string, string>): string {
  const plan = PLANS[d.plan] ?? null;
  const planLabel = plan ? `${d.plan} – ${plan.fullName} (${plan.desc})` : d.plan || "";
  const nights = nightsBetween(d.checkIn, d.checkOut);
  const phoneDigits = (d.phone || "").replace(/\D/g, "");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
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

        <tr><td style="padding:24px 32px 4px">
          <p style="margin:0;color:#c8a96e;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid #2a2a2a;padding-bottom:8px">Guest Details</p>
        </td></tr>
        <tr><td style="padding:0 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", d.name)}
            ${row("Phone", d.phone)}
            ${d.email ? row("Email", d.email) : ""}
          </table>
        </td></tr>

        <tr><td style="padding:20px 32px 4px">
          <p style="margin:0;color:#c8a96e;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid #2a2a2a;padding-bottom:8px">Booking Details</p>
        </td></tr>
        <tr><td style="padding:0 16px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row("Room Type", d.roomType)}
            ${row("Meal Plan", planLabel)}
            ${row("No. of Rooms", d.numRooms)}
            ${row("Adults", d.adults)}
            ${d.children512 && d.children512 !== "0" ? row("Children (5–12 yrs)", d.children512) : ""}
            ${d.childrenBelow5 && d.childrenBelow5 !== "0" ? row("Children (below 5)", d.childrenBelow5 + " — complimentary") : ""}
            ${row("Extra Bed", d.extraBed === "yes" ? "Yes" : "No")}
            ${row("Check-in", d.checkIn)}
            ${row("Check-out", d.checkOut)}
            ${nights ? row("Duration", nights) : ""}
          </table>
        </td></tr>

        ${d.requests ? `
        <tr><td style="padding:20px 32px 4px">
          <p style="margin:0;color:#c8a96e;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;border-bottom:1px solid #2a2a2a;padding-bottom:8px">Special Requests</p>
        </td></tr>
        <tr><td style="padding:8px 32px 0">
          <p style="color:#c0b090;font-size:14px;line-height:1.6;margin:0">${d.requests}</p>
        </td></tr>` : ""}

        <tr><td style="padding:28px 32px 32px;text-align:center">
          <p style="margin:0 0 18px;color:#9a8060;font-size:13px;line-height:1.6">
            Please contact the guest at your earliest convenience to confirm the booking and arrange the 50% advance payment.
          </p>
          <a href="tel:+91${phoneDigits}"
             style="display:inline-block;background:#c8a96e;color:#0f0f0f;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:700;font-size:13px;letter-spacing:0.06em">
            Call Guest Now
          </a>
        </td></tr>

        <tr><td style="background:#111;padding:14px 32px;text-align:center;border-top:1px solid #2a2a2a">
          <p style="margin:0;color:#555;font-size:11px">
            Villa Jeevanam &nbsp;·&nbsp; villajeevanam@gmail.com &nbsp;·&nbsp; +91 97979 82421
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

router.post("/send-booking", async (req, res) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[booking] RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const data: Record<string, string> = req.body;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Villa Jeevanam Booking <onboarding@resend.dev>",
        to: ["villajeevanam@gmail.com"],
        subject: "New Booking Request \u2013 Villa Jeevanam",
        html: buildEmailHtml(data),
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("[booking] Resend error:", err);
      return res.status(502).json({ error: "Email delivery failed", detail: err });
    }

    console.log("[booking] Email sent successfully");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[booking] Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
