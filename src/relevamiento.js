import './style.css'
import './loader.js'
import {
  ejes, ejeColors, ESTADOS, ejeKey, ejeLabel, accionableKey, responsableOf,
  responsables, esc, loadRelevamiento, saveRelevamiento, latestByAccionable, SHEETS_URL, loadingHtml, estadoIcon,
} from './relevamiento-store.js'

const container = document.getElementById('relevamiento-content')
container.innerHTML = loadingHtml('Cargando relevamiento…')
const { data } = await loadRelevamiento()
const latest = latestByAccionable(data)
const today = new Date().toISOString().slice(0, 10)

// Per-viewer conveniences: remembered name and Sheets key
const remembered = (k) => { try { return localStorage.getItem(k) ?? '' } catch { return '' } }
const remember = (k, v) => { try { localStorage.setItem(k, v) } catch {} }

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-brand-gray/50 focus:outline-none focus:border-white/30'
const labelClass = 'block text-sm font-semibold uppercase tracking-widest text-brand-gray'

// Literal class names per estado so Tailwind picks them up
const estadoChecked = {
  cumplido:    'peer-checked:bg-brand-green/15 peer-checked:border-brand-green peer-checked:text-brand-green',
  en_progreso: 'peer-checked:bg-brand-yellow/15 peer-checked:border-brand-yellow peer-checked:text-brand-yellow',
  no_cumplido: 'peer-checked:bg-brand-red/15 peer-checked:border-brand-red peer-checked:text-brand-red',
}

const ultimoHtml = (r) =>
  `Último: <span style="color:${ESTADOS[r.estado]?.hex}">${ESTADOS[r.estado]?.label ?? esc(r.estado)}</span> · ${esc(r.fecha)} · ${esc(r.relevado_por)}`

const accionableHtml = (obj, a, idx) => {
  const key = accionableKey(obj.id, a.nombre)
  const name = `estado-${obj.id}-${idx}`
  const prev = latest.get(key)

  const options = Object.keys(estadoChecked).map((estado) => `
    <label class="cursor-pointer">
      <input type="radio" name="${name}" value="${estado}" class="peer sr-only" ${prev?.estado === estado ? 'checked' : ''}>
      <span class="inline-flex items-center gap-2 text-sm sm:text-base font-medium rounded-full px-4 py-2 border border-white/15 text-brand-gray hover:text-white hover:border-white/30 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 ${estadoChecked[estado]}">
        ${estadoIcon(estado, 'w-5 h-5')}
        ${ESTADOS[estado].label}
      </span>
    </label>`).join('')

  const prevBadge = `<p class="ultimo text-sm text-brand-gray">${prev ? ultimoHtml(prev) : ''}</p>`

  return `
    <li class="accionable space-y-4 rounded-xl border border-white/10 bg-white/4 p-5 sm:p-6"
        data-objetivo="${obj.id}" data-accionable="${esc(a.nombre)}" data-responsable="${esc(responsableOf(a))}"
        data-prev-estado="${prev?.estado ?? ''}" data-prev-comentario="${esc(prev?.comentario ?? '')}">
      <div class="space-y-2">
        <p class="text-white text-base sm:text-lg font-medium leading-snug">${a.nombre}</p>
        <span class="inline-flex items-center gap-1.5 text-sm rounded-full px-3 py-1 bg-white/6 text-brand-gray border border-white/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          ${responsableOf(a)}
        </span>
        ${prevBadge}
      </div>
      <div class="flex flex-wrap gap-2">${options}</div>
      <textarea rows="2" placeholder="Comentario (opcional)" class="${inputClass} resize-y">${esc(prev?.comentario ?? '')}</textarea>
    </li>`
}

const objetivosHtml = ejes.map((eje) => {
  const key = ejeKey(eje)
  const color = ejeColors[key] ?? ejeColors.A
  const objetivos = eje.objetivos.filter((o) => o.accionables.length > 0)

  return `
    <section class="eje-section space-y-6" data-eje="${key}">
      <div class="space-y-1 border-l-4 ${color.border} pl-5">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${color.text}">EJE ${key}</p>
        <h2 class="text-xl sm:text-2xl font-bold text-white leading-tight">${ejeLabel(eje)}</h2>
      </div>
      ${objetivos.map((obj) => `
        <div class="objetivo space-y-3">
          <div class="flex items-start gap-3">
            <span class="mt-1 text-sm font-mono font-bold ${color.text} shrink-0 w-7">${obj.id}</span>
            <p class="text-white text-lg font-semibold leading-snug">${obj.objetivo}</p>
          </div>
          <ul class="space-y-3">
            ${obj.accionables.map((a, i) => accionableHtml(obj, a, i)).join('')}
          </ul>
        </div>`).join('')}
    </section>`
}).join('')

container.innerHTML = `
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-sm font-mono font-bold uppercase tracking-widest text-brand-green">Relevamiento</p>
    <h1 class="text-3xl font-bold text-white leading-tight">¿Se cumplieron los objetivos?</h1>
    <p class="text-brand-gray text-base leading-relaxed">
      Indicá o editá el estado de cada accionable. Un objetivo se considera cumplido cuando todos sus accionables lo están.
      Solo se guardan los accionables que cambies.
    </p>
    <a href="./resultados.html" class="inline-flex items-center gap-2 text-base text-brand-green hover:text-white transition-colors">
      Ver resultados
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  <form id="relevamiento-form" class="space-y-8 sm:space-y-10" novalidate>
    <!-- Datos del relevamiento -->
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="space-y-2">
        <span class="${labelClass}">Relevado por</span>
        <input id="relevado-por" required placeholder="Nombre y cooperativa" value="${esc(remembered('relevado_por'))}" class="${inputClass}">
      </label>
      <label class="space-y-2">
        <span class="${labelClass}">Fecha</span>
        <input id="fecha" type="date" required value="${today}" class="${inputClass} [color-scheme:dark]">
      </label>
      ${SHEETS_URL ? `
      <label class="space-y-2 sm:col-span-2">
        <span class="${labelClass}">Clave de edición</span>
        <input id="clave" type="password" required autocomplete="current-password" value="${esc(remembered('clave'))}" class="${inputClass}">
      </label>` : ''}
    </div>

    <!-- Filtros -->
    <div class="grid gap-4 sm:grid-cols-2 pt-6 border-t border-white/10">
      <label class="space-y-2">
        <span class="${labelClass}">Eje</span>
        <select id="filtro-eje" class="${inputClass} [color-scheme:dark]">
          <option value="">Todos los ejes</option>
          ${ejes.map((e) => `<option value="${ejeKey(e)}">EJE ${ejeKey(e)} — ${ejeLabel(e)}</option>`).join('')}
        </select>
      </label>
      <label class="space-y-2">
        <span class="${labelClass}">Responsable</span>
        <select id="filtro-responsable" class="${inputClass} [color-scheme:dark]">
          <option value="">Todes les responsables</option>
          ${responsables.map((r) => `<option value="${esc(r)}">${esc(r)}</option>`).join('')}
        </select>
      </label>
    </div>

    <div id="objetivos" class="space-y-10">${objetivosHtml}</div>
    <p id="sin-resultados" class="hidden text-brand-gray text-center text-base">No hay accionables para este filtro.</p>

    <!-- Submit -->
    <div class="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-4 bg-brand-black/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
      <p id="form-status" class="text-base text-brand-gray" aria-live="polite">Sin cambios</p>
      <button type="submit" class="rounded-full bg-brand-green px-6 py-3 text-base font-semibold text-brand-black hover:bg-white transition-colors disabled:opacity-50">
        Guardar relevamiento
      </button>
    </div>
  </form>
`

const form = document.getElementById('relevamiento-form')
const status = document.getElementById('form-status')
const filtroEje = document.getElementById('filtro-eje')
const filtroResp = document.getElementById('filtro-responsable')
const items = [...form.querySelectorAll('.accionable')]

// Accionables whose estado or comentario differ from the last saved values
const changed = () => items
  .map((li) => ({
    li,
    estado: li.querySelector('input[type=radio]:checked')?.value,
    comentario: li.querySelector('textarea').value.trim(),
  }))
  .filter(({ li, estado, comentario }) =>
    estado && (estado !== li.dataset.prevEstado || comentario !== li.dataset.prevComentario))

const updateCount = () => {
  const n = changed().length
  status.className = 'text-base text-brand-gray'
  status.textContent = n === 0 ? 'Sin cambios' : `${n} cambio${n === 1 ? '' : 's'} sin guardar`
}

// Hide filtered-out accionables; their selections are kept
function applyFilters() {
  const ejeVal = filtroEje.value
  const respVal = filtroResp.value
  let visible = 0

  for (const section of form.querySelectorAll('.eje-section')) {
    const ejeMatch = !ejeVal || section.dataset.eje === ejeVal
    let sectionVisible = 0
    for (const objetivo of section.querySelectorAll('.objetivo')) {
      let objVisible = 0
      for (const li of objetivo.querySelectorAll('.accionable')) {
        const show = ejeMatch && (!respVal || li.dataset.responsable === respVal)
        li.classList.toggle('hidden', !show)
        if (show) objVisible++
      }
      objetivo.classList.toggle('hidden', objVisible === 0)
      sectionVisible += objVisible
    }
    section.classList.toggle('hidden', sectionVisible === 0)
    visible += sectionVisible
  }
  document.getElementById('sin-resultados').classList.toggle('hidden', visible > 0)
}

filtroEje.addEventListener('change', applyFilters)
filtroResp.addEventListener('change', applyFilters)
form.addEventListener('change', updateCount)
form.addEventListener('input', (e) => { if (e.target.tagName === 'TEXTAREA') updateCount() })

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const relevadoPor = document.getElementById('relevado-por').value.trim()
  const fecha = document.getElementById('fecha').value
  const clave = document.getElementById('clave')?.value ?? ''
  const cambios = changed()

  const error = !relevadoPor ? 'Completá quién realiza el relevamiento.'
    : !fecha ? 'Completá la fecha.'
    : SHEETS_URL && !clave ? 'Completá la clave de edición.'
    : cambios.length === 0 ? 'No hay cambios para guardar.'
    : null
  if (error) {
    status.className = 'text-base text-brand-red'
    status.textContent = error
    return
  }

  remember('relevado_por', relevadoPor)
  if (SHEETS_URL) remember('clave', clave)

  const button = form.querySelector('button[type=submit]')
  button.disabled = true
  status.className = 'text-base text-brand-gray'
  status.textContent = 'Guardando…'

  const entry = {
    id: crypto.randomUUID(),
    fecha,
    creado: new Date().toISOString(),
    relevado_por: relevadoPor,
    items: cambios.map(({ li, estado, comentario }) => ({
      eje: li.closest('.eje-section').dataset.eje,
      objetivo_id: li.dataset.objetivo,
      accionable: li.dataset.accionable,
      responsable: li.dataset.responsable,
      estado,
      comentario,
    })),
  }

  let saved
  try {
    saved = await saveRelevamiento(entry, data, clave)
  } catch (err) {
    button.disabled = false
    status.className = 'text-base text-brand-red'
    status.textContent = `Error al guardar: ${err.message}`
    return
  }

  button.disabled = false
  status.className = 'text-base text-brand-green'
  if (saved) {
    // Saved values become the new baseline for the next edit
    for (const { li, estado, comentario } of cambios) {
      li.dataset.prevEstado = estado
      li.dataset.prevComentario = comentario
      li.querySelector('.ultimo').innerHTML = ultimoHtml({ estado, fecha, relevado_por: relevadoPor })
    }
    status.innerHTML = `${cambios.length} cambio${cambios.length === 1 ? '' : 's'} guardado${cambios.length === 1 ? '' : 's'}. <a href="./resultados.html" class="underline hover:text-white">Ver resultados</a>`
  } else {
    data.relevamientos.push(entry)
    status.textContent = 'Sin servidor: se descargó relevamiento.json. Reemplazá src/data/relevamiento.json con ese archivo.'
  }
})
