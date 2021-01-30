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
            v-model="form.fullName"
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
      <b-form-group :label="`Role`">
        <b-form-select v-model="form.roleId" class="mb-3">
          <b-form-select-option
            v-for="(role, index) in roles"
            :id="role.id"
            :key="index"
            :value="role.id"
            >{{ role.name }}</b-form-select-option
          >
        </b-form-select>
      </b-form-group>
      <b-form-group :label="`Gender`">
        <v-select v-model="form.gender" :options="genderChoice" />
      </b-form-group>
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
      <b-form-group :label="`Bio`">
        <b-form-input v-model="form.bio" />
      </b-form-group>
      <b-form-group :label="`Note`">
        <b-form-input v-model="form.note" />
      </b-form-group>
      <b-form-group :label="`Status`">
        <b-form-radio-group
          v-model="form.status"
          stacked
          class="pt-2"
          :options="statuses"
        />
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
    roles: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          fullName: '',
          email: '',
          status: '',
          gender: '',
          avatar: '',
          birthday: '',
          roleId: 0,
          phone: '',
          bio: '',
          note: '',
          password: '',
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
        id: this.user.id,
        fullName: this.user.fullName,
        email: this.user.email,
        status: this.user.status,
        gender: this.user.gender,
        birthday: this.user.birthday,
        roleId: this.user.role.id ?? null,
        avatar: this.user.avatar,
        phone: this.user.phone,
        bio: this.user.bio,
        note: this.user.note,
        password: this.user.password,
      },
      moment,
      value: '',
      genderChoice: ['MALE', 'FEMALE'],
      statuses: ['ACTIVE', 'PENDING', 'INACTIVE'],
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
