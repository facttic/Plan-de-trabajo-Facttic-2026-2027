# Relevamiento en Google Sheets

El formulario (`relevamiento.html`) guarda en una Google Sheet a través de un Apps Script publicado como aplicación web. La página de resultados lee de la misma hoja.

## Configuración (una sola vez)

1. Crear una Google Sheet nueva (por ejemplo "Relevamiento Plan Facttic").
2. En la hoja: **Extensiones → Apps Script**. Borrar el contenido de `Código.gs` y pegar el de [`Code.gs`](./Code.gs). Guardar.
3. **Configuración del proyecto** (ícono de engranaje) → **Propiedades de la secuencia de comandos** → agregar:
   - Propiedad: `CLAVE`
   - Valor: una clave de edición a elección (es la que pide el formulario).
4. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Autorizar los permisos que pide Google y copiar la **URL de la aplicación web** (termina en `/exec`).
6. En la raíz del proyecto, crear `.env` con:

   ```
   VITE_SHEETS_URL=https://script.google.com/macros/s/XXXXXXXX/exec
   ```

7. `npm run dev` para probar, y `npm run deploy` para publicar en GitHub Pages.

Las hojas `Historial` (un registro por cada cambio) y `Estado` (último estado de cada accionable) se crean solas en el primer guardado.

## Notas

- La lectura es pública (cualquiera con la URL puede ver los datos); para escribir hace falta la `CLAVE`.
- Si se modifica `Code.gs`, hay que publicar de nuevo: **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Así la URL no cambia.
- Sin `VITE_SHEETS_URL`, el sitio vuelve a usar `src/data/relevamiento.json` (guardado local con `npm run dev`).
