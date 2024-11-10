---
title: Vite
titleTemplate: Ferramentas de Frontend Modernas
pageClass: landing dark

layout: home
aside: false
editLink: false
markdownStyles: false
---

<script setup>
import Hero from './.vitepress/theme/components/landing/hero-section/HeroSection.vue'
import FeatureSection from './.vitepress/theme/components/landing/feature-section/FeatureSection.vue'
import FrameworksSection from './.vitepress/theme/components/landing/frameworks-section/FrameworksSection.vue'
import CommunitySection from './.vitepress/theme/components/landing/community-section/CommunitySection.vue'
import SponsorSection from './.vitepress/theme/components/landing/sponsor-section/SponsorSection.vue'
import GetStartedSection from './.vitepress/theme/components/landing/get-started-section/GetStartedSection.vue'
import FeatureInstantServerStart from './.vitepress/theme/components/landing/feature-section/FeatureInstantServerStart.vue'
import FeatureHMR from './.vitepress/theme/components/landing/feature-section/FeatureHMR.vue'
import FeatureRichFeatures from './.vitepress/theme/components/landing/feature-section/FeatureRichFeatures.vue'
import FeatureOptimizedBuild from './.vitepress/theme/components/landing/feature-section/FeatureOptimizedBuild.vue'
import FeatureFlexiblePlugins from './.vitepress/theme/components/landing/feature-section/FeatureFlexiblePlugins.vue'
import FeatureTypedAPI from './.vitepress/theme/components/landing/feature-section/FeatureTypedAPI.vue'
import FeatureSSRSupport from './.vitepress/theme/components/landing/feature-section/FeatureSSRSupport.vue'
import FeatureCI from './.vitepress/theme/components/landing/feature-section/FeatureCI.vue'
</script>

<div class="VPHome">
  <Hero/>
  <FeatureSection title="Redefinir a Experiência de Programação" description="Vite simplifica novamente o desenvolvimento da Web" type="blue">
    <FeatureInstantServerStart />
    <FeatureHMR />
    <FeatureRichFeatures />
    <FeatureOptimizedBuild />
  </FeatureSection>
  <FeatureSection title="Uma Base Partilhada Sobre a Qual Construir" type="pink" class="feature-section--flip">
    <FeatureFlexiblePlugins />
    <FeatureTypedAPI />
    <FeatureSSRSupport />
    <FeatureCI />
  </FeatureSection>
  <FrameworksSection />
  <CommunitySection />
  <SponsorSection />
  <GetStartedSection />
</div>
