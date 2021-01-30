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
                  name="Title"
                  :rules="{ required: true }"
                >
                  <b-form-group label="Title" class="mb-7">
                    <b-form-input
                      v-model="form.enTitle"
                      trim
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
                      v-model="form.enDescription"
                      trim
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
                  name="Title"
                  :rules="{ required: true }"
                >
                  <b-form-group label="Title" class="mb-7">
                    <b-form-input
                      v-model="form.viTitle"
                      trim
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
                      v-model="form.viDescription"
                      trim
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
                </b-form-group>
              </b-form>
            </validation-observer>
          </div>
        </tab>
        <tab name="Step 4" desc="General" :validate="validateStep4">
          <div class="wizard-basic-step">
            <validation-observer ref="formChild4">
              <b-form>
                <b-row>
                  <b-col>
                    <b-form-group label="Price" class="mb-7">
                      <b-input-group class="flex-nowrap align-items-center">
                        <validation-provider
                          v-slot="validationContext"
                          name="price"
                          :rules="{ required: true }"
                        >
                          <b-form-input
                            v-model="form.price"
                            :number="true"
                            :state="getValidationState(validationContext)"
                            type="number"
                          />
                          <b-form-invalid-feedback>{{
                            validationContext.errors[0]
                          }}</b-form-invalid-feedback>
                        </validation-provider>
                        <div class="mx-2 mb-0 h6">/</div>
                        <b-input-group-append class="w-60 input-unit">
                          <validation-provider
                            v-slot="validationContext"
                            name="unit"
                            :rules="{ required: true }"
                          >
                            <b-form-input
                              v-model="form.unit"
                              trim
                              :state="getValidationState(validationContext)"
                              placeholder="Unit"
                            />
                          </validation-provider>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Current Price" class="mb-7">
                      <b-input-group class="flex-nowrap align-items-center">
                        <validation-provider
                          v-slot="validationContext"
                          name="currentPrice"
                          :rules="{ required: true }"
                        >
                          <b-form-input
                            v-model="form.currentPrice"
                            :number="true"
                            :state="getValidationState(validationContext)"
                            type="number"
                          />
                          <b-form-invalid-feedback>{{
                            validationContext.errors[0]
                          }}</b-form-invalid-feedback>
                        </validation-provider>
                        <div class="mx-2 mb-0 h6">/</div>
                        <b-input-group-append class="w-60 input-unit">
                          <validation-provider
                            v-slot="validationContext"
                            name="unit"
                            :rules="{ required: true }"
                          >
                            <b-form-input
                              v-model="form.unit"
                              trim
                              :state="getValidationState(validationContext)"
                              placeholder="Unit"
                            />
                          </validation-provider>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Net Price" class="mb-7">
                      <b-input-group class="flex-nowrap align-items-center">
                        <validation-provider
                          v-slot="validationContext"
                          name="netPrice"
                          :rules="{ required: true }"
                        >
                          <b-form-input
                            v-model="form.netPrice"
                            :number="true"
                            :state="getValidationState(validationContext)"
                            type="number"
                          />
                          <b-form-invalid-feedback>{{
                            validationContext.errors[0]
                          }}</b-form-invalid-feedback>
                        </validation-provider>
                        <div class="mx-2 mb-0 h6">/</div>
                        <b-input-group-append class="w-60 input-unit">
                          <validation-provider
                            v-slot="validationContext"
                            name="unit"
                            :rules="{ required: true }"
                          >
                            <b-form-input
                              v-model="form.unit"
                              trim
                              :state="getValidationState(validationContext)"
                              placeholder="Unit"
                            />
                          </validation-provider>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-form-group label="Note" class="mb-7">
                  <b-form-input v-model="form.note" trim />
                </b-form-group>
                <label>Categories</label>
                <treeselect
                  v-model="form.serviceCategoryIds"
                  :multiple="true"
                  :options="categories"
                  :normalizer="formatCategories"
                  :flat="true"
                  :required="true"
                  class="mb-7"
                />
                <label>Destinations</label>
                <treeselect
                  v-model="form.destinationIds"
                  :multiple="true"
                  :async="true"
                  :default-options="serviceDestinations"
                  :load-options="loadDestinationOptions"
                  :normalizer="formatDestinations"
                  :flat="true"
                  :required="true"
                  class="mb-7"
                />
                <label>Providers</label>
                <treeselect
                  v-model="form.providerIds"
                  :multiple="true"
                  :default-options="serviceProviders"
                  :async="true"
                  :load-options="loadProviderOptions"
                  :normalizer="formatProviders"
                  :flat="true"
                  :required="true"
                  class="mb-7"
                />
              </b-form>
            </validation-observer>
          </div>
        </tab>
        <tab name="Step 5" desc="Gallery">
          <div class="wizard-basic-step">
            <b-form-group label="Gallery" class="mb-7">
              <b-form-file
                accept="image/*"
                multiple
                class="upload-gallery"
                @change="setGallery"
              ></b-form-file>
            </b-form-group>
            <div class="text-center">
              <b-overlay :show="loadingGallery" no-wrap />
              <b-carousel
                :interval="0"
                class="my-5"
                controls
                indicators
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
              >
                <template v-for="(el, index) in form.gallery">
                  <b-overlay :key="index" :show="loadingImage[index]" no-wrap />
                  <b-carousel-slide :key="`slide-${index}`" :img-src="el">
                    <div class="absolute d-flex">
                      <input
                        ref="fileInput"
                        type="file"
                        class="d-none"
                        accept="image/*"
                        @change="
                          (e) => editGallery(e.target.files[0], el, index)
                        "
                      />
                      <div
                        class="bg-dark d-flex justify-content-center align-items-center"
                        style="width: 40px; height: 40px; cursor: pointer;"
                        @click="$refs.fileInput[index].click()"
                      >
                        <b-icon icon="pencil" font-scale="1.8"></b-icon>
                      </div>
                      <div
                        class="bg-dark d-flex justify-content-center align-items-center ml-2"
                        style="width: 40px; height: 40px; cursor: pointer;"
                        @click="removeImgGallery(index)"
                      >
                        <b-icon icon="trash" font-scale="1.8"></b-icon>
                      </div>
                    </div>
                  </b-carousel-slide>
                </template>
              </b-carousel>
            </div>
          </div>
        </tab>
        <tab type="done">
          <div class="wizard-basic-step text-center mt-10">
            <h2 class="mb-2">Create new service</h2>
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
import Vue from 'vue'
import Editor from '@tinymce/tinymce-vue'
import Treeselect, { ASYNC_SEARCH } from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { Tab, FormWizard } from '@/components/common'
import { fileMixin } from '@/mixins'
export default {
  components: { FormWizard, Tab, Treeselect, Editor },
  mixins: [fileMixin],
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Object,
      default: null,
    },
    destinations: {
      type: Array,
      default: null,
    },
    categories: {
      type: Array,
      default: null,
    },
    providers: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      formatCategories(node) {
        return {
          id: node.id,
          label: node.viName,
          children: node.children,
        }
      },
      formatDestinations(node) {
        return {
          id: node.id,
          label: node.viName,
        }
      },
      formatProviders(node) {
        return {
          id: node.id,
          label: node.email,
        }
      },
      initTinymce: {
        height: 400,
        menubar: false,
        plugins: 'code',
        toolbar: `undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | image | code`,
      },
      imageUrl: this.service?.thumbnail ?? '',
      file: null,
      // gallery: [],
      // previewGallery: this.service?.gallery ?? [],
      loadingGallery: false,
      loadingImage: this.service?.gallery.map(() => false) ?? [],
      form: {
        enTitle: this.service?.enTitle ?? '',
        enDescription: this.service?.enDescription ?? '',
        enContent: this.service?.enContent ?? '',
        viTitle: this.service?.viTitle ?? '',
        viDescription: this.service?.viDescription ?? '',
        viContent: this.service?.viContent ?? '',
        thumbnail: this.service?.thumbnail ?? '',
        currentPrice: this.service?.currentPrice ?? 0,
        netPrice: this.service?.netPrice ?? 0,
        price: this.service?.price ?? 0,
        serviceCategoryIds:
          this.service?.serviceCategories.map((item) => item.id) ?? [],
        destinationIds: this.service?.destinations.map((item) => item.id) ?? [],
        providerIds: this.service?.providers.map((item) => item.id) ?? [],
        unit: this.service?.unit ?? '',
        note: this.service?.note ?? '',
        gallery: this.service?.gallery ?? [],
      },
    }
  },
  computed: {
    serviceDestinations() {
      return this.service?.destinations ?? []
    },
    serviceProviders() {
      return this.service?.providers ?? []
    },
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
    async setGallery(e) {
      this.loadingGallery = true
      const files = Object.values(e.target.files)
      const gallery = await this.uploadFilesToS3(files, 'Gallery')
      this.form.gallery = this.form.gallery.concat(gallery)
      this.loadingImage = this.form.gallery.map(() => false)
      console.log(this.loadingImage)
      this.$forceUpdate()
      this.loadingGallery = false
    },

    async editGallery(file, url, index) {
      Vue.set(this.loadingImage, index, true)
      this.form.gallery[index] = await this.uploadFileToS3(file, 'Gallery')
      await this.$forceUpdate()
      Vue.set(this.loadingImage, index, false)
    },

    removeImgGallery(index) {
      const gallery = this.form.gallery.filter(
        (item) => item !== this.form.gallery[index]
      )
      Vue.set(this.form, 'gallery', gallery)
    },

    async loadDestinationOptions({ action, searchQuery, callback }) {
      if (action === ASYNC_SEARCH) {
        await this.$emit('loadDestinationOptions', searchQuery)
        const options = this.destinations
        callback(null, options)
      }
    },

    async loadProviderOptions({ action, searchQuery, callback }) {
      if (action === ASYNC_SEARCH) {
        await this.$emit('loadProviderOptions', searchQuery)
        const options = this.providers
        callback(null, options)
      }
    },

    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
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
    done() {
      this.$emit('onSubmit', this.file, this.form)
    },
  },
}
</script>
<style lang="scss" scoped>
.input-unit {
  ::v-deep .is-invalid {
    border-color: #dc3545;
    padding-right: 0.65rem;
  }
}
::v-deep .carousel-caption {
  left: 10px;
  top: 0;
  padding: 0;
}
::v-deep .image-container {
  width: 100%;
  height: 300px;
  > div {
    height: 100%;
    .preview-image {
      height: 100%;
      .show-img {
        max-height: none;
        max-width: 100%;
      }
    }
  }
}
::v-deep .image-list-container .image-list-item {
  height: 50px;
  width: 50px;
}
</style>
