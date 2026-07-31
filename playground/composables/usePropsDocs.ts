import propsSource from '../../src/runtime/props.ts?raw'

export interface PropDoc {
  name: string
  type: string
  default: string
  description: string
}

const CONSTRUCTORS: Record<string, string> = {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  Date: 'Date',
  Object: 'object',
  Array: 'array',
  Function: 'function',
}

function readType(entry: string): string {
  const asType = /as PropType<([^>]*)>/.exec(entry)
  if (asType?.[1]) return asType[1].replace(/\s+/g, ' ').trim()

  const raw = /type: (\[[^\]]*\]|[A-Za-z]+)/.exec(entry)?.[1]
  if (!raw) return 'unknown'
  if (!raw.startsWith('[')) return CONSTRUCTORS[raw] ?? raw

  return raw
    .slice(1, -1)
    .split(',')
    .map(part => CONSTRUCTORS[part.trim()] ?? part.trim())
    .filter(Boolean)
    .join(' | ')
}

function readDefault(entry: string): string {
  const marker = entry.indexOf('default:')
  if (marker < 0) return '—'

  let depth = 0
  let end = entry.length
  for (let index = marker + 'default:'.length; index < entry.length; index++) {
    const char = entry[index]!
    if (char === '(' || char === '[' || char === '{') depth++
    else if (char === ')' || char === ']') depth--
    else if (char === '}') {
      if (depth === 0) { end = index; break }
      depth--
    }
    else if (char === ',' && depth === 0) { end = index; break }
  }

  const raw = entry.slice(marker + 'default:'.length, end).trim()
  if (!raw || raw === 'undefined') return '—'
  if (/^\(\) => \(?\[\]\)?$/.test(raw)) return '[]'
  if (/^\(\) => \(?\{\}\)?$/.test(raw)) return '{}'
  return raw.replace(/\s+/g, ' ')
}

function readDescription(lines: string[]): string {
  return lines
    .map(line => line.replace(/^\s*\/?\*+\/?/, '').replace(/\*\/\s*$/, '').trim())
    .filter(line => line && !line.startsWith('@'))
    .join(' ')
    .trim()
}

export function parsePropsBlock(source: string, blockName: string): PropDoc[] {
  const start = source.indexOf(`export const ${blockName} = {`)
  if (start < 0) return []

  const lines = source.slice(start).split('\n').slice(1)
  const docs: PropDoc[] = []
  let comment: string[] = []
  let entry: string[] | null = null
  let depth = 0

  for (const line of lines) {
    if (entry) {
      entry.push(line)
      depth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0)
      if (depth > 0) continue

      const text = entry.join('\n')
      const name = /^\s*([\w$]+):/.exec(text)?.[1] ?? ''
      docs.push({
        name,
        type: readType(text),
        default: readDefault(text),
        description: readDescription(comment),
      })
      entry = null
      comment = []
      continue
    }

    if (/^\}\s*as const/.test(line) || /^\}/.test(line)) break

    if (/^\s*(?:\/\*|\*|\/\/)/.test(line)) {
      comment.push(line)
      continue
    }

    if (/^\s{2}[\w$]+: \{/.test(line)) {
      entry = [line]
      depth = (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0)
      if (depth <= 0) {
        const name = /^\s*([\w$]+):/.exec(line)?.[1] ?? ''
        docs.push({
          name,
          type: readType(line),
          default: readDefault(line),
          description: readDescription(comment),
        })
        entry = null
        comment = []
      }
      continue
    }

    if (line.trim()) comment = []
  }

  return docs
}

export function useCalendarPropsDocs(): PropDoc[] {
  return parsePropsBlock(propsSource, 'calendarProps')
}

export function usePickerPropsDocs(): PropDoc[] {
  const shared = new Set([
    ...parsePropsBlock(propsSource, 'calendarProps').map(item => item.name),
    ...parsePropsBlock(propsSource, 'timePickerProps').map(item => item.name),
  ])
  return [
    ...parsePropsBlock(propsSource, 'timePickerProps'),
    ...parsePropsBlock(propsSource, 'datePickerProps').filter(item => !shared.has(item.name)),
  ]
}
