<template>
  <validation-observer v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(() => submitFormAdd(form))">
      <b-form-group v-if="provider.id" label="Provider ID" class="mb-7">
        <b-form-input v-model="provider.id" readonly />
      </b-form-group>
      <b-form-group v-if="customer.id" label="Customer ID" class="mb-7">
        <b-form-input v-model="customer.id" readonly />
      </b-form-group>
      <validation-provider
        v-slot="validationContext"
        name="Bank Account"
        :rules="{ required: true }"
      >
        <b-form-group label="Bank Account" class="mb-7">
          <b-form-input
            v-model="form.bankAccount"
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

      <validation-provider
        v-slot="validationContext"
        name="Bank Name"
        :rules="{ required: true }"
      >
        <b-form-group :label="`Bank Name`">
          <b-form-input
            v-model="form.bankName"
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
      <validation-provider
        v-slot="validationContext"
        name="Bank Number"
        :rules="{ required: true }"
      >
        <b-form-group :label="`Bank Number`">
          <b-form-input
            v-model="form.bankNumber"
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
export default {
  props: {
    provider: {
      type: Object,
      default: () => {
        return {
          id: null,
        }
      },
    },
    customer: {
      type: Object,
      default: () => {
        return {
          id: null,
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
        note: '',
        bankAccount: '',
        bankName: '',
        bankNumber: '',
        customerId: this.customer?.id ?? null,
        providerId: this.provider?.id ?? null,
      },
    }
  },
  methods: {
    submitFormAdd(event, form) {
      this.$emit('submit-form-add', event, form)
    },
    hideModal(event) {
      this.$emit('hide-modal', event)
    },
  },
}
</script>
