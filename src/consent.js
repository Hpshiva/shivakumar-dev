// Cookie consent: Google Tag Manager (and so Google Analytics) only loads after
// the visitor accepts. The choice can be changed from "Cookie settings" in the footer.
const STORAGE_KEY = 'cookie-consent'
const GTM_ID = 'GTM-N5WLVNMQ'
const IS_LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)

function readChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveChoice(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // storage blocked: the choice lasts for this page view only
  }
}

let analyticsLoaded = false
function loadAnalytics() {
  if (analyticsLoaded || IS_LOCAL) return
  analyticsLoaded = true
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(s)
}

function clearAnalyticsCookies() {
  const host = window.location.hostname
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim()
    if (!/^(_ga|_gid|_gat)/.test(name)) return
    for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
    }
  })
}

let banner = null

function closeBanner() {
  banner?.remove()
  banner = null
}

function choose(value) {
  const wasLoaded = analyticsLoaded
  saveChoice(value)
  closeBanner()
  if (value === 'accepted') {
    loadAnalytics()
  } else if (wasLoaded || document.cookie.includes('_ga')) {
    // A loaded tag can't be unloaded: clear its cookies and reload without it
    clearAnalyticsCookies()
    if (wasLoaded) window.location.reload()
  }
}

function openBanner({ focus = false } = {}) {
  if (banner) return
  banner = document.createElement('section')
  banner.className = 'consent'
  banner.setAttribute('aria-label', 'Cookie choices')
  banner.innerHTML = `
    <p class="consent__text">I use Google Analytics cookies to see how this site is used, only if you agree.
      <a href="/privacy/">Privacy policy</a></p>
    <div class="consent__actions">
      <button type="button" class="consent__btn" data-consent="declined">Decline</button>
      <button type="button" class="consent__btn" data-consent="accepted">Accept</button>
    </div>`
  banner.querySelectorAll('[data-consent]').forEach((btn) => {
    btn.addEventListener('click', () => choose(btn.dataset.consent))
  })
  document.body.appendChild(banner)
  if (focus) banner.querySelector('button').focus()
}

export function initConsent() {
  const choice = readChoice()
  if (choice === 'accepted') {
    if (document.readyState === 'complete') loadAnalytics()
    else window.addEventListener('load', loadAnalytics, { once: true })
  } else if (choice !== 'declined') {
    openBanner()
  }

  document.querySelectorAll('[data-cookie-settings]').forEach((btn) => {
    btn.addEventListener('click', () => openBanner({ focus: true }))
  })
}
