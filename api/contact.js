// Vercel serverless function: POST /api/contact
// Sends the inquiry to your inbox via Resend (https://resend.com).
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      — your Resend API key
//   CONTACT_TO_EMAIL    — where inquiries are delivered
// Optional:
//   CONTACT_FROM_EMAIL  — verified sender, e.g. "Portfolio <hello@yourdomain.com>"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const clean = (value, max) => String(value ?? '').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}

  // Honeypot: bots fill hidden fields, humans don't
  if (body.website) return res.status(200).json({ ok: true })

  const lead = {
    name: clean(body.name, 100),
    email: clean(body.email, 160),
    type: clean(body.type, 60) || 'Not specified',
    budget: clean(body.budget, 40) || 'Not specified',
    message: clean(body.message, 4000),
  }

  if (!lead.name || !EMAIL_RE.test(lead.email) || !lead.message) {
    return res.status(400).json({ ok: false, error: 'invalid_input' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    return res.status(503).json({ ok: false, error: 'not_configured' })
  }

  const text = [
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    `Project: ${lead.type}`,
    `Budget:  ${lead.budget}`,
    '',
    lead.message,
  ].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: lead.email,
        subject: `New inquiry: ${lead.type} — ${lead.name}`,
        text,
      }),
    })
    if (!response.ok) {
      console.error('Resend error', response.status, await response.text())
      return res.status(502).json({ ok: false, error: 'delivery_failed' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact handler error', err)
    return res.status(500).json({ ok: false, error: 'server_error' })
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}
