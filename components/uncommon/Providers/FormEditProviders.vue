<template>
  <validation-observer v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(() => submitFormEdit(form))">
      <validation-provider
        v-slot="validationContext"
        name="Full name"
        :rules="{ required: true }"
      >
        <b-form-group label="Full Name" class="mb-7">
          <b-form-input
            v-model="form.name"
            :state="
              validationContext.errors[0]
                ? false
                : validationContext.valid
                ? true
                : null"
          />
          <b-form-invalid-feedback>{{
            validationContext.errors[0]
          }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
      <validation-provider
        v-slot="validationContext"
        name="E-mail"
        :rules="{ required: true, email: true }"
      >
        <b-form-group :label="`Email`">
          <b-form-input
            v-model="form.email"
            :state="
              validationContext.errors[0]
                ? false
                : validationContext.valid
                ? true
                : null"
          />
          <b-form-invalid-feedback>{{
            validationContext.errors[0]
          }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
      <b-form-group :label="`Gender`">
        <v-select v-model="form.gender" :options="genderChoice" />
      </b-form-group>
      <validation-provider
        v-slot="validationContext"
        name="Avatar"
        :rules="{ required: true }"
      >
        <b-form-group :label="`Avatar`">
          <b-form-file
            v-model="file"
            :state="
              validationContext.errors[0]
              ? false
              : validationContext.valid
              ? true
              : null"
              accept="image/*"
              @change="handleChange"
          ></b-form-file>
        </b-form-group>
      <b-form-invalid-feedback>{{
        validationContext.errors[0]
    }}</b-form-invalid-feedback>
      </validation-provider>
      <validation-provider
        v-slot="validationContext"
        name="Birthday"
        :rules="{ required: true }"
      >
        <b-form-group :label="`Birthday`">
          <b-form-datepicker
            v-model="value"
            :state="
              validationContext.errors[0]
                ? false
                : validationContext.valid
                ? true
                : null"
            class="mb-2"
            @context="onContext"
          ></b-form-datepicker>
          <b-form-invalid-feedback>{{
            validationContext.errors[0]
          }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
      <b-form-group :label="`Phone number`">
        <b-form-input v-model="form.phone" />
      </b-form-group>
      <b-form-group :label="`Note`">
        <b-form-input v-model="form.note" />
      </b-form-group>
      <div class="float-right mt-5">
        <b-button type="submit" size="lg" variant="main-color">
          <span class="label">SUBMIT</span>
        </b-button>
        <div class="float-left mr-2">
          <b-button size="lg" variant="danger" @click="hideModal()">
            <span class="label">CANCEL</span>
          </b-button>
        </div>
      </div>
    </b-form>
  </validation-observer>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    provider: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          email: '',
          gender: '',
          birthday: '',
          phone: '',
          note: '',
          avatar: '',
        }
      },
    },
    processing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        id: this.provider.id,
        name: this.provider.name,
        email: this.provider.email,
        gender: this.provider.gender,
        birthday: this.provider.birthday,
        phone: this.provider.phone,
        note: this.provider.note,
        avatar: this.provider.avatar,
      },
      moment,
      value: '',
      genderChoice: ['MALE', 'FEMALE'],
      file: null,
      imageUrl: '',
    }
  },
  methods: {
    submitFormEdit(event, form) {
      this.$emit('submit-form-edit', event, form)
    },
    hideModal(event) {
      this.$emit('hide-modal', event)
    },
    onContext(ctx) {
      this.form.birthday = moment(ctx.selectedYMD, moment.ISO_8601)
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
          this.form.avatar = imageUrl
        })
      }
    },
  },
}
</script>
