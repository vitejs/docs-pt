---
layout: page
title: Conheça a Equipa
description: O desenvolvimento da Vite é guiado por uma equipa internacional.
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
    <template #title>Conheça a Equipa</template>
    <template #lead>
      O desenvolvimento da Vite é guiado por uma equipa internacional, alguns dos quais escolheram ser mencionados abaixo.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <VPTeamPageSection>
    <template #title>Equipa Emérita</template>
    <template #lead>
      Aqui honramos alguns membros da equipa que já não estão ativos os quais fizeram contribuições valiosas no passado.
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection>
</VPTeamPage>
