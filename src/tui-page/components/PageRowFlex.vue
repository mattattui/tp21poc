<template>
  <div :class="rowClasses">
    <component
      v-for="(block, idx) in blocksForLanguage"
      :key="`block-${block.id}-${idx}`"
      :id="block.id"
      :is="block.component"
      :data="block"
      :class="`tui-page__block tui-page__block--${block.component}`"
    />
  </div>
</template>

<script>
import { translatedBlock } from '../index';

export default {
  name: 'PageRowFlex',
  inject: ['page', 'language'],
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          component: 'PageRowFlex',
          blocks: [],
          wrap: false,
          minWidth: 'tablet',
        };
      },
    },
  },
  computed: {
    rowClasses() {
      const classes = ['tui-page__row', 'tui-page__row--flex'];

      if (this.data.wrap) {
        classes.push(this.$style.wrap);
      }

      switch (this.data.minWidth || 'tablet') {
        case 'tablet':
          classes.push(this.$style.flexRowTabletUp);
          break;
        case 'desktop':
          classes.push(this.$style.flexRowDesktopUp);
          break;
        case 'none':
        case 'mobile':
        default:
          classes.push(this.$style.flexRowAlways);
      }

      return classes;
    },
    blocksForLanguage() {
      const _self = this;
      return this.data.blocks.map(function (blockId) {
        return translatedBlock(_self.page, _self.language, blockId);
      });
    },
  },
};
</script>

<style module>
.flexRowAlways {
  width: 100%;
  display: flex;
  justify-content: stretch;
  align-items: top;
}

/* For tablet up */
@media (min-width: 600px) {
  .flexRowTabletUp {
    width: 100%;
    display: flex;
    justify-content: stretch;
    align-items: top;
  }
}

/* For desktop & landscape tablet */
@media (min-width: 900px) {
  .flexRowDesktopUp {
    width: 100%;
    display: flex;
    justify-content: stretch;
    align-items: top;
  }
}

.wrap {
  flex-wrap: wrap;
}
</style>
