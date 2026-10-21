import './style.css'
import './loader.js'
import {
  ejes, ejeColors, ESTADOS, ejeKey, ejeLabel, accionables, responsables,
  esc, loadRelevamiento, latestByAccionable, countEstados, estadoObjetivo, loadingHtml, estadoIcon,
} from './relevamiento-store.js'

const container = document.getElementById('resultados-content')
container.innerHTML = loadingHtml('Cargando resultados…')
const { data } = await loadRelevamiento()
const latest = latestByAccionable(data)
const relevamientos = [...(data.relevamientos ?? [])].sort((a, b) =>
  (b.fecha ?? '').localeCompare(a.fecha ?? '') || (b.creado ?? '').localeCompare(a.creado ?? '')
)

const ORDEN = ['cumplido', 'en_progreso', 'no_cumplido', 'sin_relevar']
const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0)
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`
const itemsDe = (objId) => accionables.filter((a) => a.objetivo_id === objId)

const sectionTitle = (title, sub = '') => `
  <div class="space-y-1">
    <h2 class="text-xl sm:text-2xl font-bold text-white">${title}</h2>
    ${sub ? `<p class="text-base text-brand-gray">${sub}</p>` : ''}
  </div>`

const pill = (estado) => `
  <span class="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 border shrink-0"
        style="color:${ESTADOS[estado].hex}; border-color:${ESTADOS[estado].hex}50; background:${ESTADOS[estado].hex}14">
    ${estadoIcon(estado)}${ESTADOS[estado].label}
  </span>`

// Donut of accionables per estado; 2-unit gap between segments
const donut = (counts, size = 'w-44 h-44') => {
  const total = ORDEN.reduce((s, e) => s + counts[e], 0)
  const r = 40
  const C = 2 * Math.PI * r
  const active = ORDEN.filter((e) => counts[e] > 0)
  const gap = active.length > 1 ? 2 : 0
  let offset = 0
  const arcs = active.map((e) => {
    const len = (counts[e] / total) * C
    const arc = `
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${ESTADOS[e].hex}" stroke-width="12"
              stroke-dasharray="${Math.max(len - gap, 0.5)} ${C}" stroke-dashoffset="${-offset}">
        <title>${ESTADOS[e].label}: ${counts[e]} (${pct(counts[e], total)}%)</title>
      </circle>`
    offset += len
    return arc
  }).join('')
  return `
    <div class="relative ${size} shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="Accionables por estado">${arcs}</svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-bold text-white">${total}</span>
        <span class="text-sm text-brand-gray">accionables</span>
      </div>
    </div>`
}

// Single-ratio ring (meter) for % cumplido
const ring = (value, total) => {
  const r = 42
  const C = 2 * Math.PI * r
  const p = pct(value, total)
  return `
    <div class="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="${p}% cumplido">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="currentColor" stroke-width="8" class="text-white/10"/>
        ${value > 0 ? `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${ESTADOS.cumplido.hex}" stroke-width="8"
                stroke-linecap="round" stroke-dasharray="${(value / total) * C} ${C}"/>` : ''}
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-white">${p}%</span>
        <span class="text-xs text-brand-gray">cumplido</span>
      </div>
    </div>`
}

const leyenda = (counts, total) => `
  <ul class="space-y-3 w-full sm:w-60">
    ${ORDEN.map((e) => `
      <li class="flex items-center gap-3 text-base">
        <span style="color:${ESTADOS[e].hex}">${estadoIcon(e, 'w-5 h-5')}</span>
        <span class="flex-1 text-white/90 whitespace-nowrap">${ESTADOS[e].label}</span>
        <span class="font-semibold text-white tabular-nums">${counts[e]}</span>
        <span class="w-12 text-right text-brand-gray tabular-nums">${pct(counts[e], total)}%</span>
      </li>`).join('')}
  </ul>`

// --- Resumen ---
const totalCounts = countEstados(accionables, latest)
const objetivosConAcc = ejes.flatMap((e) => e.objetivos).filter((o) => o.accionables.length > 0)
const objetivosCumplidos = objetivosConAcc.filter((o) => estadoObjetivo(itemsDe(o.id), latest) === 'cumplido').length

const resumenHtml = `
  <div class="rounded-2xl border border-white/10 bg-white/4 p-6 sm:p-8 grid gap-8 md:grid-cols-[1fr_auto] items-center">
    <div class="space-y-2">
      <p class="text-base text-brand-gray">Objetivos cumplidos</p>
      <p class="text-6xl font-bold text-white">${pct(objetivosCumplidos, objetivosConAcc.length)}%</p>
      <p class="text-lg text-white/80">${objetivosCumplidos} de ${objetivosConAcc.length} objetivos</p>
      <p class="text-sm text-brand-gray">Un objetivo está cumplido cuando todos sus accionables lo están.</p>
    </div>
    <div class="flex flex-col sm:flex-row items-center gap-6">
      ${donut(totalCounts, 'w-40 h-40')}
      ${leyenda(totalCounts, accionables.length)}
    </div>
  </div>`

// --- Por eje: tarjetas con anillo ---
const ejesCardsHtml = `
  <div class="grid gap-4 sm:grid-cols-3">
    ${ejes.map((eje) => {
      const key = ejeKey(eje)
      const color = ejeColors[key] ?? ejeColors.A
      const items = accionables.filter((a) => a.eje === key)
      const counts = countEstados(items, latest)
      const objs = eje.objetivos.filter((o) => o.accionables.length > 0)
      const objCumplidos = objs.filter((o) => estadoObjetivo(itemsDe(o.id), latest) === 'cumplido').length
      return `
        <a href="#eje-${key}" class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 p-5 border-t-4 ${color.border} transition-colors">
          <div class="space-y-1 flex-1">
            <p class="text-sm font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
            <p class="text-base font-semibold text-white leading-snug">${ejeLabel(eje)}</p>
          </div>
          <div class="flex justify-center">${ring(counts.cumplido, items.length)}</div>
          <p class="text-center text-sm text-brand-gray">${objCumplidos} de ${plural(objs.length, 'objetivo cumplido', 'objetivos cumplidos')}</p>
          <div class="flex justify-center gap-4 text-sm">
            ${['cumplido', 'en_progreso', 'no_cumplido'].map((e) => `
              <span class="inline-flex items-center gap-1" title="${ESTADOS[e].label}" style="color:${ESTADOS[e].hex}">
                ${estadoIcon(e)}<span class="text-white font-semibold">${counts[e]}</span>
              </span>`).join('')}
          </div>
        </a>`
    }).join('')}
  </div>`

// --- Mapa de objetivos (semáforo) ---
const mapaHtml = `
  <div class="space-y-5">
    ${ejes.map((eje) => {
      const key = ejeKey(eje)
      const color = ejeColors[key] ?? ejeColors.A
      const objs = eje.objetivos.filter((o) => o.accionables.length > 0)
      return `
        <div class="space-y-2">
          <p class="text-sm font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            ${objs.map((obj) => {
              const estado = estadoObjetivo(itemsDe(obj.id), latest)
              const hex = ESTADOS[estado].hex
              return `
                <a href="#obj-${obj.id}" title="${obj.id} · ${esc(obj.objetivo)} — ${ESTADOS[estado].label}"
                   class="rounded-xl border p-3 flex flex-col items-center gap-1.5 hover:brightness-125 transition"
                   style="border-color:${hex}60; background:${hex}1f; color:${hex}">
                  ${estadoIcon(estado, 'w-6 h-6')}
                  <span class="text-base font-mono font-bold text-white">${obj.id}</span>
                  <span class="text-xs">${ESTADOS[estado].label}</span>
                </a>`
            }).join('')}
          </div>
        </div>`
    }).join('')}
  </div>`

// --- Detalle por objetivo ---
const accionableDetalle = (a) => {
  const r = latest.get(a.key)
  return `
    <li class="space-y-2 py-4 border-t border-white/8 first:border-t-0">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <p class="text-white text-base font-medium leading-snug flex-1 min-w-48">${esc(a.accionable)}</p>
        ${pill(r?.estado ?? 'sin_relevar')}
      </div>
      <p class="text-sm text-brand-gray">${esc(a.responsable)}${r ? ` · ${esc(r.fecha)} · ${esc(r.relevado_por)}` : ''}</p>
      ${r?.comentario ? `<p class="text-base text-white/80 leading-relaxed border-l-2 border-white/15 pl-3">${esc(r.comentario)}</p>` : ''}
    </li>`
}

const detalleHtml = ejes.map((eje) => {
  const key = ejeKey(eje)
  const color = ejeColors[key] ?? ejeColors.A
  const objs = eje.objetivos.filter((o) => o.accionables.length > 0)
  return `
    <section id="eje-${key}" class="space-y-3 scroll-mt-6">
      <div class="border-l-4 ${color.border} pl-5 space-y-1">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
        <h3 class="text-xl font-bold text-white leading-tight">${ejeLabel(eje)}</h3>
      </div>
      ${objs.map((obj) => {
        const items = itemsDe(obj.id)
        const counts = countEstados(items, latest)
        return `
          <details id="obj-${obj.id}" class="group rounded-xl border border-white/10 bg-white/4 px-5 py-4 scroll-mt-6">
            <summary class="flex cursor-pointer list-none items-start gap-3">
              <span class="mt-0.5 text-sm font-mono font-bold ${color.text} shrink-0 w-7">${obj.id}</span>
              <div class="flex-1 space-y-2">
                <p class="text-white text-base sm:text-lg font-semibold leading-snug">${obj.objetivo}</p>
                <div class="flex flex-wrap items-center gap-3">
                  ${pill(estadoObjetivo(items, latest))}
                  <span class="text-sm text-brand-gray">${counts.cumplido} de ${plural(items.length, 'accionable cumplido', 'accionables cumplidos')}</span>
                </div>
              </div>
              <svg class="w-5 h-5 mt-1 text-brand-gray transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </summary>
            <ul class="mt-3 sm:ml-10">${items.map(accionableDetalle).join('')}</ul>
          </details>`
      }).join('')}
    </section>`
}).join('')

// Open the objetivo targeted from the mapa
window.addEventListener('hashchange', () => {
  const el = document.querySelector(location.hash)
  if (el?.tagName === 'DETAILS') el.open = true
})

// --- Por responsable: tabla ---
const filasResponsables = responsables
  .map((r) => {
    const items = accionables.filter((a) => a.responsable === r)
    return { r, total: items.length, counts: countEstados(items, latest) }
  })
  .sort((a, b) => pct(b.counts.cumplido, b.total) - pct(a.counts.cumplido, a.total) || a.r.localeCompare(b.r, 'es'))

const th = (e) => `
  <th class="px-2 py-3 font-medium" title="${ESTADOS[e].label}">
    <span class="inline-flex justify-center w-full" style="color:${ESTADOS[e].hex}">${estadoIcon(e, 'w-5 h-5')}</span>
    <span class="sr-only">${ESTADOS[e].label}</span>
  </th>`

const responsablesHtml = `
  <div class="overflow-x-auto rounded-xl border border-white/10">
    <table class="w-full text-base">
      <thead class="bg-white/5 text-sm text-brand-gray">
        <tr>
          <th class="text-left px-4 py-3 font-medium">Responsable</th>
          ${ORDEN.map(th).join('')}
          <th class="text-left px-4 py-3 font-medium min-w-36">Cumplido</th>
        </tr>
      </thead>
      <tbody>
        ${filasResponsables.map(({ r, total, counts }) => {
          const p = pct(counts.cumplido, total)
          return `
            <tr class="border-t border-white/8">
              <td class="px-4 py-3 text-white/90 leading-snug">${esc(r)}</td>
              ${ORDEN.map((e) => `<td class="px-2 py-3 text-center tabular-nums ${counts[e] ? 'text-white' : 'text-brand-gray/40'}">${counts[e]}</td>`).join('')}
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div class="h-full rounded-full" style="width:${p}%; background:${ESTADOS.cumplido.hex}"></div>
                  </div>
                  <span class="text-sm text-white tabular-nums w-10 text-right">${p}%</span>
                </div>
              </td>
            </tr>`
        }).join('')}
      </tbody>
    </table>
  </div>`

// --- Historial ---
const historialHtml = relevamientos.length === 0
  ? `<p class="text-base text-brand-gray">Todavía no hay relevamientos cargados.</p>`
  : `<ul class="space-y-2">
      ${relevamientos.map((r) => `
        <li class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/4 px-5 py-4">
          <div>
            <p class="text-white text-base font-medium">${esc(r.relevado_por)}</p>
            <p class="text-sm text-brand-gray">${esc(r.fecha)}</p>
          </div>
          <span class="text-sm text-brand-gray">${plural(r.items.length, 'cambio', 'cambios')}</span>
        </li>`).join('')}
     </ul>`

container.innerHTML = `
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-sm font-mono font-bold uppercase tracking-widest text-brand-green">Resultados</p>
    <h1 class="text-3xl font-bold text-white leading-tight">Cumplimiento del plan</h1>
    <p class="text-brand-gray text-base leading-relaxed">
      Último estado relevado de cada accionable${relevamientos[0] ? `, actualizado al ${esc(relevamientos[0].fecha)}` : ''}.
    </p>
    <a href="./relevamiento.html" class="inline-flex items-center gap-2 text-base text-brand-green hover:text-white transition-colors">
      Cargar relevamiento
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  ${resumenHtml}

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${sectionTitle('Por eje', 'Porcentaje de accionables cumplidos en cada eje.')}
    ${ejesCardsHtml}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${sectionTitle('Mapa de objetivos', 'Estado de cada objetivo. Tocá uno para ver el detalle.')}
    ${mapaHtml}
  </div>

  <div class="space-y-8 pt-8 border-t border-white/10">
    ${sectionTitle('Detalle por objetivo')}
    ${detalleHtml}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${sectionTitle('Por responsable', 'Accionables por estado, ordenado por porcentaje cumplido.')}
    ${responsablesHtml}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${sectionTitle('Historial de relevamientos')}
    ${historialHtml}
  </div>
`
