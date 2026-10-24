const WHATSAPP = '916283937782'
const EMAIL = 'shivakumar.frontend@gmail.com'

// Maps a pricing card to the matching "What do you need?" option
const PLAN_TO_TYPE = {
  'Custom web application': 'Web application',
  'Premium digital experience': 'Marketing website',
  'Dedicated engineering retainer': 'Ongoing retainer',
}

function summary(data) {
  return [
    `Hi Shiva, I'm ${data.name}${data.email ? ` (${data.email})` : ''}.`,
    `Project: ${data.type} · Budget: ${data.budget}`,
    '',
    data.message,
  ].join('\n')
}

// Preferred: our own /api/contact (Resend). If it isn't configured or isn't
// available (e.g. local dev), deliver through FormSubmit, which needs no API key.
async function deliver(data) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    // Only trust a real JSON success (dev servers answer unknown routes with HTML + 200)
    const json = await res.json().catch(() => null)
    if (res.ok && json?.ok === true) return
  } catch {
    // fall through to FormSubmit
  }
  const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `New project inquiry: ${data.type} — ${data.name}`,
      _replyto: data.email,
      _template: 'table',
      _captcha: 'false',
      name: data.name,
      email: data.email,
      project: data.type,
      budget: data.budget,
      message: data.message,
    }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || `FormSubmit ${res.status}`)
}

function el(tag, attrs = {}, text = '') {
  const node = document.createElement(tag)
  Object.assign(node, attrs)
  if (text) node.textContent = text
  return node
}

export function initContact() {
  const form = document.querySelector('[data-contact-form]')
  if (!form) return

  const status = form.querySelector('[data-form-status]')
  const submit = form.querySelector('[data-submit]')
  const label = form.querySelector('[data-submit-label]')

  document.querySelectorAll('[data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = PLAN_TO_TYPE[btn.dataset.plan]
      const radio = type && form.querySelector(`input[name="type"][value="${type}"]`)
      if (radio) radio.checked = true
    })
  })

  form.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true' && input.checkValidity()) {
        input.setAttribute('aria-invalid', 'false')
      }
    })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    let firstInvalid = null
    form.querySelectorAll('[required]').forEach((input) => {
      const valid = input.value.trim() !== '' && input.checkValidity()
      input.setAttribute('aria-invalid', String(!valid))
      if (!valid && !firstInvalid) firstInvalid = input
    })
    if (firstInvalid) {
      status.replaceChildren(el('span', { className: 'err' }, 'Please add your name, a valid email and a short message.'))
      firstInvalid.focus()
      return
    }

    const data = Object.fromEntries(new FormData(form))
    submit.disabled = true
    label.textContent = 'Sending…'
    status.replaceChildren()

    try {
      // Bots fill the hidden honeypot field: pretend success, send nothing
      if (!data.website) await deliver(data)

      form.classList.add('is-sent')
      const firstName = data.name.trim().split(/\s+/)[0]
      status.replaceChildren(
        el('strong', {}, `Thanks, ${firstName} — message received.`),
        el('span', { className: 'muted' }, "I'll get back to you shortly. Prefer chat? Ping me on WhatsApp anytime."),
      )
      window.dataLayer?.push({ event: 'generate_lead', lead_type: data.type, lead_budget: data.budget })
    } catch {
      // No backend configured or network issue — hand off to WhatsApp / email with the message prefilled
      const text = summary(data)
      status.replaceChildren(
        el('span', { className: 'err' }, "Couldn't send automatically. "),
        document.createTextNode('Send it instantly via '),
        el('a', { href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noopener' }, 'WhatsApp'),
        document.createTextNode(' or '),
        el('a', { href: `mailto:${EMAIL}?subject=${encodeURIComponent(`Project inquiry — ${data.name}`)}&body=${encodeURIComponent(text)}` }, 'email'),
        document.createTextNode(' — your message is already filled in.'),
      )
    } finally {
      submit.disabled = false
      label.textContent = 'Send message'
    }
  })

  // Copy-email button
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const copyLabel = btn.querySelector('[data-copy-label]')
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy)
        copyLabel.textContent = 'Copied to clipboard'
        setTimeout(() => (copyLabel.textContent = 'Copy email'), 2200)
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`
      }
    })
  })
}
