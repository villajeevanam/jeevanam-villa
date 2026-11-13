export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'RESEND_API_KEY is not configured' });

  const data = req.body || {};
  if (!data.name || !data.phone || !data.roomType || !data.plan || !data.checkIn || !data.checkOut) {
    return res.status(400).json({ error: 'Required booking details are missing' });
  }

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const nights = Number(data.nights) || 0;
  const entries = [
    ['Name', data.name], ['Phone', data.phone], ['Email', data.email],
    ['Room type', data.roomType], ['Meal plan', data.plan], ['Number of rooms', data.numRooms],
    ['Adults', data.adults], ['Children (5–12 yrs)', data.children512],
    ['Children (below 5 yrs)', data.childrenBelow5], ['Extra bed', data.extraBed === 'yes' ? 'Yes' : 'No'],
    ['Check-in', data.checkIn], ['Check-out', data.checkOut],
    ['Duration', nights ? `${nights} night${nights === 1 ? '' : 's'}` : ''],
    ['Estimated total', data.estimatedTotal ? `₹${Number(data.estimatedTotal).toLocaleString('en-IN')} + applicable GST` : ''],
    ['Special request', data.requests],
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');
  const rows = entries.map(([label, value]) => `<tr><td style="padding:11px 14px;border-bottom:1px solid #28251f;color:#c4a369;font-size:11px;letter-spacing:.07em;text-transform:uppercase;vertical-align:top">${escapeHtml(label)}</td><td style="padding:11px 14px;border-bottom:1px solid #28251f;color:#f1eadc;font-size:14px;line-height:1.55">${escapeHtml(value)}</td></tr>`).join('');

  const html = `<!doctype html><html><body style="margin:0;padding:32px 12px;background:#09090b;font-family:Arial,sans-serif;color:#f1eadc"><table role="presentation" style="max-width:620px;width:100%;margin:auto;border:1px solid #564729;border-collapse:collapse;background:#111113"><tr><td style="padding:26px 28px;background:#09090b;border-bottom:1px solid #5b492b"><div style="color:#e2c17b;font-family:Georgia,serif;font-size:25px">Jeevanam Villa</div><div style="margin-top:7px;color:#a89a80;font-size:10px;letter-spacing:.17em">NEW BOOKING REQUEST · LEH, LADAKH</div></td></tr><tr><td style="padding:12px 14px"><table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table></td></tr><tr><td style="padding:22px 28px;color:#aaa08e;font-size:12px;line-height:1.7">Please contact the guest to confirm availability and the booking details. The listed booking terms require a 50% advance payment.</td></tr><tr><td style="padding:15px 28px;border-top:1px solid #28251f;color:#9d927c;font-size:10px">villajeevanam@gmail.com · +91 97979 82421</td></tr></table></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Villa Jeevanam Booking <onboarding@resend.dev>',
        to: ['villajeevanam@gmail.com'],
        reply_to: data.email || undefined,
        subject: 'New Booking Request – Villa Jeevanam',
        html,
      }),
    });
    if (!response.ok) return res.status(502).json({ error: 'Email delivery failed' });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Email service is temporarily unavailable' });
  }
}
