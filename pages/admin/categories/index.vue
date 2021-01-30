<template>
  <div>
    <div>
      <breadcrumb heading="Categories"></breadcrumb>
    </div>
    <div>
      <b-card title="Manage Categories">
        <div class="mb-6">
          <span sm="2" class="mr-2"><b>Language:</b></span>
          <b-form-radio-group v-model="language" class="d-inline">
            <b-form-radio value="En">English</b-form-radio>
            <b-form-radio value="Vi">Vietnamese</b-form-radio>
          </b-form-radio-group>
        </div>
        <collapse-menu
          v-if="!$fetchState.pending"
          :items="stateCategory.categories"
          :language="language"
          @onAdd="onAdd"
          @processing="processing"
        />
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { CollapseMenu } from '@/components/uncommon'
export default {
  layout: 'admin',
  components: {
    CollapseMenu,
  },
  async fetch() {
    try {
      await this.fetchDataCategories()
    } catch (e) {
      this.$toast.error(e)
    }
  },
  data() {
    return {
      language: 'En',
      processing: false,
    }
  },
  computed: {
    ...mapState({
      stateCategory: (state) => state.category,
    }),
  },
  created() {
    this.$bus.$on('onAdd', (payload) => this.onAdd(payload))
    this.$bus.$on('onUpdate', (id, payload) => this.onUpdate(id, payload))
    this.$bus.$on('onDelete', (id) => this.onDelete(id))
  },
  beforeDestroy() {
    this.$bus.$off('onAdd')
    this.$bus.$off('onUpdate')
    this.$bus.$off('onDelete')
  },
  methods: {
    ...mapActions([
      'fetchDataCategories',
      'addCategory',
      'updateCategory',
      'deleteCategory',
    ]),
    async onAdd(payload) {
      try {
        this.processing = true
        await this.addCategory(payload)
        this.$fetch()
        this.$toast.success('Add successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },

    async onUpdate(id, payload) {
      try {
        this.processing = true
        await this.updateCategory({ id, payload })
        this.$fetch()
        this.$toast.success('Update successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },

    async onDelete(id) {
      try {
        this.processing = true
        await this.deleteCategory(id)
        this.$fetch()
        this.$toast.success('Delete successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
  },
}
</script>
