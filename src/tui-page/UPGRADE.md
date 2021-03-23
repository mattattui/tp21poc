# Upgrading from 2.x

## Overview of changes

* The vuex module has been removed. You can store your page in vuex if you like, you just don't need to any more.
* The structure of the plugin is now: the TuiPage component and two sample row types, and a collection of functions for viewing and manipulating page objects.
* All previous actions exist as functions you can import from the plugin, with the same arguments as before except with the page object first. e.g. `setSlug(slug)` is now `setSlug(page, slug)`.
* You can use the new `withPage(page)` function to return an object that fills in the page argument for you, so where before you would map actions from the TuiPage vuex module to edit the page in the store, now you would `import { withPage } from '@tuimedia/vue-page';` and then use `withPage(page).swapRow(2).setSlug('my-page');` etc. For example

    Before:

    ```js
    import { mapActions, mapState } from 'vuex';

    export default {
      computed: {
        ...mapState('TuiPage', ['page']),
      },
      methods: {
        ...mapActions('TuiPage', ['setSlug']),
        editSlug(slug) {
          this.setSlug(slug);
        },
      },
    };
    ```

    After

    ```js
    import { withPage, createPage } from '@tuimedia/vue-page';

    export default {
      data() {
        return {
          page: createPage('en'),
        };
      },
      methods: {
        editSlug(slug) {
          withPage(this.page).setSlug(slug);
        },
      },
    };
    ```

* The biggest advantage of the removal of the vuex module is that you may now have multiple TuiPage components on the same page.
