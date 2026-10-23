// Tools and the projects they were used in, derived from src/data/projects.js
import { projects } from './data/projects.js'

// Normalise the stack names used across projects into one tool per node
const ALIAS = {
  'Redux Toolkit': 'Redux',
  'Tailwind CSS': 'Tailwind',
  'Figma to code': 'Figma',
  'API integrations': 'REST APIs',
  'Custom CSS': 'CSS',
}
const THIS_SITE = { slug: null, name: 'This website', stack: ['Three.js', 'GSAP', 'Vite', 'CSS'] }

export function buildToolData() {
  const all = [...projects, THIS_SITE]
  const tools = new Map()
  all.forEach((p) => {
    p.stack.forEach((raw) => {
      const name = ALIAS[raw] || raw
      if (!tools.has(name)) tools.set(name, new Set())
      tools.get(name).add(p)
    })
  })
  return {
    projects: all,
    tools: [...tools.entries()]
      .map(([name, set]) => ({ name, projects: [...set] }))
      .sort((a, b) => b.projects.length - a.projects.length),
  }
}
