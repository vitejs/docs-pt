---
layout: home

title: Vite
titleTemplate: Ferramentas de Frontend Modernas

hero:
  name: Vite
  text: Ferramentas de Frontend Modernas
  tagline: Um ecossistema que adapta-se as nossas necessidades.
  image:
    src: /logo-with-shadow.png
    alt: Vite
  actions:
    - theme: brand
      text: Começar
      link: /guide/
    - theme: alt
      text: Por que Vite?
      link: /guide/why
    - theme: alt
      text: Ver na GitHub
      link: https://github.com/vitejs/vite
    - theme: brand
      text: 🎉 ViteConf 23!
      link: https://viteconf.org/23/replay?utm=vite-homepage

features:
  - icon: 💡
    title: Inicialização de Servidor Instantâneo
    details: Ficheiro sobre demanda servindo sobre Módulo de ECMAScript, sem necessidade de empacotamento!
  - icon: ⚡️
    title: Substituição de Módulo Instantânea Rápida como Relâmpago
    details: Substituição de Módulo Instantânea que se mantém rápida independentemente do tamanho da aplicação.
  - icon: 🛠️
    title: Vastos Recursos
    details: Suporte fora da caixa para TypeScript, JSX, CSS e muito mais.
  - icon: 📦
    title: Construção Otimizada
    details: Construção de Rollup pré-configurada com suporte a várias páginas e mode de biblioteca.
  - icon: 🔩
    title: Extensões Universais
    details: Interface de extensão de superconjunto de Rollup partilhada entre o desenvolvimento e a construção.
  - icon: 🔑
    title: APIs Completamente Tipificadas
    details: APIs programáticas flexíveis com tipos completos de TypeScript.
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('uwu') != null) {
    const img = document.querySelector('.VPHero .VPImage.image-src')
    img.src = '/logo-uwu.png'
    img.alt = 'Logótipo Kawaii da Vite por @icarusgkx'
  }
})
</script>
