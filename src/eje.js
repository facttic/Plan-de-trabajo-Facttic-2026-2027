import './style.css'
import './loader.js'
import plan from './data/plan.json'

const ejes = plan.plan_de_trabajo_facttic_2026_2027

const ejeColors = {
  A: { hex: '#F1DA1C', text: 'text-brand-yellow',   border: 'border-brand-yellow',   dot: 'bg-brand-yellow',   cardBorder: 'hover:border-brand-yellow' },
  B: { hex: '#68DE94', text: 'text-brand-green', border: 'border-brand-green', dot: 'bg-brand-green', cardBorder: 'hover:border-brand-green' },
  C: { hex: '#FF6853', text: 'text-brand-orange',   border: 'border-brand-orange',   dot: 'bg-brand-orange',   cardBorder: 'hover:border-brand-orange' },
}

// --- Routing ---
const params = new URLSearchParams(window.location.search)
const key = params.get('eje')?.toUpperCase()
const eje = ejes.find((e) => e.eje.startsWith(`EJE ${key}`))
const container = document.getElementById('eje-content')

if (!eje) {
  container.innerHTML = `<p class="text-brand-gray text-center">Eje no encontrado.</p>`
} else {
  document.title = `${eje.eje} — Plan Facttic`

  const color = ejeColors[key] ?? ejeColors.A
  const idx = ejes.indexOf(eje)
  const prevEje = ejes[idx - 1] ?? null
  const nextEje = ejes[idx + 1] ?? null
  const prevKey = prevEje?.eje.split(' ')[1]
  const nextKey = nextEje?.eje.split(' ')[1]

  // --- Render ---
  const objetivosHtml = eje.objetivos.map((obj) => `
    <button
      data-id="${obj.id}"
      class="group w-full text-left flex items-start gap-4 bg-white/5 ${color.cardBorder} border border-white/10 rounded-xl px-5 py-4 transition-all duration-200 cursor-pointer hover:bg-white/8"
    >
      <span class="mt-0.5 text-xs font-mono font-bold ${color.text} shrink-0 w-6">${obj.id}</span>
      <span class="text-white/90 font-medium leading-snug flex-1">${obj.objetivo}</span>
      ${obj.accionables.length > 0
        ? `<span class="shrink-0 mt-0.5 text-xs ${color.text} opacity-0 group-hover:opacity-60 transition-opacity">
            ${obj.accionables.length} →
           </span>`
        : `<svg class="shrink-0 mt-0.5 w-4 h-4 text-brand-red opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
           </svg>`
      }
    </button>
  `).join('')

  container.innerHTML = `
    <!-- Header -->
    <div class="space-y-3 border-l-4 ${color.border} pl-5">
      <p class="text-xs font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
      <h1 class="text-2xl font-bold text-white leading-tight">${eje.eje.split(' - ').slice(1).join(' - ')}</h1>
      <p class="text-brand-gray text-sm leading-relaxed">${eje.descripcion}</p>
      <p class="${color.text} text-sm opacity-50">${eje.objetivos.length} objetivos</p>
    </div>

    <!-- Objetivos -->
    <div class="space-y-2">
      ${objetivosHtml}
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-6 border-t border-white/10">
      ${prevEje
        ? `<a href="/eje.html?eje=${prevKey}" class="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            EJE ${prevKey}
           </a>`
        : `<span></span>`
      }
      ${nextEje
        ? `<a href="/eje.html?eje=${nextKey}" class="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors">
            EJE ${nextKey}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
           </a>`
        : `<span></span>`
      }
    </div>
  `

  // --- Modal logic ---
  const modal      = document.getElementById('modal')
  const backdrop   = document.getElementById('modal-backdrop')
  const panel      = document.getElementById('modal-panel')
  const bar        = document.getElementById('modal-bar')
  const modalId    = document.getElementById('modal-id')
  const modalTitle = document.getElementById('modal-title')
  const modalList  = document.getElementById('modal-list')
  const closeBtn   = document.getElementById('modal-close')

  function openModal(obj) {
    modalId.textContent    = obj.id
    modalId.className      = `text-xs font-mono font-bold ${color.text}`
    modalTitle.textContent = obj.objetivo
    bar.style.background   = color.hex

    if (!obj.accionables.length) {
      modalList.innerHTML = `
        <li class="flex items-center gap-3 py-4 px-1 text-brand-red/80">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          <span class="text-sm">Este objetivo no tiene accionables.</span>
        </li>
      `
    } else {
      modalList.innerHTML = obj.accionables.map((a, i) => {
      const plazoBadge = a.plazo
        ? `<span class="inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 border" style="color:${color.hex}; border-color:${color.hex}40; background:${color.hex}12">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            ${a.plazo}
           </span>`
        : ''
      const responsableBadge = a.responsable
        ? `<span class="inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-white/6 text-brand-gray border border-white/8">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            ${a.responsable}
           </span>`
        : ''
      const badges = plazoBadge || responsableBadge
        ? `<div class="flex flex-wrap gap-2 pt-1">${plazoBadge}${responsableBadge}</div>`
        : ''
      const detalle = a.descripcion_detalle
        ? `<p class="text-brand-gray text-xs leading-relaxed">${a.descripcion_detalle}</p>`
        : ''
      return `
        <li
          class="space-y-2 rounded-lg border border-white/8 bg-white/4 p-4 opacity-0 translate-y-2 transition-all duration-300"
          style="transition-delay: ${i * 70}ms"
        >
          <p class="text-white/90 text-sm font-medium leading-snug">${a.nombre}</p>
          ${detalle}
          ${badges}
        </li>
      `
      }).join('')
    }

    modal.classList.remove('hidden')
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1'
      panel.style.opacity    = '1'
      panel.style.transform  = 'translateY(0)'

      modalList.querySelectorAll('li').forEach((li) => {
        requestAnimationFrame(() => {
          li.style.opacity   = '1'
          li.style.transform = 'translateY(0)'
        })
      })
    })

    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    backdrop.style.opacity = '0'
    panel.style.opacity    = '0'
    panel.style.transform  = 'translateY(1rem)'

    setTimeout(() => {
      modal.classList.add('hidden')
      document.body.style.overflow = ''
    }, 300)
  }

  container.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const obj = eje.objetivos.find((o) => o.id === btn.dataset.id)
      if (obj) openModal(obj)
    })
  })

  closeBtn.addEventListener('click', closeModal)
  backdrop.addEventListener('click', closeModal)
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal() })
}
