import './style.css'
import './loader.js'
import {
  ejes, ejeColors, ESTADOS, ejeKey, ejeLabel, accionables,
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

// Segmented ring by estado; center shows % cumplido
const ring = (counts, total) => {
  const r = 42
  const C = 2 * Math.PI * r
  const p = pct(counts.cumplido, total)
  const active = ORDEN.filter((e) => counts[e] > 0)
  const gap = active.length > 1 ? 2 : 0
  let offset = 0
  const arcs = active.map((e) => {
    const len = (counts[e] / total) * C
    const arc = `
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${ESTADOS[e].hex}" stroke-width="8"
              stroke-dasharray="${Math.max(len - gap, 0.5)} ${C}" stroke-dashoffset="${-offset}">
        <title>${ESTADOS[e].label}: ${counts[e]} (${pct(counts[e], total)}%)</title>
      </circle>`
    offset += len
    return arc
  }).join('')
  return `
    <div class="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="${p}% cumplido">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="currentColor" stroke-width="8" class="text-white/10"/>
        ${arcs}
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
          <div class="flex justify-center">${ring(counts, items.length)}</div>
          <p class="text-center text-sm text-brand-gray">${objCumplidos} de ${plural(objs.length, 'objetivo cumplido', 'objetivos cumplidos')}</p>
          <div class="flex justify-center flex-wrap gap-4 text-sm">
            ${ORDEN.map((e) => `
              <span class="inline-flex items-center gap-1" title="${ESTADOS[e].label}" style="color:${ESTADOS[e].hex}">
                ${estadoIcon(e)}<span class="text-white font-semibold">${counts[e]}</span>
              </span>`).join('')}
          </div>
        </a>`
    }).join('')}
  </div>`

// --- Objetivos y accionables por eje ---
const chevron = `<svg class="w-5 h-5 text-brand-gray transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`

const accionableRow = (a) => {
  const r = latest.get(a.key)
  const estado = r?.estado ?? 'sin_relevar'
  const meta = `<p class="text-sm text-brand-gray">${esc(a.responsable)}${r ? ` · ${esc(r.fecha)} · ${esc(r.relevado_por)}` : ''}</p>`
  return `
    <li class="border-t border-white/8 first:border-t-0">
      <details class="group py-3">
        <summary class="flex cursor-pointer list-none flex-wrap items-start gap-3">
          <p class="text-white text-base font-medium leading-snug flex-1 min-w-48">${esc(a.accionable)}</p>
          ${pill(estado)}
          ${chevron}
        </summary>
        <div class="mt-2 space-y-2">
          ${meta}
          ${r?.comentario
            ? `<p class="text-base text-white/80 leading-relaxed border-l-2 border-white/15 pl-3">${esc(r.comentario)}</p>`
            : '<p class="text-sm text-brand-gray italic">Sin comentario.</p>'}
        </div>
      </details>
    </li>`
}

const listasHtml = ejes.map((eje) => {
  const key = ejeKey(eje)
  const color = ejeColors[key] ?? ejeColors.A
  return `
    <section id="eje-${key}" class="space-y-4 scroll-mt-6">
      <div class="border-l-4 ${color.border} pl-5 space-y-1">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
        <h3 class="text-2xl sm:text-3xl font-bold text-white leading-tight">${ejeLabel(eje)}</h3>
      </div>
      ${eje.objetivos.filter((o) => o.accionables.length > 0).map((obj) => {
        // Accionables ordered by estado (cumplido → en progreso → no cumplido → sin relevar), plan order within each
        const items = itemsDe(obj.id)
          .map((a, i) => ({ a, i, estado: latest.get(a.key)?.estado ?? 'sin_relevar' }))
          .sort((x, y) => ORDEN.indexOf(x.estado) - ORDEN.indexOf(y.estado) || x.i - y.i)
          .map(({ a }) => a)
        return `
          <div id="obj-${obj.id}" class="rounded-xl border border-white/10 bg-white/4 px-5 py-4 space-y-3 scroll-mt-6">
            <div class="flex items-start gap-3">
              <span class="mt-0.5 text-sm font-mono font-bold ${color.text} shrink-0 w-7">${obj.id}</span>
              <p class="flex-1 text-white text-base sm:text-lg font-semibold leading-snug">${obj.objetivo}</p>
            </div>
            <div class="sm:ml-10 space-y-1">
              <p class="text-sm font-semibold uppercase tracking-wide text-brand-gray">Accionables</p>
              <ul>${items.map(accionableRow).join('')}</ul>
            </div>
          </div>`
      }).join('')}
    </section>`
}).join('')

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

  <div class="space-y-16 pt-8 border-t border-white/10">
    ${sectionTitle('Objetivos y accionables', 'Estado actual de cada accionable, agrupado por eje y objetivo.')}
    ${listasHtml}
  </div>

`
