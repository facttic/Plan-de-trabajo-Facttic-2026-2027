import './style.css'
import './loader.js'
import plan from './data/plan.json'

const ejes = plan.plan_de_trabajo_facttic_2026_2027

const ejeColors = {
  A: { hex: '#F1DA1C', text: 'text-brand-yellow', border: 'border-brand-yellow' },
  B: { hex: '#68DE94', text: 'text-brand-green',  border: 'border-brand-green'  },
  C: { hex: '#FF6853', text: 'text-brand-orange', border: 'border-brand-orange' },
}

const params  = new URLSearchParams(window.location.search)
const ejeKey  = params.get('eje')?.toUpperCase()
const objId   = params.get('obj')?.toUpperCase()

const eje     = ejes.find((e) => e.eje.startsWith(`EJE ${ejeKey}`))
const obj     = eje?.objetivos.find((o) => o.id === objId)
const container = document.getElementById('objetivo-content')
const backLink  = document.getElementById('back-link')

backLink.href = `./eje.html?eje=${ejeKey}`

if (!eje || !obj) {
  container.innerHTML = `<p class="text-brand-gray text-center">Objetivo no encontrado.</p>`
} else {
  document.title = `${obj.id} — Plan Facttic`

  const color  = ejeColors[ejeKey] ?? ejeColors.A
  const objIdx = eje.objetivos.indexOf(obj)
  const prev   = eje.objetivos[objIdx - 1] ?? null
  const next   = eje.objetivos[objIdx + 1] ?? null

  const accionablesHtml = obj.accionables.length === 0
    ? `<li class="flex items-center gap-3 py-4 px-1 text-brand-red/80">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <span class="text-sm">Este objetivo no tiene accionables.</span>
       </li>`
    : obj.accionables.map((a) => {
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
          ? `<p class="text-brand-gray text-sm leading-relaxed">${a.descripcion_detalle}</p>`
          : ''

        const entregablesHtml = a.entregables?.length
          ? `<div class="space-y-1.5 pt-3 border-t border-white/8">
              <p class="text-xs font-semibold uppercase tracking-widest" style="color:${color.hex}; opacity:0.7">Entregables</p>
              <ul class="space-y-1.5">
                ${a.entregables.map(e => `
                  <li class="space-y-0.5">
                    <p class="text-white/80 text-xs font-medium">${e.nombre}</p>
                    <p class="text-brand-gray text-xs leading-relaxed">${e.descripcion}</p>
                  </li>`).join('')}
              </ul>
             </div>`
          : ''

        const metricasHtml = a.metricas?.length
          ? `<div class="space-y-1.5 pt-3 border-t border-white/8">
              <p class="text-xs font-semibold uppercase tracking-widest" style="color:${color.hex}; opacity:0.7">Métricas</p>
              <ul class="space-y-1.5">
                ${a.metricas.map(m => `
                  <li class="space-y-0.5">
                    <p class="text-white/80 text-xs font-medium">${m.nombre}</p>
                    <p class="text-brand-gray text-xs leading-relaxed">${m.descripcion}</p>
                  </li>`).join('')}
              </ul>
             </div>`
          : ''

        return `
          <li class="space-y-2 rounded-xl border border-white/8 bg-white/4 p-4 sm:p-5">
            <p class="text-white/90 text-sm font-medium leading-snug">${a.nombre}</p>
            ${detalle}
            ${badges}
            ${entregablesHtml}
            ${metricasHtml}
          </li>`
      }).join('')

  container.innerHTML = `
    <!-- Header -->
    <div class="space-y-3 border-l-4 ${color.border} pl-5">
      <p class="text-xs font-mono font-bold uppercase tracking-widest ${color.text}">${obj.id}</p>
      <h1 class="text-2xl font-bold text-white leading-tight">${obj.objetivo}</h1>
      <p class="${color.text} text-sm opacity-50">${obj.accionables.length} accionables</p>
    </div>

    <!-- Accionables -->
    <div class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-widest text-brand-gray/60">Accionables</p>
      <ul class="space-y-3">
        ${accionablesHtml}
      </ul>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-6 border-t border-white/10">
      ${prev
        ? `<a href="./objetivo.html?eje=${ejeKey}&obj=${prev.id}" class="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            ${prev.id}
           </a>`
        : `<span></span>`
      }
      ${next
        ? `<a href="./objetivo.html?eje=${ejeKey}&obj=${next.id}" class="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors">
            ${next.id}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
           </a>`
        : `<span></span>`
      }
    </div>
  `
}
