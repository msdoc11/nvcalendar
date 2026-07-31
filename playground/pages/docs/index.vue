<script setup lang="ts">
import {
  FIRST_COMPONENT,
  INSTALL_CLI,
  INSTALL_MANUAL,
  MODULE_OPTIONS,
  NUXT_CONFIG,
  PLAIN_VUE,
} from '../../utils/snippets'

const { t } = useI18n()

useHead({ title: () => t('docs.start.title') })
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.start.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.start.lead') }}
    </p>

    <h2 id="installation">
      {{ t('docs.start.installTitle') }}
    </h2>
    <p>{{ t('docs.start.installText') }}</p>
    <p>{{ t('docs.start.installAuto') }}</p>
    <CodeBlock
      :code="INSTALL_CLI"
      lang="bash"
    />
    <p>{{ t('docs.start.installManual') }}</p>
    <CodeBlock
      :code="INSTALL_MANUAL"
      lang="bash"
    />
    <CodeBlock
      :code="NUXT_CONFIG"
      lang="javascript"
      label="nuxt.config.ts"
    />

    <h2 id="first-component">
      {{ t('docs.start.usageTitle') }}
    </h2>
    <p>{{ t('docs.start.usageText') }}</p>
    <CodeBlock :code="FIRST_COMPONENT" />

    <h2 id="module-options">
      {{ t('docs.start.optionsTitle') }}
    </h2>
    <p>{{ t('docs.start.optionsText') }}</p>
    <CodeBlock
      :code="MODULE_OPTIONS"
      lang="javascript"
      label="nuxt.config.ts"
    />

    <h2 id="plain-vue">
      {{ t('docs.start.vueTitle') }}
    </h2>
    <p>{{ t('docs.start.vueText') }}</p>
    <CodeBlock
      :code="PLAIN_VUE"
      lang="javascript"
      label="main.ts"
    />

    <h2 id="ssr">
      {{ t('docs.start.ssrTitle') }}
    </h2>
    <p>{{ t('docs.start.ssrText') }}</p>
  </article>
</template>
