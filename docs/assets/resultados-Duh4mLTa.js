import"./plan-C42Czr-S.js";import{_ as e,a as t,c as n,d as r,f as i,h as a,i as o,l as s,m as c,o as l,p as u,s as d,t as f,u as p}from"./relevamiento-store-CmN9n85G.js";var m=document.getElementById(`resultados-content`);m.innerHTML=a(`Cargando resultados…`);var{data:h}=await c(),g=u(h),_=[...h.relevamientos??[]].sort((e,t)=>(t.fecha??``).localeCompare(e.fecha??``)||(t.creado??``).localeCompare(e.creado??``)),v=[`cumplido`,`en_progreso`,`no_cumplido`,`sin_relevar`],y=(e,t)=>t?Math.round(e/t*100):0,b=(e,t,n)=>`${e} ${e===1?t:n}`,x=e=>o.filter(t=>t.objetivo_id===e),S=(e,t=``)=>`
  <div class="space-y-1">
    <h2 class="text-xl sm:text-2xl font-bold text-white">${e}</h2>
    ${t?`<p class="text-base text-brand-gray">${t}</p>`:``}
  </div>`,C=e=>`
  <span class="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 border shrink-0"
        style="color:${f[e].hex}; border-color:${f[e].hex}50; background:${f[e].hex}14">
    ${r(e)}${f[e].label}
  </span>`,w=(e,t=`w-44 h-44`)=>{let n=v.reduce((t,n)=>t+e[n],0),r=2*Math.PI*40,i=v.filter(t=>e[t]>0),a=i.length>1?2:0,o=0;return`
    <div class="relative ${t} shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="Accionables por estado">${i.map(t=>{let i=e[t]/n*r,s=`
      <circle cx="50" cy="50" r="40" fill="none" stroke="${f[t].hex}" stroke-width="12"
              stroke-dasharray="${Math.max(i-a,.5)} ${r}" stroke-dashoffset="${-o}">
        <title>${f[t].label}: ${e[t]} (${y(e[t],n)}%)</title>
      </circle>`;return o+=i,s}).join(``)}</svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-bold text-white">${n}</span>
        <span class="text-sm text-brand-gray">accionables</span>
      </div>
    </div>`},T=(e,t)=>{let n=2*Math.PI*42,r=y(e,t);return`
    <div class="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="${r}% cumplido">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="8" class="text-white/10"/>
        ${e>0?`<circle cx="50" cy="50" r="42" fill="none" stroke="${f.cumplido.hex}" stroke-width="8"
                stroke-linecap="round" stroke-dasharray="${e/t*n} ${n}"/>`:``}
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-white">${r}%</span>
        <span class="text-xs text-brand-gray">cumplido</span>
      </div>
    </div>`},E=(e,t)=>`
  <ul class="space-y-3 w-full sm:w-60">
    ${v.map(n=>`
      <li class="flex items-center gap-3 text-base">
        <span style="color:${f[n].hex}">${r(n,`w-5 h-5`)}</span>
        <span class="flex-1 text-white/90 whitespace-nowrap">${f[n].label}</span>
        <span class="font-semibold text-white tabular-nums">${e[n]}</span>
        <span class="w-12 text-right text-brand-gray tabular-nums">${y(e[n],t)}%</span>
      </li>`).join(``)}
  </ul>`,D=t(o,g),O=s.flatMap(e=>e.objetivos).filter(e=>e.accionables.length>0),k=O.filter(e=>i(x(e.id),g)===`cumplido`).length,A=`
  <div class="rounded-2xl border border-white/10 bg-white/4 p-6 sm:p-8 grid gap-8 md:grid-cols-[1fr_auto] items-center">
    <div class="space-y-2">
      <p class="text-base text-brand-gray">Objetivos cumplidos</p>
      <p class="text-6xl font-bold text-white">${y(k,O.length)}%</p>
      <p class="text-lg text-white/80">${k} de ${O.length} objetivos</p>
      <p class="text-sm text-brand-gray">Un objetivo está cumplido cuando todos sus accionables lo están.</p>
    </div>
    <div class="flex flex-col sm:flex-row items-center gap-6">
      ${w(D,`w-40 h-40`)}
      ${E(D,o.length)}
    </div>
  </div>`,j=`
  <div class="grid gap-4 sm:grid-cols-3">
    ${s.map(e=>{let a=d(e),s=l[a]??l.A,c=o.filter(e=>e.eje===a),u=t(c,g),p=e.objetivos.filter(e=>e.accionables.length>0),m=p.filter(e=>i(x(e.id),g)===`cumplido`).length;return`
        <a href="#eje-${a}" class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 p-5 border-t-4 ${s.border} transition-colors">
          <div class="space-y-1 flex-1">
            <p class="text-sm font-mono font-bold uppercase tracking-widest ${s.text}">EJE ${a}</p>
            <p class="text-base font-semibold text-white leading-snug">${n(e)}</p>
          </div>
          <div class="flex justify-center">${T(u.cumplido,c.length)}</div>
          <p class="text-center text-sm text-brand-gray">${m} de ${b(p.length,`objetivo cumplido`,`objetivos cumplidos`)}</p>
          <div class="flex justify-center gap-4 text-sm">
            ${[`cumplido`,`en_progreso`,`no_cumplido`].map(e=>`
              <span class="inline-flex items-center gap-1" title="${f[e].label}" style="color:${f[e].hex}">
                ${r(e)}<span class="text-white font-semibold">${u[e]}</span>
              </span>`).join(``)}
          </div>
        </a>`}).join(``)}
  </div>`,M=`
  <div class="space-y-5">
    ${s.map(e=>{let t=d(e),n=l[t]??l.A,a=e.objetivos.filter(e=>e.accionables.length>0);return`
        <div class="space-y-2">
          <p class="text-sm font-mono font-bold uppercase tracking-widest ${n.text}">EJE ${t}</p>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            ${a.map(e=>{let t=i(x(e.id),g),n=f[t].hex;return`
                <a href="#obj-${e.id}" title="${e.id} · ${p(e.objetivo)} — ${f[t].label}"
                   class="rounded-xl border p-3 flex flex-col items-center gap-1.5 hover:brightness-125 transition"
                   style="border-color:${n}60; background:${n}1f; color:${n}">
                  ${r(t,`w-6 h-6`)}
                  <span class="text-base font-mono font-bold text-white">${e.id}</span>
                  <span class="text-xs">${f[t].label}</span>
                </a>`}).join(``)}
          </div>
        </div>`}).join(``)}
  </div>`,N=e=>{let t=g.get(e.key);return`
    <li class="space-y-2 py-4 border-t border-white/8 first:border-t-0">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <p class="text-white text-base font-medium leading-snug flex-1 min-w-48">${p(e.accionable)}</p>
        ${C(t?.estado??`sin_relevar`)}
      </div>
      <p class="text-sm text-brand-gray">${p(e.responsable)}${t?` · ${p(t.fecha)} · ${p(t.relevado_por)}`:``}</p>
      ${t?.comentario?`<p class="text-base text-white/80 leading-relaxed border-l-2 border-white/15 pl-3">${p(t.comentario)}</p>`:``}
    </li>`},P=s.map(e=>{let r=d(e),a=l[r]??l.A,o=e.objetivos.filter(e=>e.accionables.length>0);return`
    <section id="eje-${r}" class="space-y-3 scroll-mt-6">
      <div class="border-l-4 ${a.border} pl-5 space-y-1">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${a.text}">EJE ${r}</p>
        <h3 class="text-xl font-bold text-white leading-tight">${n(e)}</h3>
      </div>
      ${o.map(e=>{let n=x(e.id),r=t(n,g);return`
          <details id="obj-${e.id}" class="group rounded-xl border border-white/10 bg-white/4 px-5 py-4 scroll-mt-6">
            <summary class="flex cursor-pointer list-none items-start gap-3">
              <span class="mt-0.5 text-sm font-mono font-bold ${a.text} shrink-0 w-7">${e.id}</span>
              <div class="flex-1 space-y-2">
                <p class="text-white text-base sm:text-lg font-semibold leading-snug">${e.objetivo}</p>
                <div class="flex flex-wrap items-center gap-3">
                  ${C(i(n,g))}
                  <span class="text-sm text-brand-gray">${r.cumplido} de ${b(n.length,`accionable cumplido`,`accionables cumplidos`)}</span>
                </div>
              </div>
              <svg class="w-5 h-5 mt-1 text-brand-gray transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </summary>
            <ul class="mt-3 sm:ml-10">${n.map(N).join(``)}</ul>
          </details>`}).join(``)}
    </section>`}).join(``);window.addEventListener(`hashchange`,()=>{let e=document.querySelector(location.hash);e?.tagName===`DETAILS`&&(e.open=!0)});var F=e.map(e=>{let n=o.filter(t=>t.responsable===e);return{r:e,total:n.length,counts:t(n,g)}}).sort((e,t)=>y(t.counts.cumplido,t.total)-y(e.counts.cumplido,e.total)||e.r.localeCompare(t.r,`es`)),I=`
  <div class="overflow-x-auto rounded-xl border border-white/10">
    <table class="w-full text-base">
      <thead class="bg-white/5 text-sm text-brand-gray">
        <tr>
          <th class="text-left px-4 py-3 font-medium">Responsable</th>
          ${v.map(e=>`
  <th class="px-2 py-3 font-medium" title="${f[e].label}">
    <span class="inline-flex justify-center w-full" style="color:${f[e].hex}">${r(e,`w-5 h-5`)}</span>
    <span class="sr-only">${f[e].label}</span>
  </th>`).join(``)}
          <th class="text-left px-4 py-3 font-medium min-w-36">Cumplido</th>
        </tr>
      </thead>
      <tbody>
        ${F.map(({r:e,total:t,counts:n})=>{let r=y(n.cumplido,t);return`
            <tr class="border-t border-white/8">
              <td class="px-4 py-3 text-white/90 leading-snug">${p(e)}</td>
              ${v.map(e=>`<td class="px-2 py-3 text-center tabular-nums ${n[e]?`text-white`:`text-brand-gray/40`}">${n[e]}</td>`).join(``)}
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div class="h-full rounded-full" style="width:${r}%; background:${f.cumplido.hex}"></div>
                  </div>
                  <span class="text-sm text-white tabular-nums w-10 text-right">${r}%</span>
                </div>
              </td>
            </tr>`}).join(``)}
      </tbody>
    </table>
  </div>`,L=_.length===0?`<p class="text-base text-brand-gray">Todavía no hay relevamientos cargados.</p>`:`<ul class="space-y-2">
      ${_.map(e=>`
        <li class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/4 px-5 py-4">
          <div>
            <p class="text-white text-base font-medium">${p(e.relevado_por)}</p>
            <p class="text-sm text-brand-gray">${p(e.fecha)}</p>
          </div>
          <span class="text-sm text-brand-gray">${b(e.items.length,`cambio`,`cambios`)}</span>
        </li>`).join(``)}
     </ul>`;m.innerHTML=`
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-sm font-mono font-bold uppercase tracking-widest text-brand-green">Resultados</p>
    <h1 class="text-3xl font-bold text-white leading-tight">Cumplimiento del plan</h1>
    <p class="text-brand-gray text-base leading-relaxed">
      Último estado relevado de cada accionable${_[0]?`, actualizado al ${p(_[0].fecha)}`:``}.
    </p>
    <a href="./relevamiento.html" class="inline-flex items-center gap-2 text-base text-brand-green hover:text-white transition-colors">
      Cargar relevamiento
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  ${A}

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${S(`Por eje`,`Porcentaje de accionables cumplidos en cada eje.`)}
    ${j}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${S(`Mapa de objetivos`,`Estado de cada objetivo. Tocá uno para ver el detalle.`)}
    ${M}
  </div>

  <div class="space-y-8 pt-8 border-t border-white/10">
    ${S(`Detalle por objetivo`)}
    ${P}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${S(`Por responsable`,`Accionables por estado, ordenado por porcentaje cumplido.`)}
    ${I}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${S(`Historial de relevamientos`)}
    ${L}
  </div>
`;