<template>
  <div id="app">
    <div>
      <p>Super advanced fake CMS:</p>
      <button @click="addPara(page)">Add row to 1st page</button>
    </div>
    <TuiPage :data="page" language="en" />
    <hr />
    <TuiPage v-if="page2" :data="page2" language="en" />
  </div>
</template>

<script>
const newId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

import { createPage, withPage } from '@/tui-page';

export default {
  name: 'App',
  data() {
    return {
      page: require('@/assets/test.json'),
      page2: null,
    };
  },
  created() {
    const page = createPage('en');
    this.addPara(page);
    this.page2 = page;
  },
  methods: {
    addPara(page) {
      const blockId = newId();

      withPage(page)
        .setBlock({
          id: blockId,
          component: 'PageText',
          languages: ['en'],
          copy:
            '<p>Laborum ex qui incididunt occaecat nisi adipisicing esse elit culpa excepteur nulla est esse. Dolor et incididunt labore dolor ullamco quis tempor ad officia ad Lorem ullamco sunt. Veniam quis fugiat aute quis anim dolor irure occaecat ipsum.</p>',
        })
        .addRow({
          id: newId(),
          component: 'PageRowFlex',
          blocks: [blockId],
          languages: ['en'],
        });
    },
  },
};
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
