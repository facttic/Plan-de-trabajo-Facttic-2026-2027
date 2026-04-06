import './style.css'
import './loader.js'
import plan from './data/plan.json'

const ejes = plan.plan_de_trabajo_facttic_2026_2027

const ejeColors = [
  { border: 'border-brand-yellow', text: 'text-brand-yellow', count: 'bg-brand-yellow' },
  { border: 'border-brand-green',  text: 'text-brand-green',  count: 'bg-brand-green' },
  { border: 'border-brand-orange', text: 'text-brand-orange', count: 'bg-brand-orange' },
]

const list = document.getElementById('steps-list')

list.innerHTML = ejes.map((eje, i) => {
  const color = ejeColors[i % ejeColors.length]
  const key = eje.eje.split(' ')[1] // "A", "B", "C"
  const [, ...labelParts] = eje.eje.split(' - ')
  const label = labelParts.join(' - ')

  return `
    <a
      href="/eje.html?eje=${key}"
      class="group flex items-center justify-between border-l-4 ${color.border} bg-white/5 hover:bg-white/10 rounded-r-xl px-6 py-5 transition-all"
    >
      <div class="flex items-center gap-4">
        <span class="${color.text} text-sm font-mono font-bold w-6 text-center">EJE ${key}</span>
        <span class="font-medium text-white">${label}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs ${color.text} opacity-60">${eje.objetivos.length} objetivos</span>
        <svg class="w-4 h-4 text-brand-gray group-hover:text-white transition-colors shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </a>
  `
}).join('')
