import"./plan-CH7OyNei.js";import{a as e,c as t,d as n,f as r,h as i,i as a,l as o,m as s,o as c,p as l,s as u,t as d,u as f}from"./relevamiento-store-DrkhWayV.js";var p=document.getElementById(`resultados-content`);p.innerHTML=i(`Cargando resultados…`);var{data:m}=await s(),h=l(m),g=[...m.relevamientos??[]].sort((e,t)=>(t.fecha??``).localeCompare(e.fecha??``)||(t.creado??``).localeCompare(e.creado??``)),_=[`cumplido`,`en_progreso`,`no_cumplido`,`sin_relevar`],v=(e,t)=>t?Math.round(e/t*100):0,y=(e,t,n)=>`${e} ${e===1?t:n}`,b=e=>a.filter(t=>t.objetivo_id===e),x=(e,t=``)=>`
  <div class="space-y-1">
    <h2 class="text-xl sm:text-2xl font-bold text-white">${e}</h2>
    ${t?`<p class="text-base text-brand-gray">${t}</p>`:``}
  </div>`,S=e=>`
  <span class="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 border shrink-0"
        style="color:${d[e].hex}; border-color:${d[e].hex}50; background:${d[e].hex}14">
    ${n(e)}${d[e].label}
  </span>`,C=(e,t=`w-44 h-44`)=>{let n=_.reduce((t,n)=>t+e[n],0),r=2*Math.PI*40,i=_.filter(t=>e[t]>0),a=i.length>1?2:0,o=0;return`
    <div class="relative ${t} shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="Accionables por estado">${i.map(t=>{let i=e[t]/n*r,s=`
      <circle cx="50" cy="50" r="40" fill="none" stroke="${d[t].hex}" stroke-width="12"
              stroke-dasharray="${Math.max(i-a,.5)} ${r}" stroke-dashoffset="${-o}">
        <title>${d[t].label}: ${e[t]} (${v(e[t],n)}%)</title>
      </circle>`;return o+=i,s}).join(``)}</svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-bold text-white">${n}</span>
        <span class="text-sm text-brand-gray">accionables</span>
      </div>
    </div>`},w=(e,t)=>{let n=2*Math.PI*42,r=v(e,t);return`
    <div class="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="${r}% cumplido">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="8" class="text-white/10"/>
        ${e>0?`<circle cx="50" cy="50" r="42" fill="none" stroke="${d.cumplido.hex}" stroke-width="8"
                stroke-linecap="round" stroke-dasharray="${e/t*n} ${n}"/>`:``}
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-white">${r}%</span>
        <span class="text-xs text-brand-gray">cumplido</span>
      </div>
    </div>`},T=(e,t)=>`
  <ul class="space-y-3 w-full sm:w-60">
    ${_.map(r=>`
      <li class="flex items-center gap-3 text-base">
        <span style="color:${d[r].hex}">${n(r,`w-5 h-5`)}</span>
        <span class="flex-1 text-white/90 whitespace-nowrap">${d[r].label}</span>
        <span class="font-semibold text-white tabular-nums">${e[r]}</span>
        <span class="w-12 text-right text-brand-gray tabular-nums">${v(e[r],t)}%</span>
      </li>`).join(``)}
  </ul>`,E=e(a,h),D=o.flatMap(e=>e.objetivos).filter(e=>e.accionables.length>0),O=D.filter(e=>r(b(e.id),h)===`cumplido`).length,k=`
  <div class="rounded-2xl border border-white/10 bg-white/4 p-6 sm:p-8 grid gap-8 md:grid-cols-[1fr_auto] items-center">
    <div class="space-y-2">
      <p class="text-base text-brand-gray">Objetivos cumplidos</p>
      <p class="text-6xl font-bold text-white">${v(O,D.length)}%</p>
      <p class="text-lg text-white/80">${O} de ${D.length} objetivos</p>
      <p class="text-sm text-brand-gray">Un objetivo está cumplido cuando todos sus accionables lo están.</p>
    </div>
    <div class="flex flex-col sm:flex-row items-center gap-6">
      ${C(E,`w-40 h-40`)}
      ${T(E,a.length)}
    </div>
  </div>`,A=`
  <div class="grid gap-4 sm:grid-cols-3">
    ${o.map(i=>{let o=u(i),s=c[o]??c.A,l=a.filter(e=>e.eje===o),f=e(l,h),p=i.objetivos.filter(e=>e.accionables.length>0),m=p.filter(e=>r(b(e.id),h)===`cumplido`).length;return`
        <a href="#eje-${o}" class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 p-5 border-t-4 ${s.border} transition-colors">
          <div class="space-y-1 flex-1">
            <p class="text-sm font-mono font-bold uppercase tracking-widest ${s.text}">EJE ${o}</p>
            <p class="text-base font-semibold text-white leading-snug">${t(i)}</p>
          </div>
          <div class="flex justify-center">${w(f.cumplido,l.length)}</div>
          <p class="text-center text-sm text-brand-gray">${m} de ${y(p.length,`objetivo cumplido`,`objetivos cumplidos`)}</p>
          <div class="flex justify-center gap-4 text-sm">
            ${[`cumplido`,`en_progreso`,`no_cumplido`].map(e=>`
              <span class="inline-flex items-center gap-1" title="${d[e].label}" style="color:${d[e].hex}">
                ${n(e)}<span class="text-white font-semibold">${f[e]}</span>
              </span>`).join(``)}
          </div>
        </a>`}).join(``)}
  </div>`,j=e=>{let t=h.get(e.key);return`
    <li class="space-y-2 py-4 border-t border-white/8 first:border-t-0">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <p class="text-white text-base font-medium leading-snug flex-1 min-w-48">${f(e.accionable)}</p>
        ${S(t?.estado??`sin_relevar`)}
      </div>
      <p class="text-sm text-brand-gray">${f(e.responsable)}${t?` · ${f(t.fecha)} · ${f(t.relevado_por)}`:``}</p>
      ${t?.comentario?`<p class="text-base text-white/80 leading-relaxed border-l-2 border-white/15 pl-3">${f(t.comentario)}</p>`:``}
    </li>`},M=o.map(n=>{let i=u(n),a=c[i]??c.A,o=n.objetivos.filter(e=>e.accionables.length>0);return`
    <section id="eje-${i}" class="space-y-3 scroll-mt-6">
      <div class="border-l-4 ${a.border} pl-5 space-y-1">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${a.text}">EJE ${i}</p>
        <h3 class="text-xl font-bold text-white leading-tight">${t(n)}</h3>
      </div>
      ${o.map(t=>{let n=b(t.id),i=e(n,h);return`
          <details id="obj-${t.id}" class="group rounded-xl border border-white/10 bg-white/4 px-5 py-4 scroll-mt-6">
            <summary class="flex cursor-pointer list-none items-start gap-3">
              <span class="mt-0.5 text-sm font-mono font-bold ${a.text} shrink-0 w-7">${t.id}</span>
              <div class="flex-1 space-y-2">
                <p class="text-white text-base sm:text-lg font-semibold leading-snug">${t.objetivo}</p>
                <div class="flex flex-wrap items-center gap-3">
                  ${S(r(n,h))}
                  <span class="text-sm text-brand-gray">${i.cumplido} de ${y(n.length,`accionable cumplido`,`accionables cumplidos`)}</span>
                </div>
              </div>
              <svg class="w-5 h-5 mt-1 text-brand-gray transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </summary>
            <ul class="mt-3 sm:ml-10">${n.map(j).join(``)}</ul>
          </details>`}).join(``)}
    </section>`}).join(``),N=g.length===0?`<p class="text-base text-brand-gray">Todavía no hay relevamientos cargados.</p>`:`<ul class="space-y-2">
      ${g.map(e=>`
        <li class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/4 px-5 py-4">
          <div>
            <p class="text-white text-base font-medium">${f(e.relevado_por)}</p>
            <p class="text-sm text-brand-gray">${f(e.fecha)}</p>
          </div>
          <span class="text-sm text-brand-gray">${y(e.items.length,`cambio`,`cambios`)}</span>
        </li>`).join(``)}
     </ul>`;p.innerHTML=`
  <!-- Header -->
  <div class="space-y-3 border-l-4 border-brand-green pl-5">
    <p class="text-sm font-mono font-bold uppercase tracking-widest text-brand-green">Resultados</p>
    <h1 class="text-3xl font-bold text-white leading-tight">Cumplimiento del plan</h1>
    <p class="text-brand-gray text-base leading-relaxed">
      Último estado relevado de cada accionable${g[0]?`, actualizado al ${f(g[0].fecha)}`:``}.
    </p>
    <a href="./relevamiento.html" class="inline-flex items-center gap-2 text-base text-brand-green hover:text-white transition-colors">
      Cargar relevamiento
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  ${k}

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${x(`Por eje`,`Porcentaje de accionables cumplidos en cada eje.`)}
    ${A}
  </div>

  <div class="space-y-8 pt-8 border-t border-white/10">
    ${x(`Detalle por objetivo`)}
    ${M}
  </div>

  <div class="space-y-5 pt-8 border-t border-white/10">
    ${x(`Historial de relevamientos`)}
    ${N}
  </div>
`;