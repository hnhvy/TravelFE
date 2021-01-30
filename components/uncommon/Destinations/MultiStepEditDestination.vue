<template>
  <b-card no-body>
    <b-overlay :show="processing" spinner-variant="main-color" no-wrap />
    <b-card-body class="wizard wizard-default">
      <form-wizard :top-nav-disabled="true" :with-validate="true">
        <tab
          name="Step 1"
          desc="Thumbnail"
          :selected="true"
          :validate="validateStep1"
        >
          <div class="wizard-basic-step">
            <validation-provider
              ref="formChild1"
              v-slot="validationContext"
              name="Thumbnail"
              :rules="{ image: true }"
            >
              <b-form-group label="Name" class="mb-7">
                <b-form-file
                  v-model="file"
                  accept="image/*"
                  :state="getValidationState(validationContext)"
                  @change="handleChange"
                ></b-form-file>
                <b-form-invalid-feedback>{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <div class="text-center">
              <b-img
                v-if="imageUrl"
                thumbnail
                fluid
                :src="imageUrl"
                class="my-4"
              />
            </div>
          </div>
        </tab>
        <tab name="Step 2" desc="English" :validate="validateStep2">
          <div class="wizard-basic-step">
            <validation-observer ref="formChild2">
              <b-form>
                <validation-provider
                  v-slot="validationContext"
                  name="Name"
                  :rules="{ required: true }"
                >
                  <b-form-group label="Name" class="mb-7">
                    <b-form-input
                      v-model.trim="form.enName"
                      :state="getValidationState(validationContext)"
                    />
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <validation-provider
                  v-slot="validationContext"
                  name="Description"
                  :rules="{ required: true }"
                >
                  <b-form-group label="Description" class="mb-7">
                    <b-form-input
                      v-model.trim="form.enDescription"
                      :state="getValidationState(validationContext)"
                    />
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <b-form-group label="Content" class="mb-7">
                  <editor
                    v-model="form.enContent"
                    api-key="pyehxhli5mudohyd3tknd30z40s13zol8mcvt61tzcf9q2mp"
                    :init="initTinymce"
                  />
                  <!-- <b-form-input
                      v-model.trim="form.viDescription"
                      :state="getValidationState(validationContext)"
                    /> -->
                </b-form-group>
              </b-form>
            </validation-observer>
          </div>
        </tab>
        <tab name="Step 3" desc="Vietnamese" :validate="validateStep3">
          <div class="wizard-basic-step">
            <validation-observer ref="formChild3">
              <b-form>
                <validation-provider
                  v-slot="validationContext"
                  name="Name"
                  :rules="{ required: true }"
                >
                  <b-form-group label="Name" class="mb-7">
                    <b-form-input
                      v-model.trim="form.viName"
                      :state="getValidationState(validationContext)"
                    />
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <validation-provider
                  v-slot="validationContext"
                  name="Content"
                  :rules="{ required: true }"
                >
                  <b-form-group label="Description" class="mb-7">
                    <b-form-input
                      v-model.trim="form.viDescription"
                      :state="getValidationState(validationContext)"
                    />
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
                <b-form-group label="Content" class="mb-7">
                  <editor
                    v-model="form.viContent"
                    api-key="pyehxhli5mudohyd3tknd30z40s13zol8mcvt61tzcf9q2mp"
                    :init="initTinymce"
                  />
                  <!-- <b-form-input
                      v-model.trim="form.viDescription"
                      :state="getValidationState(validationContext)"
                    /> -->
                </b-form-group>
              </b-form>
            </validation-observer>
          </div>
        </tab>
        <tab name="Step 4" desc="Address" :validate="validateStep4">
          <div class="wizard-basic-step">
            <validation-observer ref="formChild4">
              <b-form>
                <validation-provider
                  v-slot="validationContext"
                  name="Address"
                  :rules="{ required: true }"
                >
                  <b-form-group
                    label="Address"
                    class="mb-7 tooltip-center-top"
                    description="NO. street, district, city, nation"
                  >
                    <b-input-group>
                      <b-form-input
                        v-model.trim="form.address"
                        :state="getValidationState(validationContext)"
                        @keyup.enter="previewLocation"
                      />
                      <b-form-invalid-feedback>{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                      <b-input-group-append>
                        <b-button
                          variant="outline-main-color"
                          @click="previewLocation"
                          >Preview</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </validation-provider>
              </b-form>
            </validation-observer>
          </div>
          <google-map
            class="mb-7"
            :lat="form.latitude"
            :lng="form.longitude"
          ></google-map>
        </tab>
        <tab type="done">
          <div class="wizard-basic-step text-center mt-10">
            <h2 class="mb-2">Create new destination</h2>
            <b-button
              :class="{
                'mb-8': true,
                'btn-multiple-state': true,
                'show-spinner': processing,
              }"
              variant="main-color"
              @click="done"
            >
              <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
              </span>
              <span class="label">Submit</span>
            </b-button>
          </div>
        </tab>
      </form-wizard>
    </b-card-body>
  </b-card>
</template>

<script>
import { Tab, FormWizard, GoogleMap } from '@/components/common'
import Editor from '@tinymce/tinymce-vue'

export default {
  components: {
    Editor,
    FormWizard,
    Tab,
    GoogleMap,
  },
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
    destination: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      imageUrl: this.destination?.thumbnail ?? '',
      file: null,
      initTinymce: {
        height: 400,
        menubar: false,
        toolbar: `undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat`,
      },

      form: {
        enName: this.destination?.enName ?? '',
        enDescription: this.destination?.enDescription ?? '',
        enContent: this.destination?.enContent ?? '',
        viName: this.destination?.viName ?? '',
        viDescription: this.destination?.viDescription ?? '',
        viContent: this.destination?.viContent ?? '',
        thumbnail: this.destination?.thumbnail ?? '',
        latitude: this.destination?.latitude ?? 0,
        longitude: this.destination?.longitude ?? 0,
        address: this.destination?.address ?? '',
      },
    }
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    handleChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.getBase64(file, (imageUrl) => {
          this.imageUrl = imageUrl
        })
      }
    },
    async validateStep1() {
      const { valid } = await this.$refs.formChild1.validate()
      return valid
    },
    validateStep2() {
      return this.$refs.formChild2.validate()
    },
    validateStep3() {
      return this.$refs.formChild3.validate()
    },
    validateStep4() {
      return this.$refs.formChild4.validate()
    },
    async previewLocation() {
      if (await this.$refs.formChild4.validate()) {
        const location = await this.$geoCodeApi.get(this.form.address)
        if (location) {
          this.form = {
            ...this.form,
            ...location,
          }
        } else {
          this.$toast.error('location not found')
        }
      }
    },

    done() {
      this.$emit('onSubmit', this.file, this.form)
    },
  },
}
</script>
