// Inject full-screen overlay
const overlay = document.createElement('div')
overlay.id = 'page-loader'
document.documentElement.appendChild(overlay)

// If we arrived via internal navigation, start overlay visible and fade it out only when fully loaded
if (sessionStorage.getItem('navigating')) {
  sessionStorage.removeItem('navigating')
  overlay.style.opacity = '1'
  overlay.style.pointerEvents = 'all'

  const reveal = () => {
    overlay.style.opacity = '0'
    setTimeout(() => { overlay.style.pointerEvents = 'none' }, 400)
  }

  if (document.readyState === 'complete') {
    reveal()
  } else {
    window.addEventListener('load', reveal, { once: true })
  }
}

// bfcache restore (back/forward button): reset any stuck overlay state
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    overlay.style.opacity = '0'
    overlay.style.pointerEvents = 'none'
    document.body.classList.remove('is-leaving')
    sessionStorage.removeItem('navigating')
  }
})

// Exit: cover screen then navigate
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]')
  if (!link) return

  const href = link.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return

  e.preventDefault()

  overlay.style.opacity = '1'
  overlay.style.pointerEvents = 'all'
  document.body.classList.add('is-leaving')
  sessionStorage.setItem('navigating', '1')

  setTimeout(() => { window.location.href = href }, 300)
})
