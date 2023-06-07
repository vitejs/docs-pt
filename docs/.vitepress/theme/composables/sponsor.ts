import { ref, onMounted } from 'vue'

interface Sponsors {
  special: Sponsor[]
  platinum: Sponsor[]
  platinum_china: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
}

interface Sponsor {
  name: string
  img: string
  url: string
}

// shared data across instances so we load only once.
const data = ref()

const dataHost = 'https://sponsors.vuejs.org'
const dataUrl = `${dataHost}/vite.json`

// no sponsors yet :(
const viteSponsors: Pick<Sponsors, 'special' | 'gold'> = {
  special: [
    // sponsors patak-dev
    {
      name: 'StackBlitz',
      url: 'https://stackblitz.com',
      img: '/stackblitz.svg'
    },
    // sponsor antfu
    {
      name: 'NuxtLabs',
      url: 'https://nuxtlabs.com',
      img: '/nuxtlabs.svg'
    },
    // sponsor bluwy
    {
      name: 'Astro',
      url: 'https://astro.build',
      img: '/astro.svg'
    }
  ],
  gold: [],
}

export function useSponsor() {
  onMounted(async () => {
    if (data.value) {
      return
    }

    const result = await fetch(dataUrl)
    const json = await result.json()

    data.value = mapSponsors(json)
  })

  return {
    data
  }
}

function mapSponsors(sponsors: Sponsors) {
  return [
    {
      tier: 'Patrocinadores Especiais',
      size: 'big',
      items: viteSponsors['special']
    },
    {
      tier: 'Patrocinadores de Platina',
      size: 'big',
      items: mapImgPath(sponsors['platinum'])
    },
    {
      tier: 'Patrocinadores de Ouro',
      size: 'medium',
      items: viteSponsors['gold'].concat(mapImgPath(sponsors['gold']))
    }
  ]
}

const viteSponsorNames = new Set(
  Object.values(viteSponsors).flatMap((sponsors) =>
    sponsors.map((s) => s.name),
  ),
)

function mapImgPath(sponsors: Sponsor[]) {
  return sponsors
    .filter((sponsor) => !viteSponsorNames.has(sponsor.name))
    .map((sponsor) => ({
      ...sponsor,
      img: `${dataHost}/images/${sponsor.img}`,
    }))
}
