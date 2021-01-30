<template>
  <div class="container-form-edit-role">
    <b-overlay :show="processing" spinner-variant="main-color" no-wrap />
    <validation-observer v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(() => submitFormEdit(form))">
        <validation-provider
          v-slot="validationContext"
          name="Name role"
          :rules="{ required: true }"
        >
          <b-form-group label="Name role" class="mb-7">
            <b-form-input
              v-model.trim="form.name"
              :state="
                validationContext.errors[0]
                  ? false
                  : validationContext.valid
                  ? true
                  : null
              "
            />
            <b-form-invalid-feedback>{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>

        <b-form-group label="Description" class="mb-7">
          <b-form-input v-model.trim="form.description" />
        </b-form-group>

        <b-form-group label="Permission" class="mb-0">
          <b-form-checkbox v-model="selectedAll" @change="toggleAll">{{
            selectedAll ? 'UN SELECT All' : 'SELECT All'
          }}</b-form-checkbox>
          <hr class="mb-0" />
          <perfect-scrollbar>
            <b-form-checkbox-group
              v-model="selected"
              :options="options"
              class="wrap"
              text-field="name"
              value-field="id"
              stacked
            ></b-form-checkbox-group>
          </perfect-scrollbar>
        </b-form-group>
        <hr class="mt-0" />
        <div class="float-right">
          <b-button
            type="submit"
            size="lg"
            :class="{
              'btn-multiple-state btn-shadow': true,
              'show-spinner': processing,
            }"
            :disabled="disabled"
            variant="main-color"
          >
            <span class="spinner d-inline-block">
              <span class="bounce1"></span>
              <span class="bounce2"></span>
              <span class="bounce3"></span>
            </span>
            <span class="label">{{ action }}</span>
          </b-button>
        </div>
      </b-form>
    </validation-observer>
  </div>
</template>
<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
export default {
  components: {
    PerfectScrollbar,
  },
  props: {
    action: {
      type: String,
      default: '',
    },
    permissions: {
      type: Array,
      default: () => [],
    },
    role: {
      type: Object,
      default: () => {
        return { name: '', description: '', permissions: [] }
      },
    },
    submitFormEdit: {
      type: Function,
      default: () => {},
    },
    processing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: this.role.name,
        description: this.role.description,
        permissionIds: [],
      },
      disabled: true,
      selectedAll: this.role.permissions.some((item) => item.id === 1) ?? false,
      selected: this.role.permissions.some((item) => item.id === 1)
        ? this.permissions
            .filter((item) => item.id !== 1)
            .map((item) => item.id)
        : this.role.permissions
            .filter((item) => item.id !== 1)
            .map((item) => item.id),
    }
  },
  computed: {
    options() {
      return this.permissions.filter((item) => item.id !== 1)
    },
  },
  watch: {
    form: {
      handler() {
        this.disabled = false
      },
      deep: true,
    },
    selected(val) {
      if (val.length < this.permissions.length - 1) {
        this.selectedAll = false
      } else if (val.length === this.permissions.length - 1) {
        this.selectedAll = true
      }
      this.form.permissionIds = this.selectedAll ? [1] : this.selected
    },
  },
  created() {
    console.log(this.permissions)
  },
  methods: {
    toggleAll(checked) {
      this.selected = checked
        ? this.permissions
            .filter((item) => item.id !== 1)
            .map((item) => item.id)
        : []
    },
  },
}
</script>

<style lang="scss" scoped>
.container-form-edit-role {
  .ps {
    height: 408px;
  }
}
</style>
