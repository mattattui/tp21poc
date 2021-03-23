<template>
  <div class="tui-page">
    <slot v-if="isLoading" name="loading"></slot>
    <component
      v-for="(row, idx) in translatedRows"
      :key="`page-${data.id}-row-${idx}`"
      :is="row.component"
      :data="translatedBlock(row.id)"
      :row-index="idx"
    />
    <slot v-if="showError" name="error" :error="error"></slot>
  </div>
</template>

<script>
import { translatedRows, translatedBlock, translatedMetaInfo } from '../index';

export default {
  name: 'TuiPage',
  props: {
    data: {
      type: Object,
      required: false,
    },
    language: {
      type: String,
      required: true,
      default: 'en-GB',
    },
  },
  provide() {
    return {
      page: this.data,
      language: this.language,
    };
  },
  data() {
    return {
      isLoading: false,
      error: '',
      showError: false,
      innerPage: false,
    };
  },
  computed: {
    translatedRows() {
      return translatedRows(this.data, this.language);
    },
  },
  methods: {
    translatedBlock(blockId) {
      return translatedBlock(this.data, this.language, blockId);
    },
  },
  watch: {
    data: {
      handler() {
        if (!location.hash) {
          return;
        }

        this.$nextTick(() => {
          const elem = document.getElementById(location.hash.substr(1));
          if (!elem) {
            return;
          }

          scrollTo(0, elem.offsetTop - 40);
        });
      },
    },
  },
  metaInfo() {
    return translatedMetaInfo(this.data, this.language);
  },
};
</script>
