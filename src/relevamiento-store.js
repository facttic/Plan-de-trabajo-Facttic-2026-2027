import plan from './data/plan.json'
import seed from './data/relevamiento.json'

export const ejes = plan.plan_de_trabajo_facttic_2026_2027

export const ejeColors = {
  A: { hex: '#F1DA1C', text: 'text-brand-yellow', border: 'border-brand-yellow' },
  B: { hex: '#68DE94', text: 'text-brand-green',  border: 'border-brand-green'  },
  C: { hex: '#FF6853', text: 'text-brand-orange', border: 'border-brand-orange' },
}

export const ESTADOS = {
  cumplido:    { label: 'Cumplido',    hex: '#68DE94', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  en_progreso: { label: 'En progreso', hex: '#F1DA1C', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  no_cumplido: { label: 'No cumplido', hex: '#FF4353', icon: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  sin_relevar: { label: 'Sin relevar', hex: '#A0A19E', icon: 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
}

// Status is never color-only: every estado carries its icon
export const estadoIcon = (estado, cls = 'w-4 h-4') => `
  <svg class="${cls} shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="${ESTADOS[estado]?.icon ?? ESTADOS.sin_relevar.icon}"/>
  </svg>`

const API = './api/relevamiento'

// Google Apps Script web app (see apps-script/Code.gs); when unset, uses the local JSON
export const SHEETS_URL = import.meta.env.VITE_SHEETS_URL

export const ejeKey = (eje) => eje.eje.split(' ')[1]
export const ejeLabel = (eje) => eje.eje.split(' - ').slice(1).join(' - ')
export const accionableKey = (objId, nombre) => `${objId}::${nombre}`
export const responsableOf = (a) => a.responsable?.trim() || 'Sin responsable'

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

// Flat list of every accionable with its eje / objetivo context
export const accionables = ejes.flatMap((eje) =>
  eje.objetivos.flatMap((obj) =>
    obj.accionables.map((a) => ({
      eje: ejeKey(eje),
      objetivo_id: obj.id,
      accionable: a.nombre,
      responsable: responsableOf(a),
      key: accionableKey(obj.id, a.nombre),
    }))
  )
)

export const responsables = [...new Set(accionables.map((a) => a.responsable))]
  .sort((a, b) => a.localeCompare(b, 'es'))

export const loadingHtml = (text) => `
  <div class="flex flex-col items-center justify-center gap-4 py-24" role="status">
    <div class="data-loader"></div>
    <p class="text-sm text-brand-gray">${text}</p>
  </div>`

// Live data from Google Sheets or the dev/preview server API; falls back to the JSON bundled at build time
export async function loadRelevamiento() {
  try {
    const res = await fetch(SHEETS_URL || API, { cache: 'no-store' })
    if (res.ok) return { data: await res.json(), live: true }
  } catch {}
  return { data: structuredClone(seed), live: false }
}

// Returns true when persisted, false when a JSON download was triggered instead; throws on Sheets errors
export async function saveRelevamiento(entry, current, clave) {
  if (SHEETS_URL) {
    // text/plain avoids a CORS preflight, which Apps Script doesn't answer
    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ clave, entry }),
    })
    const result = await res.json()
    if (!result.ok) throw new Error(result.error || 'No se pudo guardar.')
    return true
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    if (res.ok) return true
  } catch {}

  const merged = { relevamientos: [...(current?.relevamientos ?? []), entry] }
  const blob = new Blob([JSON.stringify(merged, null, 2) + '\n'], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'relevamiento.json'
  link.click()
  URL.revokeObjectURL(link.href)
  return false
}

// Latest estado per accionable key, ordered by fecha then submission time
export function latestByAccionable(data) {
  const sorted = [...(data?.relevamientos ?? [])].sort((a, b) =>
    (a.fecha ?? '').localeCompare(b.fecha ?? '') || (a.creado ?? '').localeCompare(b.creado ?? '')
  )
  const latest = new Map()
  for (const r of sorted) {
    for (const item of r.items ?? []) {
      latest.set(accionableKey(item.objetivo_id, item.accionable), {
        ...item, fecha: r.fecha, relevado_por: r.relevado_por,
      })
    }
  }
  return latest
}

export function countEstados(items, latest) {
  const counts = { cumplido: 0, en_progreso: 0, no_cumplido: 0, sin_relevar: 0 }
  for (const a of items) counts[latest.get(a.key)?.estado ?? 'sin_relevar']++
  return counts
}

// An objetivo is cumplido only when all its accionables are
export function estadoObjetivo(items, latest) {
  const c = countEstados(items, latest)
  if (items.length === 0 || c.sin_relevar === items.length) return 'sin_relevar'
  if (c.cumplido === items.length) return 'cumplido'
  if (c.cumplido + c.en_progreso > 0) return 'en_progreso'
  return 'no_cumplido'
}
