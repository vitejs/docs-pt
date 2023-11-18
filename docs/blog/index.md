<script setup>
import { ref } from 'vue'

const items = ref([
  { name: 'Anunciando a Vite 2', link: './announcing-vite2'},
  { name: 'Anunciando a Vite 3', link: './announcing-vite3'},
  { name: 'Anunciando a Vite 4.0', link: './announcing-vite4'},
  { name: 'Anunciando a Vite 4.3', link: './announcing-vite4-3'},
  { name: 'Anunciando a Vite 5', link: './announcing-vite5'},
])
</script>

# Blogue

<ul class="blog-list">
  <li v-for="item in items" class="blog-list__item" >
    <a :href="item.link" class="blog-list__link">{{ item.name }}</a>
  </li>
</ul>

<style scoped>
.blog-list {
  margin-left: 0;
  margin-top: 40px;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
