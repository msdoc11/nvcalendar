import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

const demoSourceKey = Symbol('nv-demo-source') as InjectionKey<Map<string, DemoSnippet>>

function findTagEnd(source: string, start: number): number {
  let quote: string | null = null
  for (let index = start; index < source.length; index++) {
    const char = source[index]!
    if (quote) {
      if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === '\'') quote = char
    else if (char === '>') return index
  }
  return -1
}

function findTemplateEnd(source: string, start: number): number {
  const open = /<template\b/g
  const close = /<\/template>/g
  open.lastIndex = start + 1
  close.lastIndex = start + 1
  let depth = 1
  while (depth > 0) {
    const next = close.exec(source)
    if (!next) return source.length
    const nested = open.exec(source)
    if (nested && nested.index < next.index) {
      depth++
      close.lastIndex = next.index
      continue
    }
    depth--
    open.lastIndex = next.index + next[0].length
    if (depth === 0) return next.index + next[0].length
    close.lastIndex = next.index + next[0].length
  }
  return source.length
}

function stripValueSlot(body: string): string {
  const match = /<template\s+#value\s*>/.exec(body)
  if (!match) return body
  return body.slice(0, match.index) + body.slice(findTemplateEnd(body, match.index))
}

function dedent(text: string): string {
  const lines = text.replace(/\t/g, '  ').split('\n')
  while (lines.length && !lines[0]!.trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1]!.trim()) lines.pop()
  const indent = lines
    .filter(line => line.trim())
    .reduce((min, line) => Math.min(min, line.length - line.trimStart().length), Number.MAX_SAFE_INTEGER)
  return lines.map(line => line.slice(indent)).join('\n')
}

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function bracketBalance(line: string): number {
  let depth = 0
  for (const char of line.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '')) {
    if (char === '(' || char === '[' || char === '{') depth++
    else if (char === ')' || char === ']' || char === '}') depth--
  }
  return depth
}

function parseDeclarations(source: string): Map<string, string> {
  const script = /<script setup[^>]*>([\s\S]*?)<\/script>/.exec(source)?.[1] ?? ''
  const declarations = new Map<string, string>()
  let current: { names: string[], lines: string[] } | null = null
  let depth = 0

  const flush = () => {
    if (!current) return
    const text = current.lines.join('\n').trimEnd()
    for (const name of current.names) declarations.set(name, text)
    current = null
  }

  for (const line of script.split('\n')) {
    if (current) {
      current.lines.push(line)
      depth += bracketBalance(line)
      if (depth <= 0) flush()
      continue
    }

    const start = /^(?:const|let|function)\s+(?:\{([^}]*)\}|([\w$]+))/.exec(line)
    if (!start) continue

    const names = start[1]
      ? start[1].split(',').map(part => (part.split(':').pop() ?? '').trim()).filter(Boolean)
      : [start[2]!]
    current = { names, lines: [line] }
    depth = bracketBalance(line)
    if (depth <= 0) flush()
  }
  flush()

  return declarations
}

const BINDING = /(?:v-model(?:\.\w+)?|v-bind|v-on|:[\w-]+|@[\w-]+)="([^"]*)"/g
const IDENTIFIER = /[A-Z_$][\w$]*/gi

function collectDeclarations(snippet: string, declarations: Map<string, string>): string[] {
  const used = new Set<string>()
  let binding: RegExpExecArray | null
  BINDING.lastIndex = 0
  while ((binding = BINDING.exec(snippet)) !== null) {
    for (const name of binding[1]!.match(IDENTIFIER) ?? []) {
      if (declarations.has(name)) used.add(name)
    }
  }

  const seen = new Set<string>()
  const result: string[] = []
  for (const [name, text] of declarations) {
    if (!used.has(name) || seen.has(text)) continue
    if (/useDemo(?:Theme|Month)\(\)/.test(text)) continue
    seen.add(text)
    result.push(text)
  }
  return result
}

export interface DemoSnippet {
  template: string
  script: string
}

export function parseDemos(source: string): Map<string, DemoSnippet> {
  const demos = new Map<string, DemoSnippet>()
  const declarations = parseDeclarations(source)
  const opening = /<DemoCard\b/g
  let match: RegExpExecArray | null

  while ((match = opening.exec(source)) !== null) {
    const tagEnd = findTagEnd(source, match.index)
    if (tagEnd < 0) break

    const attributes = source.slice(match.index, tagEnd)
    const id = /\sid="([^"]*)"/.exec(attributes)?.[1]
    opening.lastIndex = tagEnd

    if (!id || source[tagEnd - 1] === '/') continue

    const close = source.indexOf('</DemoCard>', tagEnd)
    if (close < 0) continue

    const template = dedent(stripValueSlot(source.slice(tagEnd + 1, close)))
    demos.set(decodeEntities(id), {
      template,
      script: collectDeclarations(template, declarations).join('\n\n'),
    })
  }

  return demos
}

export function provideDemoSource(source: string): void {
  provide(demoSourceKey, parseDemos(source))
}

export function useDemoSnippet(title: string): DemoSnippet | null {
  return inject(demoSourceKey, null)?.get(title) ?? null
}

const SCRIPT_OPEN = '<script setup>'
const SCRIPT_CLOSE = '</script>'

export function formatSnippet(snippet: DemoSnippet, themeNote: string, dayNote: string): string {
  const notes: string[] = []
  const whole = `${snippet.script}\n${snippet.template}`
  if (/\btheme\b/.test(whole)) notes.push(`// ${themeNote}`)
  if (/\bday\(/.test(whole)) notes.push(`// ${dayNote}`)

  const body = [notes.join('\n'), snippet.script].filter(Boolean).join('\n')
  const script = body ? `${SCRIPT_OPEN}\n${body}\n${SCRIPT_CLOSE}\n\n` : ''

  const template = snippet.template
    .split('\n')
    .map(line => (line.trim() ? `  ${line}` : line))
    .join('\n')

  return `${script}<template>\n${template}\n</template>\n`
}
