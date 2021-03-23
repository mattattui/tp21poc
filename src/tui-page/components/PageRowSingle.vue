<template>
  <component
    :is="block.component"
    :id="block.id"
    :data="block"
    :class="`tui-page__block tui-page__block--${block.component}`"
  />
</template>

<script>
import { translatedBlock } from '../index';

export default {
  name: 'PageRowSingle',
  inject: ['page', 'language'],
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    block() {
      const blockId = this.data.blocks.slice(0, 1);

      return translatedBlock(this.page, this.language, blockId);
    },
  },
};
</script>
