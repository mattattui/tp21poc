import TuiPage from './components/TuiPage.vue';
import PageRowFlex from './components/PageRowFlex.vue';
import PageRowSingle from './components/PageRowSingle.vue';
import Vue from 'vue';

// Declare install function executed by Vue.use()
const install = function (Vue) {
  Vue.component('TuiPage', TuiPage);
  Vue.component('PageRowFlex', PageRowFlex);
  Vue.component('PageRowSingle', PageRowSingle);
};

// Create module definition for Vue.use()
const plugin = {
  install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export const createPage = (language) => ({
  id: null,
  slug: '',
  state: 'live',
  pageData: {
    defaultLanguage: language,
    availableLanguages: [language],
    content: {
      schemaVersion: 2,
      blocks: {},
      langData: {
        [language]: {
          metadata: {},
        },
      },
      layout: [],
    },
    metadata: {},
  },
});

export const assertVersion = (page) => {
  if ((page.pageData.content.schemaVersion || 1) !== 2) {
    throw new Error('Invalid content; this version of vue-page requires schemaVersion 2');
  }
};

export const addRow = (page, row) => {
  setBlock(page, row);
  page.pageData.content.layout.push(row.id);
};

export const addRowBlock = (page, { index, blockId }) => {
  const rowId = page.pageData.content.layout[index];
  const blocks = [...page.pageData.content.blocks[rowId].blocks, blockId];
  page = setBlockData(page, { id: rowId, key: 'blocks', value: blocks });
};

export const setRow = (page, { row, index }) => {
  page = setBlock(page, { block: row });
  page.pageData.content.layout[index] = row.id;
};

export const deleteRowBlock = (page, { rowIndex, blockIndex }) => {
  const rowId = page.pageData.content.layout[rowIndex];
  const blocks = [...page.pageData.content.blocks[rowId].blocks];
  blocks.splice(blockIndex, 1);
  page = setBlockData(page, { id: rowId, key: 'blocks', value: blocks });
};

export const swapRowBlock = (page, { rowIndex, blockIndex }) => {
  const rowBlockId = page.pageData.content.layout[rowIndex];
  const blocks = [...page.pageData.content.blocks[rowBlockId].blocks];
  if (blocks[blockIndex] === undefined || blocks[blockIndex + 1] === undefined) {
    return;
  }
  blocks.splice(blockIndex, 2, blocks[blockIndex + 1], blocks[blockIndex]);
  page = setBlockData(page, { id: rowBlockId, key: 'blocks', value: blocks });
};

export const deleteRow = (page, index) => {
  const rowBlockId = page.pageData.content.layout[index];
  const blockIds = [...page.pageData.content.blocks[rowBlockId].blocks];

  // Delete the row
  Vue.delete(page.pageData.content.blocks, rowBlockId);
  page.pageData.content.layout.splice(index, 1);

  // Delete every block in the row
  blockIds.forEach((blockId) => {
    page = deleteBlock(page, blockId);
  });
};

export const swapRow = (page, index) => {
  const rows = page.pageData.content.layout;
  if (rows[index] === undefined || rows[index + 1] === undefined) {
    return;
  }

  rows.splice(index, 2, rows[index + 1], rows[index]);
};

export const setBlock = (page, block) => {
  Vue.set(page.pageData.content.blocks, block.id, block);
  if (!page.pageData.content.langData[page.pageData.defaultLanguage]?.[block.id]) {
    Vue.set(page.pageData.content.langData[page.pageData.defaultLanguage], block.id, {});
  }
};

export const setBlockData = (page, { id, key, value }) => {
  Vue.set(page.pageData.content.blocks[id], key, value);
};

export const setBlockLangData = (page, { language, value, id, key = null }) => {
  // Create the object with an individual property

  if (key && !page.pageData.content.langData[language]?.[id]) {
    Vue.set(page.pageData.content.langData[language], id, {
      [key]: value,
    });
  }

  // Set an individual property on an existing object
  if (key) {
    Vue.set(page.pageData.content.langData[language][id], key, value);
  }

  // Set whole object
  Vue.set(page.pageData.content.langData[language], id, value);
};

export const setRowLangData = setBlockLangData;

export const deleteBlock = (page, blockId) => {
  Vue.delete(page.pageData.content.blocks, blockId);
};

export const setSlug = (page, slug) => {
  page.slug = slug;
};

export const setMetadata = (page, { key = null, value }) => {
  // Set individual property
  if (key) {
    Vue.set(page.pageData.metadata, key, value);
    return;
  }

  // Set whole object
  Vue.set(page.pageData, 'metadata', value);
};

export const translatedRows = (page, language) => {
  if (!page) {
    return [];
  }

  const rows = page.pageData.content.layout
    .filter((rowId) => {
      const row = page.pageData.content.blocks[rowId];
      return Object.prototype.hasOwnProperty.call(row, 'languages')
        ? row.languages.includes(language)
        : true;
    })
    .map((rowId) => page.pageData.content.blocks[rowId]);

  // Remove blockIds of blocks which aren't enabled in the current language
  return rows.map((row) => ({
    ...row,
    blocks: row.blocks.filter((blockId) =>
      page.pageData.content.blocks[blockId].languages.includes(language),
    ),
  }));
};

export const translatedBlock = (page, language, blockId) => {
  const content = page.pageData.content;
  return {
    ...content.blocks[blockId],
    ...content.langData?.[page.pageData.defaultLanguage]?.[blockId],
    ...content.langData?.[language]?.[blockId],
  };
};

export const translatedMetadata = (page, language) => {
  if (!page) {
    return {};
  }
  // Don't use precalculated translatedMetadata, because it doesn't get updated by the cms
  const content = page.pageData.content;
  return {
    ...page.pageData.metadata,
    ...content.langData[page.pageData.defaultLanguage]?.metadata,
    ...content.langData?.[language]?.metadata,
  };
};

export const translatedMetaInfo = (page, language) => {
  // Return a subset of the translated metadata that can be consumed by vue-meta
  const info = {};
  const translatedMetadata = translatedMetadata(page, language);

  ['title', 'htmlAttrs', 'bodyAttrs', 'meta', 'link', 'style', 'script', 'noscript'].forEach(
    (key) => {
      if (Object.prototype.hasOwnProperty.call(translatedMetadata, key)) {
        info[key] = translatedMetadata[key];
      }
    },
  );

  return info;
};

export const withPage = (page) =>
  ({
    assertVersion() {
      assertVersion(page);
      return this;
    },
    addRow(row) {
      addRow(page, row);
      return this;
    },
    addRowBlock({ index, blockId }) {
      addRowBlock(page, { index, blockId });
      return this;
    },
    setRow({ row, index }) {
      setRow(page, { row, index });
      return this;
    },
    deleteRowBlock({ rowIndex, blockIndex }) {
      deleteRowBlock(page, { rowIndex, blockIndex });
      return this;
    },
    swapRowBlock({ rowIndex, blockIndex }) {
      swapRowBlock(page, { rowIndex, blockIndex });
      return this;
    },
    deleteRow(index) {
      deleteRow(page, index);
      return this;
    },
    swapRow(index) {
      swapRow(page, index);
      return this;
    },
    setBlock(block) {
      setBlock(page, block);
      return this;
    },
    setBlockData({ id, key, value }) {
      setBlockData(page, { id, key, value });
      return this;
    },
    setBlockLangData({ language, value, id, key = null }) {
      setBlockLangData(page, { language, value, id, key });
      return this;
    },
    setRowLangData({ language, value, id, key = null }) {
      setBlockLangData(page, { language, value, id, key });
      return this;
    },
    deleteBlock(blockId) {
      deleteBlock(page, blockId);
      return this;
    },
    setSlug(slug) {
      setSlug(page, slug);
      return this;
    },
    setMetadata({ key = null, value }) {
      setMetadata(page, { key, value });
      return this;
    },
  }.assertVersion(page));

export default plugin;
