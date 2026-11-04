import"./plan-D7m591FN.js";import{a as e,c as t,d as n,f as r,h as i,i as a,l as o,m as s,o as c,p as l,s as u,t as d,u as f}from"./relevamiento-store-BIkxv3vi.js";var p=document.getElementById(`resultados-content`);p.innerHTML=i(`Cargando resultados…`);var{data:m}=await s(),h=l(m),g=[...m.relevamientos??[]].sort((e,t)=>(t.fecha??``).localeCompare(e.fecha??``)||(t.creado??``).localeCompare(e.creado??``)),_=[`cumplido`,`en_progreso`,`no_cumplido`,`sin_relevar`],v=(e,t)=>t?Math.round(e/t*100):0,y=(e,t,n)=>`${e} ${e===1?t:n}`,b=e=>a.filter(t=>t.objetivo_id===e),x=(e,t=``)=>`
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
    </div>`},w=(e,t)=>{let n=2*Math.PI*42,r=v(e.cumplido,t),i=_.filter(t=>e[t]>0),a=i.length>1?2:0,o=0;return`
    <div class="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90" role="img" aria-label="${r}% cumplido">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="8" class="text-white/10"/>
        ${i.map(r=>{let i=e[r]/t*n,s=`
      <circle cx="50" cy="50" r="42" fill="none" stroke="${d[r].hex}" stroke-width="8"
              stroke-dasharray="${Math.max(i-a,.5)} ${n}" stroke-dashoffset="${-o}">
        <title>${d[r].label}: ${e[r]} (${v(e[r],t)}%)</title>
      </circle>`;return o+=i,s}).join(``)}
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
          <div class="flex justify-center">${w(f,l.length)}</div>
          <p class="text-center text-sm text-brand-gray">${m} de ${y(p.length,`objetivo cumplido`,`objetivos cumplidos`)}</p>
          <div class="flex justify-center flex-wrap gap-4 text-sm">
            ${_.map(e=>`
              <span class="inline-flex items-center gap-1" title="${d[e].label}" style="color:${d[e].hex}">
                ${n(e)}<span class="text-white font-semibold">${f[e]}</span>
              </span>`).join(``)}
          </div>
        </a>`}).join(``)}
  </div>`,j=`<svg class="w-5 h-5 text-brand-gray transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`,M=e=>{let t=h.get(e.key),n=t?.estado??`sin_relevar`,r=`<p class="text-sm text-brand-gray">${f(e.responsable)}${t?` · ${f(t.fecha)} · ${f(t.relevado_por)}`:``}</p>`;return`
    <li class="border-t border-white/8 first:border-t-0">
      <details class="group py-3">
        <summary class="flex cursor-pointer list-none flex-wrap items-start gap-3">
          <p class="text-white text-base font-medium leading-snug flex-1 min-w-48">${f(e.accionable)}</p>
          ${S(n)}
          ${j}
        </summary>
        <div class="mt-2 space-y-2">
          ${r}
          ${t?.comentario?`<p class="text-base text-white/80 leading-relaxed border-l-2 border-white/15 pl-3">${f(t.comentario)}</p>`:`<p class="text-sm text-brand-gray italic">Sin comentario.</p>`}
        </div>
      </details>
    </li>`},N=o.map(e=>{let n=u(e),r=c[n]??c.A;return`
    <section id="eje-${n}" class="space-y-4 scroll-mt-6">
      <div class="border-l-4 ${r.border} pl-5 space-y-1">
        <p class="text-sm font-mono font-bold uppercase tracking-widest ${r.text}">EJE ${n}</p>
        <h3 class="text-2xl sm:text-3xl font-bold text-white leading-tight">${t(e)}</h3>
      </div>
      ${(()=>{let t=e.objetivos.filter(e=>e.accionables.length>0),i=a.filter(e=>e.eje===n).map((e,t)=>({a:e,i:t,estado:h.get(e.key)?.estado??`sin_relevar`})).sort((e,t)=>_.indexOf(e.estado)-_.indexOf(t.estado)||e.i-t.i).map(({a:e})=>e);return`
          <div class="rounded-xl border border-white/10 bg-white/4 px-5 py-4 space-y-6">
            <div class="space-y-2">
              <p class="text-sm font-semibold uppercase tracking-wide text-brand-gray">Objetivos</p>
              <ul class="space-y-2">
                ${t.map(e=>`
                  <li id="obj-${e.id}" class="flex items-start gap-3 scroll-mt-6">
                    <span class="mt-0.5 text-sm font-mono font-bold ${r.text} shrink-0 w-7">${e.id}</span>
                    <p class="flex-1 text-white text-base font-medium leading-snug">${e.objetivo}</p>
                  </li>`).join(``)}
              </ul>
            </div>
            <div class="space-y-1 pt-4 border-t border-white/10">
              <p class="text-sm font-semibold uppercase tracking-wide text-brand-gray">Accionables</p>
              <ul>${i.map(M).join(``)}</ul>
            </div>
          </div>`})()}
    </section>`}).join(``);p.innerHTML=`
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

  <div class="space-y-16 pt-8 border-t border-white/10">
    ${x(`Objetivos y accionables`,`Objetivos de cada eje y estado actual de sus accionables.`)}
    ${N}
  </div>

`;