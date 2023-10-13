---
layout: page
title: Equipa
description: O desenvolvimento da Vite é orientado por uma equipa internacional.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'
import { core, emeriti } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Equipa</template>
    <template #lead>
      O desenvolvimento da Vite é orientado por uma equipa internacional, alguns dos quais escolheram ser mencionados abaixo.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Equipa Emérita</template>
    <template #lead>
      Nesta seção honramos alguns membros da equipa que já não são ativos, os quais fizeram contribuições valiosas no passado.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
