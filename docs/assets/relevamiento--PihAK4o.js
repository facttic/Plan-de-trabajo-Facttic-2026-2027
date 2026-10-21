import"./plan-C42Czr-S.js";import{_ as e,c as t,d as n,g as r,h as i,l as a,m as o,o as s,p as c,r as l,s as u,t as d,u as f,v as p}from"./relevamiento-store-CmN9n85G.js";var m=document.getElementById(`relevamiento-content`);m.innerHTML=i(`Cargando relevamiento…`);var{data:h}=await o(),g=c(h),_=new Date().toISOString().slice(0,10),v=e=>{try{return localStorage.getItem(e)??``}catch{return``}},y=(e,t)=>{try{localStorage.setItem(e,t)}catch{}},b=`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-brand-gray/50 focus:outline-none focus:border-white/30`,x=`block text-sm font-semibold uppercase tracking-widest text-brand-gray`,S={cumplido:`peer-checked:bg-brand-green/15 peer-checked:border-brand-green peer-checked:text-brand-green`,en_progreso:`peer-checked:bg-brand-yellow/15 peer-checked:border-brand-yellow peer-checked:text-brand-yellow`,no_cumplido:`peer-checked:bg-brand-red/15 peer-checked:border-brand-red peer-checked:text-brand-red`},C=e=>`Último: <span style="color:${d[e.estado]?.hex}">${d[e.estado]?.label??f(e.estado)}</span> · ${f(e.fecha)} · ${f(e.relevado_por)}`,w=(e,t,i)=>{let a=l(e.id,t.nombre),o=`estado-${e.id}-${i}`,s=g.get(a),c=Object.keys(S).map(e=>`
    <label class="cursor-pointer">
      <input type="radio" name="${o}" value="${e}" class="peer sr-only" ${s?.estado===e?`checked`:``}>
      <span class="inline-flex items-center gap-2 text-sm sm:text-base font-medium rounded-full px-4 py-2 border border-white/15 text-brand-gray hover:text-white hover:border-white/30 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 ${S[e]}">
        ${n(e,`w-5 h-5`)}
        ${d[e].label}
      </span>
    </label>`).join(``),u=`<p class="ultimo text-sm text-brand-gray">${s?C(s):``}</p>`;return`
    <li class="accionable space-y-4 rounded-xl border border-white/10 bg-white/4 p-5 sm:p-6"
        data-objetivo="${e.id}" data-accionable="${f(t.nombre)}" data-responsable="${f(r(t))}"
        data-prev-estado="${s?.estado??``}" data-prev-comentario="${f(s?.comentario??``)}">
      <div class="space-y-2">
        <p class="text-white text-base sm:text-lg font-medium leading-snug">${t.nombre}</p>
        <span class="inline-flex items-center gap-1.5 text-sm rounded-full px-3 py-1 bg-white/6 text-brand-gray border border-white/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          ${r(t)}
        </span>
        ${u}
      </div>
      <div class="flex flex-wrap gap-2">${c}</div>
      <textarea rows="2" placeholder="Comentario (opcional)" class="${b} resize-y">${f(s?.comentario??``)}</textarea>
    </li>`},T=a.map(e=>{let n=u(e),r=s[n]??s.A,i=e.objetivos.filter(e=>e.accionables.length>0);return`
    <section class="eje-section space-y-6" data-eje="${n}">
      <div class="space-y-1 border-l-4 ${r.border} pl-5">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${r.text}">EJE ${n}</p>
        <h2 class="text-xl sm:text-2xl font-bold text-white leading-tight">${t(e)}</h2>
      </div>
      ${i.map(e=>`
        <div class="objetivo space-y-3">
          <div class="flex items-start gap-3">
            <span class="mt-1 text-sm font-mono font-bold ${r.text} shrink-0 w-7">${e.id}</span>
            <p class="text-white text-lg font-semibold leading-snug">${e.objetivo}</p>
          </div>
          <ul class="space-y-3">
            ${e.accionables.map((t,n)=>w(e,t,n)).join(``)}
          </ul>
        </div>`).join(``)}
    </section>`}).join(``);m.innerHTML=`
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
        <span class="${x}">Relevado por</span>
        <input id="relevado-por" required placeholder="Nombre y cooperativa" value="${f(v(`relevado_por`))}" class="${b}">
      </label>
      <label class="space-y-2">
        <span class="${x}">Fecha</span>
        <input id="fecha" type="date" required value="${_}" class="${b} [color-scheme:dark]">
      </label>
      ${`
      <label class="space-y-2 sm:col-span-2">
        <span class="${x}">Clave de edición</span>
        <input id="clave" type="password" required autocomplete="current-password" value="${f(v(`clave`))}" class="${b}">
      </label>`}
    </div>

    <!-- Filtros -->
    <div class="grid gap-4 sm:grid-cols-2 pt-6 border-t border-white/10">
      <label class="space-y-2">
        <span class="${x}">Eje</span>
        <select id="filtro-eje" class="${b} [color-scheme:dark]">
          <option value="">Todos los ejes</option>
          ${a.map(e=>`<option value="${u(e)}">EJE ${u(e)} — ${t(e)}</option>`).join(``)}
        </select>
      </label>
      <label class="space-y-2">
        <span class="${x}">Responsable</span>
        <select id="filtro-responsable" class="${b} [color-scheme:dark]">
          <option value="">Todes les responsables</option>
          ${e.map(e=>`<option value="${f(e)}">${f(e)}</option>`).join(``)}
        </select>
      </label>
    </div>

    <div id="objetivos" class="space-y-10">${T}</div>
    <p id="sin-resultados" class="hidden text-brand-gray text-center text-base">No hay accionables para este filtro.</p>

    <!-- Submit -->
    <div class="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-4 bg-brand-black/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
      <p id="form-status" class="text-base text-brand-gray" aria-live="polite">Sin cambios</p>
      <button type="submit" class="rounded-full bg-brand-green px-6 py-3 text-base font-semibold text-brand-black hover:bg-white transition-colors disabled:opacity-50">
        Guardar relevamiento
      </button>
    </div>
  </form>
`;var E=document.getElementById(`relevamiento-form`),D=document.getElementById(`form-status`),O=document.getElementById(`filtro-eje`),k=document.getElementById(`filtro-responsable`),A=[...E.querySelectorAll(`.accionable`)],j=()=>A.map(e=>({li:e,estado:e.querySelector(`input[type=radio]:checked`)?.value,comentario:e.querySelector(`textarea`).value.trim()})).filter(({li:e,estado:t,comentario:n})=>t&&(t!==e.dataset.prevEstado||n!==e.dataset.prevComentario)),M=()=>{let e=j().length;D.className=`text-base text-brand-gray`,D.textContent=e===0?`Sin cambios`:`${e} cambio${e===1?``:`s`} sin guardar`};function N(){let e=O.value,t=k.value,n=0;for(let r of E.querySelectorAll(`.eje-section`)){let i=!e||r.dataset.eje===e,a=0;for(let e of r.querySelectorAll(`.objetivo`)){let n=0;for(let r of e.querySelectorAll(`.accionable`)){let e=i&&(!t||r.dataset.responsable===t);r.classList.toggle(`hidden`,!e),e&&n++}e.classList.toggle(`hidden`,n===0),a+=n}r.classList.toggle(`hidden`,a===0),n+=a}document.getElementById(`sin-resultados`).classList.toggle(`hidden`,n>0)}O.addEventListener(`change`,N),k.addEventListener(`change`,N),E.addEventListener(`change`,M),E.addEventListener(`input`,e=>{e.target.tagName===`TEXTAREA`&&M()}),E.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`relevado-por`).value.trim(),n=document.getElementById(`fecha`).value,r=document.getElementById(`clave`)?.value??``,i=j(),a=t?n?r?i.length===0?`No hay cambios para guardar.`:null:`Completá la clave de edición.`:`Completá la fecha.`:`Completá quién realiza el relevamiento.`;if(a){D.className=`text-base text-brand-red`,D.textContent=a;return}y(`relevado_por`,t),y(`clave`,r);let o=E.querySelector(`button[type=submit]`);o.disabled=!0,D.className=`text-base text-brand-gray`,D.textContent=`Guardando…`;let s={id:crypto.randomUUID(),fecha:n,creado:new Date().toISOString(),relevado_por:t,items:i.map(({li:e,estado:t,comentario:n})=>({eje:e.closest(`.eje-section`).dataset.eje,objetivo_id:e.dataset.objetivo,accionable:e.dataset.accionable,responsable:e.dataset.responsable,estado:t,comentario:n}))},c;try{c=await p(s,h,r)}catch(e){o.disabled=!1,D.className=`text-base text-brand-red`,D.textContent=`Error al guardar: ${e.message}`;return}if(o.disabled=!1,D.className=`text-base text-brand-green`,c){for(let{li:e,estado:r,comentario:a}of i)e.dataset.prevEstado=r,e.dataset.prevComentario=a,e.querySelector(`.ultimo`).innerHTML=C({estado:r,fecha:n,relevado_por:t});D.innerHTML=`${i.length} cambio${i.length===1?``:`s`} guardado${i.length===1?``:`s`}. <a href="./resultados.html" class="underline hover:text-white">Ver resultados</a>`}else h.relevamientos.push(s),D.textContent=`Sin servidor: se descargó relevamiento.json. Reemplazá src/data/relevamiento.json con ese archivo.`});