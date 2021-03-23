<template>
  <div>
    <div v-html="data.copy" />
    {{ page.pageData.content.layout.length }} rows in this page
  </div>
</template>

<script>
export default {
  inject: ['page'],
  props: {
    data: Object,
  },
};
</script>
