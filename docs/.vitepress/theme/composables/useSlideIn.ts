import e from 'express'
import { gsap } from 'gsap'
import { nextTick, onMounted } from "vue"

export function useSlideIn(el: HTMLElement | string) {
  onMounted(async () => {
    await nextTick(() => {
      gsap.to(el, {
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 100%',
          once: true,
        }
      })
    })
  })
}
