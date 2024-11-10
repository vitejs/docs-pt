<script setup lang="ts">
import { data as posts } from '../../../_data/blog.data'

function getDateTime(time: number) {
  return new Date(time).toISOString()
}
</script>

<template>
  <ul class="blog-list">
    <li class="blog-entry" v-for="post of posts">
      <article>
        <time class="blog-entry-time" :datetime="getDateTime(post.date.time)">
          {{ post.date.string }}
        </time>
        <h2 class="blog-entry-title">
          <a class="blog-entry-link" :href="post.url">{{ post.title }}</a>
        </h2>
      </article>
    </li>
  </ul>
</template>

<style scoped>
.blog-list {
  padding: 0;
  list-style-type: none;
}
.blog-entry {
  margin-top: 3em;
  border-bottom: 1px solid var(--vp-c-divider);
}
.blog-entry-time {
  font-size: 14px;
}
.blog-entry-title {
  border: none;
  margin-top: 0;
  padding-top: 0;
  font-size: 22px;
}
.blog-entry-link {
  font-weight: 600;
  text-decoration: none;
}
</style>
