<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Placement } from '../types'
import { computePosition, elementRect } from '../utils/position'

defineOptions({ name: 'NvPopover', inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: boolean
  anchor?: HTMLElement | null
  placement?: Placement
  offset?: number
  padding?: number
  showArrow?: boolean
  interactive?: boolean
  autoClose?: boolean
  transition?: 'fade' | 'scale' | 'none'
  contentClass?: unknown
  teleportTo?: string | HTMLElement
  role?: string
}>(), {
  modelValue: false,
  anchor: null,
  placement: 'bottom-start',
  offset: 8,
  padding: 8,
  showArrow: true,
  interactive: true,
  autoClose: true,
  transition: 'scale',
  teleportTo: 'body',
  role: 'dialog',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'show': []
  'hide': []
}>()

const mounted = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0, side: 'bottom' as 'top' | 'bottom' | 'left' | 'right', arrow: 0 })

const style = computed(() => ({
  position: 'fixed' as const,
  top: '0px',
  left: '0px',
  transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
  pointerEvents: props.interactive ? undefined : ('none' as const),
}))

const arrowStyle = computed(() => {
  const { side, arrow } = position.value
  return side === 'top' || side === 'bottom'
    ? { left: `${arrow}px` }
    : { top: `${arrow}px` }
})

const transitionName = computed(() => (props.transition === 'none' ? undefined : `nv-popover-${props.transition}`))

function update() {
  const anchor = props.anchor
  const content = contentRef.value
  if (!anchor || !content) return
  const result = computePosition(elementRect(anchor), elementRect(content), {
    placement: props.placement,
    offset: props.offset,
    padding: props.padding,
  })
  position.value = { x: result.x, y: result.y, side: result.side, arrow: result.arrow }
}

let frame: number | null = null

function scheduleUpdate() {
  if (frame !== null || typeof requestAnimationFrame === 'undefined') return
  frame = requestAnimationFrame(() => {
    frame = null
    update()
  })
}

function cancelScheduledUpdate() {
  if (frame === null || typeof cancelAnimationFrame === 'undefined') return
  cancelAnimationFrame(frame)
  frame = null
}

function close() {
  if (props.modelValue) emit('update:modelValue', false)
}

function onDocumentPointerDown(event: PointerEvent | MouseEvent) {
  if (!props.autoClose || !props.modelValue) return
  const target = event.target as Node | null
  if (!target) return
  if (contentRef.value?.contains(target)) return
  if (props.anchor?.contains(target)) return
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

let observer: ResizeObserver | null = null

function addListeners() {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onKeydown)
  if (typeof ResizeObserver !== 'undefined' && contentRef.value) {
    observer = new ResizeObserver(scheduleUpdate)
    observer.observe(contentRef.value)
  }
}

function removeListeners() {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', scheduleUpdate, true)
  window.removeEventListener('resize', scheduleUpdate)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
  observer = null
  cancelScheduledUpdate()
}

watch(() => props.modelValue, async (visible) => {
  if (visible) {
    await nextTick()
    update()
    addListeners()
    emit('show')
  }
  else {
    removeListeners()
    emit('hide')
  }
})

watch(() => [props.anchor, props.placement], () => {
  if (props.modelValue) nextTick(update)
})

onMounted(() => {
  mounted.value = true
  if (props.modelValue) {
    nextTick(() => {
      update()
      addListeners()
    })
  }
})

onBeforeUnmount(removeListeners)

defineExpose({ update })
</script>

<template>
  <Teleport
    v-if="mounted"
    :to="teleportTo"
  >
    <Transition :name="transitionName">
      <div
        v-if="modelValue"
        ref="contentRef"
        class="nv-popover"
        :class="[`nv-popover--${position.side}`, contentClass]"
        :style="style"
        :role="role"
        v-bind="$attrs"
      >
        <div
          v-if="showArrow"
          class="nv-popover-arrow"
          :style="arrowStyle"
        />
        <div class="nv-popover-content">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
