<template>
  <div>
    <validation-observer v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(() => submitFormEdit(form))">
        <b-form-group label="Avatar" class="mb-7">
          <b-form-file
            v-model="file"
            accept="image/*"
            @change="handleChange"
          ></b-form-file>
        </b-form-group>
        <div class="text-center">
          <b-img v-if="imageUrl" thumbnail fluid :src="imageUrl" class="my-4" />
        </div>
        <validation-provider
          v-slot="validationContext"
          name="Name"
          :rules="{ required: true }"
        >
          <b-form-group label="Full name" class="mb-7">
            <b-form-input
              v-model.trim="form.fullName"
              :state="getValidationState(validationContext)"
            />
            <b-form-invalid-feedback>{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <b-row>
          <b-col
            ><validation-provider
              v-slot="validationContext"
              name="Birthday"
              :rules="{ required: true }"
            >
              <b-form-group label="Birthday" class="mb-7">
                <b-form-datepicker
                  v-model="form.birthday"
                  :state="getValidationState(validationContext)"
                  :max="maxDate"
                  locale="en"
                ></b-form-datepicker>
                <b-form-invalid-feedback>{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider></b-col
          ><b-col>
            <b-form-group label="Gender">
              <b-form-radio-group v-model="form.gender">
                <b-form-radio value="Male">Male</b-form-radio>
                <b-form-radio value="Female">Female</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
        <validation-provider
          v-slot="validationContext"
          name="Email"
          :rules="{ required: true }"
        >
          <b-form-group label="Email" class="mb-7">
            <b-form-input
              v-model.trim="form.email"
              :state="getValidationState(validationContext)"
            />
            <b-form-invalid-feedback>{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <validation-provider
          v-slot="validationContext"
          name="Phone"
          :rules="{ required: true }"
        >
          <b-form-group label="Phone" class="mb-7">
            <b-form-input
              v-model.number="form.phone"
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
        <div class="float-right">
          <b-button
            type="submit"
            size="lg"
            :class="{
              'btn-multiple-state btn-shadow': true,
              'show-spinner': processing,
            }"
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
export default {
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: 'Create',
    },
  },
  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return {
      maxDate: new Date(today),
      imageUrl: '',
      file: null,
      form: {
        fullName: '',
        email: '',
        birthday: '',
        gender: 'Male',
        phone: '',
      },
    }
  },
  mounted() {
    console.log(this.form.birthday)
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
  },
}
</script>
