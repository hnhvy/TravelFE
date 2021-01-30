<template>
  <div>
    <div v-for="(item, index) in items" :key="index" class="border mt-2">
      <div class="d-flex align-items-center">
        <b-button
          v-if="!item.visibleFormUpdate"
          v-b-toggle="'' + item.id"
          variant="link"
          class="text-left text-decoration-none w-100"
          :style="indent"
          >{{ language === 'En' ? item.enName : item.viName }}
        </b-button>
        <div
          v-else
          class="container-form-category d-flex align-items-center"
          :style="indent"
        >
          <div>
            <validation-observer v-slot="{ handleSubmit }" ref="formUpdate">
              <b-form
                ref="form"
                inline
                @submit.prevent="handleSubmit(() => submitFormEdit(form))"
              >
                <label class="mr-3 text-main-color">EnName</label>
                <validation-provider
                  v-slot="validationContext"
                  name="enName"
                  :rules="{ required: true }"
                >
                  <b-form-group>
                    <b-form-input
                      v-model.trim="form.enName"
                      size="sm"
                      :state="getValidationState(validationContext)"
                    />
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <label class="mr-3 ml-9 text-main-color">ViName</label>
                <validation-provider
                  v-slot="validationContext"
                  name="viName"
                  :rules="{ required: true }"
                >
                  <b-form-group>
                    <b-form-input
                      v-model.trim="form.viName"
                      size="sm"
                      :state="getValidationState(validationContext)"
                    />
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-form>
            </validation-observer>
          </div>
          <div class="ml-auto">
            <b-button
              variant="link"
              class="text-left text-decoration-none p-0"
              :disabled="processing"
              @click="hideFormUpdate(index)"
              >Cancel
            </b-button>
            <b-button
              variant="link"
              class="text-left text-decoration-none p-0 ml-5"
              :disabled="processing"
              @click="update(index, item.id)"
              >Update
            </b-button>
            <b-button
              variant="link"
              class="text-left text-decoration-none p-0 ml-5"
              :disabled="processing"
              @click="deleteItem(item.id)"
              >Delete
            </b-button>
          </div>
        </div>
        <b-button
          v-if="!item.visibleFormUpdate"
          variant="link"
          :disabled="editable"
          @click="showFormUpdate(index, item.id)"
        >
          <b-icon-pencil />
        </b-button>
        <b-icon-chevron-right
          v-if="item.children && item.children.length > 0 && depth === 0"
          v-b-toggle="'' + item.id"
          class="icon-chevron mr-5"
          style="cursor: pointer;"
          variant="main-color"
          scale="1.2"
        />
      </div>
      <b-collapse v-if="depth == 0" :id="'' + item.id">
        <collapse-menu
          :items="item.children"
          :depth="depth + 1"
          :parent-id="item.id"
          :language="language"
        />
      </b-collapse>
    </div>
    <div class="border mt-2 d-flex align-items-center">
      <b-button
        v-if="!visibleFormAdd"
        :style="indent"
        variant="link"
        class="w-100 text-left text-decoration-none"
        :disabled="editable"
        @click="showFormAdd"
        ><b-icon-plus scale="1.2" class="mr-1 align-text-top" />Add Item
      </b-button>
      <div
        v-else
        class="container-form-category d-flex align-items-center"
        :style="indent"
      >
        <div>
          <validation-observer v-slot="{ handleSubmit }" ref="formAdd">
            <b-form
              ref="form"
              inline
              @submit.prevent="handleSubmit(() => submitFormEdit(form))"
            >
              <label class="mr-3 text-main-color">EnName</label>
              <validation-provider
                v-slot="validationContext"
                name="enName"
                :rules="{ required: true }"
              >
                <b-form-group>
                  <b-form-input
                    v-model.trim="form.enName"
                    size="sm"
                    :state="getValidationState(validationContext)"
                  />
                  <b-form-invalid-feedback>{{
                    validationContext.errors[0]
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
              <label class="mr-3 ml-9 text-main-color">ViName</label>
              <validation-provider
                v-slot="validationContext"
                name="viName"
                :rules="{ required: true }"
              >
                <b-form-group>
                  <b-form-input
                    v-model.trim="form.viName"
                    size="sm"
                    :state="getValidationState(validationContext)"
                  />
                  <b-form-invalid-feedback>{{
                    validationContext.errors[0]
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-form>
          </validation-observer>
        </div>
        <div class="ml-auto">
          <b-button
            variant="link"
            class="text-left text-decoration-none p-0"
            :disabled="processing"
            @click="hideFormAdd"
            >Cancel
          </b-button>
          <b-button
            variant="link"
            class="text-left text-decoration-none p-0 ml-5"
            :disabled="processing"
            @click="add"
            >Add
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'CollapseMenu',
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: null,
    },
    depth: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'En',
    },
    parentId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      visibleFormAdd: false,
      editable: false,
      form: {
        enName: '',
        viName: '',
        parentId: this.parentId,
      },
    }
  },
  computed: {
    indent() {
      return { marginLeft: `${this.depth * 14}px` }
    },
  },
  created() {
    this.$bus.$on('editable', (payload) => (this.editable = payload))
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
    showFormAdd() {
      this.visibleFormAdd = !this.visibleFormAdd
      this.$bus.$emit('editable', true)
    },
    hideFormAdd() {
      this.visibleFormAdd = !this.visibleFormAdd
      this.$bus.$emit('editable', false)
    },
    async add() {
      const valid = await this.$refs.formAdd.validate()
      if (valid) {
        this.$bus.$emit('onAdd', this.form)
      }
    },
    showFormUpdate(index, id) {
      Vue.set(this.items[index], 'visibleFormUpdate', true)
      this.$bus.$emit('editable', true)
      const target = this.items.filter((item) => item.id === id)[0]
      this.form = {
        enName: target.enName,
        viName: target.viName,
        parentId: this.parentId,
      }
    },
    hideFormUpdate(index) {
      Vue.set(this.items[index], 'visibleFormUpdate', false)
      this.$bus.$emit('editable', false)
      this.form = {
        enName: '',
        viName: '',
        parentId: this.parentId,
      }
    },
    async update(index, id) {
      const valid = await this.$refs.formUpdate[0].validate()
      if (valid) {
        this.$bus.$emit('onUpdate', id, this.form)
      }
    },
    deleteItem(id) {
      this.$bus.$emit('onDelete', id)
    },
  },
}
</script>
<style scoped>
.collapsed.icon-chevron {
  transition: 0.3s transform ease-in-out;
}
.not-collapsed.icon-chevron {
  transition: 0.3s transform ease-in-out;
  transform: rotate(90deg);
}
.form-control-sm {
  height: 0.6rem;
}
.container-form-category {
  width: 100%;
  padding: 0.6699rem 1.3rem 0.5199rem 1.3rem;
}
</style>
