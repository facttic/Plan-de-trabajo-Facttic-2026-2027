import"./plan-BbcsJK9h.js";import{_ as e,c as t,f as n,g as r,h as i,l as a,m as o,o as s,p as c,r as l,s as u,t as d,u as f}from"./relevamiento-store-BYy7kzW_.js";var p=document.getElementById(`relevamiento-content`);p.innerHTML=o(`Cargando relevamiento…`);var{data:m}=await c(),h=n(m),g=new Date().toISOString().slice(0,10),_=e=>{try{return localStorage.getItem(e)??``}catch{return``}},v=(e,t)=>{try{localStorage.setItem(e,t)}catch{}},y=`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-brand-gray/50 focus:outline-none focus:border-white/30`,b=`text-xs font-semibold uppercase tracking-widest text-brand-gray/60`,x={cumplido:`peer-checked:bg-brand-green/15 peer-checked:border-brand-green peer-checked:text-brand-green`,en_progreso:`peer-checked:bg-brand-yellow/15 peer-checked:border-brand-yellow peer-checked:text-brand-yellow`,no_cumplido:`peer-checked:bg-brand-red/15 peer-checked:border-brand-red peer-checked:text-brand-red`},S=e=>`Último: <span style="color:${d[e.estado]?.hex}">${d[e.estado]?.label??f(e.estado)}</span> · ${f(e.fecha)} · ${f(e.relevado_por)}`,C=(e,t,n)=>{let r=l(e.id,t.nombre),a=`estado-${e.id}-${n}`,o=h.get(r),s=Object.keys(x).map(e=>`
    <label class="cursor-pointer">
      <input type="radio" name="${a}" value="${e}" class="peer sr-only" ${o?.estado===e?`checked`:``}>
      <span class="inline-block text-xs rounded-full px-3 py-1 border border-white/10 text-brand-gray hover:text-white transition-colors ${x[e]}">
        ${d[e].label}
      </span>
    </label>`).join(``),c=`<p class="ultimo text-xs text-brand-gray/60">${o?S(o):``}</p>`;return`
    <li class="accionable space-y-3 rounded-xl border border-white/8 bg-white/4 p-4"
        data-objetivo="${e.id}" data-accionable="${f(t.nombre)}" data-responsable="${f(i(t))}"
        data-prev-estado="${o?.estado??``}" data-prev-comentario="${f(o?.comentario??``)}">
      <div class="space-y-1.5">
        <p class="text-white/90 text-sm font-medium leading-snug">${t.nombre}</p>
        <span class="inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 bg-white/6 text-brand-gray border border-white/8">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          ${i(t)}
        </span>
        ${c}
      </div>
      <div class="flex flex-wrap gap-2">${s}</div>
      <textarea rows="2" placeholder="Comentario (opcional)" class="${y} resize-y">${f(o?.comentario??``)}</textarea>
    </li>`},w=a.map(e=>{let n=u(e),r=s[n]??s.A,i=e.objetivos.filter(e=>e.accionables.length>0);return`
    <section class="eje-section space-y-4" data-eje="${n}">
      <div class="space-y-1 border-l-4 ${r.border} pl-5">
        <p class="text-xs font-mono font-bold uppercase tracking-widest ${r.text}">EJE ${n}</p>
        <h2 class="text-lg font-bold text-white leading-tight">${t(e)}</h2>
      </div>
      ${i.map(e=>`
        <div class="objetivo space-y-3">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 text-xs font-mono font-bold ${r.text} shrink-0 w-6">${e.id}</span>
            <p class="text-white/90 font-medium leading-snug">${e.objetivo}</p>
          </div>
          <ul class="space-y-3">
            ${e.accionables.map((t,n)=>C(e,t,n)).join(``)}
          </ul>
        </div>`).join(``)}
    </section>`}).join(``);p.innerHTML=`
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Relevamiento</p>
    <h1 class="text-2xl font-bold text-white leading-tight">¿Se cumplieron los objetivos?</h1>
    <p class="text-brand-gray text-sm leading-relaxed">
      Indicá o editá el estado de cada accionable. Un objetivo se considera cumplido cuando todos sus accionables lo están.
      Solo se guardan los accionables que cambies.
    </p>
    <a href="./resultados.html" class="inline-flex items-center gap-2 text-sm text-brand-green hover:text-white transition-colors">
      Ver resultados
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  <form id="relevamiento-form" class="space-y-8 sm:space-y-10" novalidate>
    <!-- Datos del relevamiento -->
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="space-y-2">
        <span class="${b}">Relevado por</span>
        <input id="relevado-por" required placeholder="Nombre y cooperativa" value="${f(_(`relevado_por`))}" class="${y}">
      </label>
      <label class="space-y-2">
        <span class="${b}">Fecha</span>
        <input id="fecha" type="date" required value="${g}" class="${y} [color-scheme:dark]">
      </label>
      ${`
      <label class="space-y-2 sm:col-span-2">
        <span class="${b}">Clave de edición</span>
        <input id="clave" type="password" required autocomplete="current-password" value="${f(_(`clave`))}" class="${y}">
      </label>`}
    </div>

    <!-- Filtros -->
    <div class="grid gap-4 sm:grid-cols-2 pt-6 border-t border-white/10">
      <label class="space-y-2">
        <span class="${b}">Eje</span>
        <select id="filtro-eje" class="${y} [color-scheme:dark]">
          <option value="">Todos los ejes</option>
          ${a.map(e=>`<option value="${u(e)}">EJE ${u(e)} — ${t(e)}</option>`).join(``)}
        </select>
      </label>
      <label class="space-y-2">
        <span class="${b}">Responsable</span>
        <select id="filtro-responsable" class="${y} [color-scheme:dark]">
          <option value="">Todes les responsables</option>
          ${r.map(e=>`<option value="${f(e)}">${f(e)}</option>`).join(``)}
        </select>
      </label>
    </div>

    <div id="objetivos" class="space-y-10">${w}</div>
    <p id="sin-resultados" class="hidden text-brand-gray text-center text-sm">No hay accionables para este filtro.</p>

    <!-- Submit -->
    <div class="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-4 bg-brand-black/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
      <p id="form-status" class="text-sm text-brand-gray" aria-live="polite">Sin cambios</p>
      <button type="submit" class="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-black hover:bg-white transition-colors disabled:opacity-50">
        Guardar relevamiento
      </button>
    </div>
  </form>
`;var T=document.getElementById(`relevamiento-form`),E=document.getElementById(`form-status`),D=document.getElementById(`filtro-eje`),O=document.getElementById(`filtro-responsable`),k=[...T.querySelectorAll(`.accionable`)],A=()=>k.map(e=>({li:e,estado:e.querySelector(`input[type=radio]:checked`)?.value,comentario:e.querySelector(`textarea`).value.trim()})).filter(({li:e,estado:t,comentario:n})=>t&&(t!==e.dataset.prevEstado||n!==e.dataset.prevComentario)),j=()=>{let e=A().length;E.className=`text-sm text-brand-gray`,E.textContent=e===0?`Sin cambios`:`${e} cambio${e===1?``:`s`} sin guardar`};function M(){let e=D.value,t=O.value,n=0;for(let r of T.querySelectorAll(`.eje-section`)){let i=!e||r.dataset.eje===e,a=0;for(let e of r.querySelectorAll(`.objetivo`)){let n=0;for(let r of e.querySelectorAll(`.accionable`)){let e=i&&(!t||r.dataset.responsable===t);r.classList.toggle(`hidden`,!e),e&&n++}e.classList.toggle(`hidden`,n===0),a+=n}r.classList.toggle(`hidden`,a===0),n+=a}document.getElementById(`sin-resultados`).classList.toggle(`hidden`,n>0)}D.addEventListener(`change`,M),O.addEventListener(`change`,M),T.addEventListener(`change`,j),T.addEventListener(`input`,e=>{e.target.tagName===`TEXTAREA`&&j()}),T.addEventListener(`submit`,async t=>{t.preventDefault();let n=document.getElementById(`relevado-por`).value.trim(),r=document.getElementById(`fecha`).value,i=document.getElementById(`clave`)?.value??``,a=A(),o=n?r?i?a.length===0?`No hay cambios para guardar.`:null:`Completá la clave de edición.`:`Completá la fecha.`:`Completá quién realiza el relevamiento.`;if(o){E.className=`text-sm text-brand-red`,E.textContent=o;return}v(`relevado_por`,n),v(`clave`,i);let s=T.querySelector(`button[type=submit]`);s.disabled=!0,E.className=`text-sm text-brand-gray`,E.textContent=`Guardando…`;let c={id:crypto.randomUUID(),fecha:r,creado:new Date().toISOString(),relevado_por:n,items:a.map(({li:e,estado:t,comentario:n})=>({eje:e.closest(`.eje-section`).dataset.eje,objetivo_id:e.dataset.objetivo,accionable:e.dataset.accionable,responsable:e.dataset.responsable,estado:t,comentario:n}))},l;try{l=await e(c,m,i)}catch(e){s.disabled=!1,E.className=`text-sm text-brand-red`,E.textContent=`Error al guardar: ${e.message}`;return}if(s.disabled=!1,E.className=`text-sm text-brand-green`,l){for(let{li:e,estado:t,comentario:i}of a)e.dataset.prevEstado=t,e.dataset.prevComentario=i,e.querySelector(`.ultimo`).innerHTML=S({estado:t,fecha:r,relevado_por:n});E.innerHTML=`${a.length} cambio${a.length===1?``:`s`} guardado${a.length===1?``:`s`}. <a href="./resultados.html" class="underline hover:text-white">Ver resultados</a>`}else m.relevamientos.push(c),E.textContent=`Sin servidor: se descargó relevamiento.json. Reemplazá src/data/relevamiento.json con ese archivo.`});