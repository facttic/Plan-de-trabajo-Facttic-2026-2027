// Backend del relevamiento: pegar en Extensiones > Apps Script de la Google Sheet.
// Configurar la propiedad de script CLAVE (Configuración del proyecto > Propiedades de la secuencia de comandos).

const HISTORIAL = 'Historial'
const ESTADO = 'Estado'
const H_COLS = ['id', 'fecha', 'creado', 'relevado_por', 'eje', 'objetivo_id', 'accionable', 'responsable', 'estado', 'comentario']
const E_COLS = ['eje', 'objetivo_id', 'accionable', 'responsable', 'estado', 'comentario', 'fecha', 'relevado_por']

function sheet_(name, cols) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sh = ss.getSheetByName(name)
  if (!sh) {
    sh = ss.insertSheet(name)
    sh.getRange(1, 1, sh.getMaxRows(), cols.length).setNumberFormat('@')
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold')
    sh.setFrozenRows(1)
  }
  return sh
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

// Evita que un comentario se interprete como fórmula
function text_(v) {
  const s = v == null ? '' : String(v)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

// GET: devuelve { relevamientos: [{ id, fecha, creado, relevado_por, items: [...] }] }
function doGet() {
  const rows = sheet_(HISTORIAL, H_COLS).getDataRange().getDisplayValues().slice(1)
  const byId = {}
  const relevamientos = []
  rows.forEach((r) => {
    const o = {}
    H_COLS.forEach((c, i) => { o[c] = r[i] })
    if (!o.id) return
    if (!byId[o.id]) {
      byId[o.id] = { id: o.id, fecha: o.fecha, creado: o.creado, relevado_por: o.relevado_por, items: [] }
      relevamientos.push(byId[o.id])
    }
    byId[o.id].items.push({
      eje: o.eje, objetivo_id: o.objetivo_id, accionable: o.accionable,
      responsable: o.responsable, estado: o.estado, comentario: o.comentario,
    })
  })
  return json_({ relevamientos: relevamientos })
}

// POST (text/plain): { clave, entry } — agrega al historial y actualiza la hoja Estado
function doPost(e) {
  const body = JSON.parse(e.postData.contents)
  const clave = PropertiesService.getScriptProperties().getProperty('CLAVE')
  if (!clave || body.clave !== clave) return json_({ ok: false, error: 'Clave incorrecta.' })

  const entry = body.entry
  if (!entry || !entry.relevado_por || !entry.items || entry.items.length === 0) {
    return json_({ ok: false, error: 'Faltan datos del relevamiento.' })
  }

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const historial = sheet_(HISTORIAL, H_COLS)
    const nuevas = entry.items.map((it) => [
      entry.id, entry.fecha, entry.creado, entry.relevado_por,
      it.eje, it.objetivo_id, it.accionable, it.responsable, it.estado, it.comentario,
    ].map(text_))
    historial.getRange(historial.getLastRow() + 1, 1, nuevas.length, H_COLS.length).setValues(nuevas)

    const estado = sheet_(ESTADO, E_COLS)
    const actuales = estado.getDataRange().getDisplayValues()
    const fila = {}
    actuales.forEach((r, i) => { if (i > 0) fila[r[1] + '::' + r[2]] = i + 1 })
    entry.items.forEach((it) => {
      const valores = [[it.eje, it.objetivo_id, it.accionable, it.responsable, it.estado, it.comentario, entry.fecha, entry.relevado_por].map(text_)]
      const key = it.objetivo_id + '::' + it.accionable
      const row = fila[key] || estado.getLastRow() + 1
      estado.getRange(row, 1, 1, E_COLS.length).setValues(valores)
      fila[key] = row
    })
  } finally {
    lock.releaseLock()
  }
  return json_({ ok: true })
}
