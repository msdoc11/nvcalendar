import Prism from 'prismjs'

interface MarkupTag {
  addAttribute?: (attributeName: string, language: string) => void
}

const DIRECTIVES = [
  '(?::|v-bind:)[\\w-]+(?:\\.[\\w-]+)*',
  '(?:@|v-on:)[\\w-]+(?:\\.[\\w-]+)*',
  'v-[\\w-]+(?::[\\w-]+)?(?:\\.[\\w-]+)*',
  '#[\\w-]+',
]

const tag = Prism.languages.markup?.tag as MarkupTag | undefined

if (tag?.addAttribute) {
  for (const directive of DIRECTIVES) {
    tag.addAttribute(directive, 'javascript')
  }
}

export default Prism
