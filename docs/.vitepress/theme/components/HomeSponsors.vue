<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'

const { data } = useSponsor()
</script>

<template>
  <VPHomeSponsors
    v-if="data"
    message="Vite é gratuita e de código-aberto, tornada possível graças aos nossos maravilhosos patrocinadores."
    action-text="Torna-te um patrocinador"
    action-link="https://github.com/sponsors/yyx990803"
    :data="data"
  />
</template>
