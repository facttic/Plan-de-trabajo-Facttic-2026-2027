import{t as e}from"./plan-Bz_1gveo.js";var t=e.plan_de_trabajo_facttic_2026_2027,n={A:{text:`text-brand-yellow`,border:`border-brand-yellow`,cardBorder:`hover:border-brand-yellow`},B:{text:`text-brand-green`,border:`border-brand-green`,cardBorder:`hover:border-brand-green`},C:{text:`text-brand-orange`,border:`border-brand-orange`,cardBorder:`hover:border-brand-orange`}},r=new URLSearchParams(window.location.search).get(`eje`)?.toUpperCase(),i=t.find(e=>e.eje.startsWith(`EJE ${r}`)),a=document.getElementById(`eje-content`);if(!i)a.innerHTML=`<p class="text-brand-gray text-center">Eje no encontrado.</p>`;else{document.title=`${i.eje} — Plan Facttic`;let e=n[r]??n.A,o=t.indexOf(i),s=t[o-1]??null,c=t[o+1]??null,l=s?.eje.split(` `)[1],u=c?.eje.split(` `)[1],d=i.objetivos.map(t=>`
    <a
      href="./objetivo.html?eje=${r}&obj=${t.id}"
      class="group flex items-start gap-4 bg-white/5 ${e.cardBorder} border border-white/10 rounded-xl px-5 py-4 transition-all hover:bg-white/8"
    >
      <span class="mt-0.5 text-xs font-mono font-bold ${e.text} shrink-0 w-6">${t.id}</span>
      <span class="text-white/90 font-medium leading-snug flex-1">${t.objetivo}</span>
      ${t.accionables.length>0?`<span class="shrink-0 mt-0.5 text-xs ${e.text} opacity-0 group-hover:opacity-60 transition-opacity">
            ${t.accionables.length} →
           </span>`:`<svg class="shrink-0 mt-0.5 w-4 h-4 text-brand-red opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
           </svg>`}
    </a>
  `).join(``);a.innerHTML=`
    <!-- Header -->
    <div class="space-y-3 border-l-4 ${e.border} pl-5">
      <p class="text-xs font-mono font-bold uppercase tracking-widest ${e.text}">EJE ${r}</p>
      <h1 class="text-2xl font-bold text-white leading-tight">${i.eje.split(` - `).slice(1).join(` - `)}</h1>
      <p class="text-brand-gray text-sm leading-relaxed">${i.descripcion}</p>
      <p class="${e.text} text-sm opacity-50">${i.objetivos.length} objetivos</p>
    </div>

    <!-- Objetivos -->
    <div class="space-y-2">
      ${d}
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-6 border-t border-white/10">
      ${s?`<a href="./eje.html?eje=${l}" class="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            EJE ${l}
           </a>`:`<span></span>`}
      ${c?`<a href="./eje.html?eje=${u}" class="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors">
            EJE ${u}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
           </a>`:`<span></span>`}
    </div>
  `}