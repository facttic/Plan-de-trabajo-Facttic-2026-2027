import"./plan-BbcsJK9h.js";import{a as e,c as t,d as n,f as r,g as i,i as a,l as o,m as s,o as c,p as l,s as u,t as d,u as f}from"./relevamiento-store-BYy7kzW_.js";var p=document.getElementById(`resultados-content`);p.innerHTML=s(`Cargando resultados…`);var{data:m}=await l(),h=r(m),g=[...m.relevamientos??[]].sort((e,t)=>(t.fecha??``).localeCompare(e.fecha??``)||(t.creado??``).localeCompare(e.creado??``)),_=e=>`<p class="text-xs font-semibold uppercase tracking-widest text-brand-gray/60">${e}</p>`,v=(e,t)=>t?Math.round(e/t*100):0,y=(e,t=`h-2.5`)=>{let n=Object.values(e).reduce((e,t)=>e+t,0);return`<div class="flex ${t} w-full gap-0.5 overflow-hidden rounded-full bg-white/6">${Object.entries(e).filter(([,e])=>e>0).map(([e,t])=>`<div title="${d[e].label}: ${t}" style="width:${t/n*100}%; background:${d[e].hex}"></div>`).join(``)}</div>`},b=e=>`
  <span class="inline-flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 border shrink-0"
        style="color:${d[e].hex}; border-color:${d[e].hex}40; background:${d[e].hex}12">
    ${d[e].label}
  </span>`,x=`
  <div class="flex flex-wrap gap-x-4 gap-y-1.5">
    ${Object.values(d).map(e=>`
      <span class="inline-flex items-center gap-1.5 text-xs text-brand-gray">
        <span class="w-2.5 h-2.5 rounded-full" style="background:${e.hex}"></span>${e.label}
      </span>`).join(``)}
  </div>`,S=e(a,h),C=o.flatMap(e=>e.objetivos).filter(e=>e.accionables.length>0),w=e=>a.filter(t=>t.objetivo_id===e),T=C.filter(e=>n(w(e.id),h)===`cumplido`).length,E=(e,t,n,r)=>`
  <div class="rounded-xl border border-white/8 bg-white/4 p-4 space-y-1">
    <p class="text-xs text-brand-gray">${e}</p>
    <p class="text-2xl font-bold" style="color:${r}">${t}</p>
    <p class="text-xs text-brand-gray/60">${n}</p>
  </div>`,D=`
  <div class="space-y-4">
    ${_(`Resumen`)}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      ${E(`Objetivos cumplidos`,`${T}/${C.length}`,`${v(T,C.length)}% del plan`,`#FFFFFF`)}
      ${E(`Cumplidos`,S.cumplido,`${v(S.cumplido,a.length)}% de accionables`,d.cumplido.hex)}
      ${E(`En progreso`,S.en_progreso,`${v(S.en_progreso,a.length)}% de accionables`,d.en_progreso.hex)}
      ${E(`No cumplidos`,S.no_cumplido,`${S.sin_relevar} sin relevar`,d.no_cumplido.hex)}
    </div>
    ${y(S,`h-3`)}
    ${x}
  </div>`,O=e=>{let t=h.get(e.key);return`
    <li class="space-y-1 py-2 border-t border-white/6 first:border-t-0">
      <div class="flex items-start justify-between gap-3">
        <p class="text-white/80 text-xs font-medium leading-snug">${f(e.accionable)}</p>
        ${b(t?.estado??`sin_relevar`)}
      </div>
      <p class="text-brand-gray/70 text-xs">${f(e.responsable)}${t?` · ${f(t.fecha)} · ${f(t.relevado_por)}`:``}</p>
      ${t?.comentario?`<p class="text-brand-gray text-xs leading-relaxed italic">“${f(t.comentario)}”</p>`:``}
    </li>`},k=o.map(r=>{let i=u(r),o=c[i]??c.A,s=a.filter(e=>e.eje===i),l=e(s,h),d=r.objetivos.filter(e=>e.accionables.length>0).map(t=>{let r=w(t.id);return`
      <details class="group rounded-xl border border-white/8 bg-white/4 px-4 py-3">
        <summary class="flex cursor-pointer list-none items-start gap-3">
          <span class="mt-0.5 text-xs font-mono font-bold ${o.text} shrink-0 w-6">${t.id}</span>
          <div class="flex-1 space-y-2">
            <div class="flex items-start justify-between gap-3">
              <span class="text-white/90 text-sm font-medium leading-snug">${t.objetivo}</span>
              ${b(n(r,h))}
            </div>
            ${y(e(r,h),`h-1.5`)}
          </div>
        </summary>
        <ul class="mt-3 ml-9">${r.map(O).join(``)}</ul>
      </details>`}).join(``);return`
    <section class="space-y-4">
      <div class="space-y-2 border-l-4 ${o.border} pl-5">
        <div class="flex items-baseline justify-between gap-3">
          <p class="text-xs font-mono font-bold uppercase tracking-widest ${o.text}">EJE ${i}</p>
          <p class="text-xs ${o.text}">${v(l.cumplido,s.length)}% cumplido</p>
        </div>
        <h2 class="text-lg font-bold text-white leading-tight">${t(r)}</h2>
        ${y(l)}
      </div>
      <div class="space-y-2">${d}</div>
    </section>`}).join(``),A=`
  <div class="space-y-4">
    ${_(`Por responsable`)}
    <ul class="space-y-3">
      ${i.map(t=>{let n=a.filter(e=>e.responsable===t),r=e(n,h);return`
          <li class="space-y-1.5">
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-white/80 text-xs font-medium leading-snug">${f(t)}</p>
              <p class="text-xs text-brand-gray shrink-0">${r.cumplido}/${n.length}</p>
            </div>
            ${y(r,`h-2`)}
          </li>`}).join(``)}
    </ul>
  </div>`,j=`
  <div class="space-y-4">
    ${_(`Historial de relevamientos`)}
    ${g.length===0?`<p class="text-sm text-brand-gray">Todavía no hay relevamientos cargados.</p>`:`<ul class="space-y-2">
          ${g.map(e=>`
            <li class="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
              <div>
                <p class="text-white/90 text-sm font-medium">${f(e.relevado_por)}</p>
                <p class="text-xs text-brand-gray">${f(e.fecha)}</p>
              </div>
              <span class="text-xs text-brand-gray">${e.items.length} accionable${e.items.length===1?``:`s`}</span>
            </li>`).join(``)}
         </ul>`}
  </div>`;p.innerHTML=`
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-xs font-mono font-bold uppercase tracking-widest text-brand-green">Resultados</p>
    <h1 class="text-2xl font-bold text-white leading-tight">Cumplimiento del plan</h1>
    <p class="text-brand-gray text-sm leading-relaxed">
      Último estado relevado de cada accionable${g[0]?`, actualizado al ${f(g[0].fecha)}`:``}.
    </p>
    <a href="./relevamiento.html" class="inline-flex items-center gap-2 text-sm text-brand-green hover:text-white transition-colors">
      Cargar relevamiento
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  ${D}

  <div class="space-y-10 pt-6 border-t border-white/10">${k}</div>

  <div class="pt-6 border-t border-white/10">${A}</div>

  <div class="pt-6 border-t border-white/10">${j}</div>
`;