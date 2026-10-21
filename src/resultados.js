import './style.css'
import './loader.js'
import {
  ejes, ejeColors, ESTADOS, ejeKey, ejeLabel, accionables, responsables,
  esc, loadRelevamiento, latestByAccionable, countEstados, estadoObjetivo, loadingHtml,
} from './relevamiento-store.js'

const container = document.getElementById('resultados-content')
container.innerHTML = loadingHtml('Cargando resultados…')
const { data } = await loadRelevamiento()
const latest = latestByAccionable(data)
const relevamientos = [...(data.relevamientos ?? [])].sort((a, b) =>
  (b.fecha ?? '').localeCompare(a.fecha ?? '') || (b.creado ?? '').localeCompare(a.creado ?? '')
)

const sectionTitle = (text) =>
  `<p class="text-xs font-semibold uppercase tracking-widest text-brand-gray/60">${text}</p>`

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0)

// Horizontal stacked bar of estado counts
const stackedBar = (counts, height = 'h-2.5') => {
  const total = Object.values(counts).reduce((s, n) => s + n, 0)
  const segments = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([estado, n]) => `<div title="${ESTADOS[estado].label}: ${n}" style="width:${(n / total) * 100}%; background:${ESTADOS[estado].hex}"></div>`)
    .join('')
  return `<div class="flex ${height} w-full gap-0.5 overflow-hidden rounded-full bg-white/6">${segments}</div>`
}

const pill = (estado) => `
  <span class="inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 border shrink-0"
        style="color:${ESTADOS[estado].hex}; border-color:${ESTADOS[estado].hex}40; background:${ESTADOS[estado].hex}12">
    ${ESTADOS[estado].label}
  </span>`

const legend = `
  <div class="flex flex-wrap gap-x-4 gap-y-1.5">
    ${Object.values(ESTADOS).map((e) => `
      <span class="inline-flex items-center gap-1.5 text-xs text-brand-gray">
        <span class="w-2.5 h-2.5 rounded-full" style="background:${e.hex}"></span>${e.label}
      </span>`).join('')}
  </div>`

// --- Resumen ---
const totalCounts = countEstados(accionables, latest)
const objetivosConAcc = ejes.flatMap((e) => e.objetivos).filter((o) => o.accionables.length > 0)
const itemsDe = (objId) => accionables.filter((a) => a.objetivo_id === objId)
const objetivosCumplidos = objetivosConAcc.filter((o) => estadoObjetivo(itemsDe(o.id), latest) === 'cumplido').length

const statTile = (label, value, sub, hex) => `
  <div class="rounded-xl border border-white/8 bg-white/4 p-4 space-y-1">
    <p class="text-xs text-brand-gray">${label}</p>
    <p class="text-2xl font-bold" style="color:${hex}">${value}</p>
    <p class="text-xs text-brand-gray/60">${sub}</p>
  </div>`

const resumenHtml = `
  <div class="space-y-4">
    ${sectionTitle('Resumen')}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      ${statTile('Objetivos cumplidos', `${objetivosCumplidos}/${objetivosConAcc.length}`, `${pct(objetivosCumplidos, objetivosConAcc.length)}% del plan`, '#FFFFFF')}
      ${statTile('Cumplidos', totalCounts.cumplido, `${pct(totalCounts.cumplido, accionables.length)}% de accionables`, ESTADOS.cumplido.hex)}
      ${statTile('En progreso', totalCounts.en_progreso, `${pct(totalCounts.en_progreso, accionables.length)}% de accionables`, ESTADOS.en_progreso.hex)}
      ${statTile('No cumplidos', totalCounts.no_cumplido, `${totalCounts.sin_relevar} sin relevar`, ESTADOS.no_cumplido.hex)}
    </div>
    ${stackedBar(totalCounts, 'h-3')}
    ${legend}
  </div>`

// --- Por eje / objetivo ---
const accionableDetalle = (a) => {
  const r = latest.get(a.key)
  return `
    <li class="space-y-1 py-2 border-t border-white/6 first:border-t-0">
      <div class="flex items-start justify-between gap-3">
        <p class="text-white/80 text-xs font-medium leading-snug">${esc(a.accionable)}</p>
        ${pill(r?.estado ?? 'sin_relevar')}
      </div>
      <p class="text-brand-gray/70 text-xs">${esc(a.responsable)}${r ? ` · ${esc(r.fecha)} · ${esc(r.relevado_por)}` : ''}</p>
      ${r?.comentario ? `<p class="text-brand-gray text-xs leading-relaxed italic">“${esc(r.comentario)}”</p>` : ''}
    </li>`
}

const ejesHtml = ejes.map((eje) => {
  const key = ejeKey(eje)
  const color = ejeColors[key] ?? ejeColors.A
  const ejeItems = accionables.filter((a) => a.eje === key)
  const counts = countEstados(ejeItems, latest)

  const objetivosHtml = eje.objetivos.filter((o) => o.accionables.length > 0).map((obj) => {
    const items = itemsDe(obj.id)
    return `
      <details class="group rounded-xl border border-white/8 bg-white/4 px-4 py-3">
        <summary class="flex cursor-pointer list-none items-start gap-3">
          <span class="mt-0.5 text-xs font-mono font-bold ${color.text} shrink-0 w-6">${obj.id}</span>
          <div class="flex-1 space-y-2">
            <div class="flex items-start justify-between gap-3">
              <span class="text-white/90 text-sm font-medium leading-snug">${obj.objetivo}</span>
              ${pill(estadoObjetivo(items, latest))}
            </div>
            ${stackedBar(countEstados(items, latest), 'h-1.5')}
          </div>
        </summary>
        <ul class="mt-3 ml-9">${items.map(accionableDetalle).join('')}</ul>
      </details>`
  }).join('')

  return `
    <section class="space-y-4">
      <div class="space-y-2 border-l-4 ${color.border} pl-5">
        <div class="flex items-baseline justify-between gap-3">
          <p class="text-xs font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
          <p class="text-xs ${color.text}">${pct(counts.cumplido, ejeItems.length)}% cumplido</p>
        </div>
        <h2 class="text-lg font-bold text-white leading-tight">${ejeLabel(eje)}</h2>
        ${stackedBar(counts)}
      </div>
      <div class="space-y-2">${objetivosHtml}</div>
    </section>`
}).join('')

// --- Por responsable ---
const responsablesHtml = `
  <div class="space-y-4">
    ${sectionTitle('Por responsable')}
    <ul class="space-y-3">
      ${responsables.map((r) => {
        const items = accionables.filter((a) => a.responsable === r)
        const counts = countEstados(items, latest)
        return `
          <li class="space-y-1.5">
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-white/80 text-xs font-medium leading-snug">${esc(r)}</p>
              <p class="text-xs text-brand-gray shrink-0">${counts.cumplido}/${items.length}</p>
            </div>
            ${stackedBar(counts, 'h-2')}
          </li>`
      }).join('')}
    </ul>
  </div>`

// --- Historial ---
const historialHtml = `
  <div class="space-y-4">
    ${sectionTitle('Historial de relevamientos')}
    ${relevamientos.length === 0
      ? `<p class="text-sm text-brand-gray">Todavía no hay relevamientos cargados.</p>`
      : `<ul class="space-y-2">
          ${relevamientos.map((r) => `
            <li class="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
              <div>
                <p class="text-white/90 text-sm font-medium">${esc(r.relevado_por)}</p>
                <p class="text-xs text-brand-gray">${esc(r.fecha)}</p>
              </div>
              <span class="text-xs text-brand-gray">${r.items.length} accionable${r.items.length === 1 ? '' : 's'}</span>
            </li>`).join('')}
         </ul>`
    }
  </div>`

container.innerHTML = `
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Resultados</p>
    <h1 class="text-2xl font-bold text-white leading-tight">Cumplimiento del plan</h1>
    <p class="text-brand-gray text-sm leading-relaxed">
      Último estado relevado de cada accionable${relevamientos[0] ? `, actualizado al ${esc(relevamientos[0].fecha)}` : ''}.
    </p>
    <a href="./relevamiento.html" class="inline-flex items-center gap-2 text-sm text-brand-green hover:text-white transition-colors">
      Cargar relevamiento
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  ${resumenHtml}

  <div class="space-y-10 pt-6 border-t border-white/10">${ejesHtml}</div>

  <div class="pt-6 border-t border-white/10">${responsablesHtml}</div>

  <div class="pt-6 border-t border-white/10">${historialHtml}</div>
`
