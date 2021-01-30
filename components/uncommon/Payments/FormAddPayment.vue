<template>
  <validation-observer v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(() => submitFormAdd(form))">
      <b-form-group label="Bill ID" class="mb-7">
        <b-form-input v-model="form.billId" readonly />
      </b-form-group>
      <validation-provider
        v-slot="validationContext"
        name="Type"
        :rules="{ required: true }"
      >
        <b-form-group label="Type" class="mb-7">
          <v-select v-model="form.type" :options="typeChoice" />
          <b-form-invalid-feedback>{{
            validationContext.errors[0]
          }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
        v-slot="validationContext"
        name="Bill's Info"
        :rules="{ required: true }"
      >
        <b-form-group label="Bill's Info" class="mb-7">
          <b-form-select
            v-if="form.type == 'GET_IN'"
            v-model="form.billInfoId"
            class="mb-3"
            :options="customer.billInfos"
            value-field="id"
            text-field="bankAccount"
          >
          </b-form-select>
          <b-form-select
            v-if="form.type == 'PAY_OUT' && provider"
            v-model="form.billInfoId"
            class="mb-3"
            :options="provider.billInfos"
            value-field="id"
            text-field="bankAccount"
          >
          </b-form-select>
          <b-form-invalid-feedback>{{
            validationContext.errors[0]
          }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
        v-slot="validationContext"
        name="Amount"
        :rules="{ required: true }"
      >
        <b-form-group :label="`Amount`">
          <b-form-input
            v-model="form.amount"
            :number="true"
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

      <b-form-group :label="`Description`">
        <b-form-input v-model="form.description" />
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
    bill: {
      type: Object,
      default: null,
    },
    customer: {
      type: Object,
      default: null,
    },
    service: {
      type: Object,
      default: null,
    },
    provider: {
      type: Object,
      default: null,
    },
    processing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        billId: this.bill?.id ?? 0,
        billInfoId: this.customer?.billInfos.id ?? 0,
        amount: 0,
        description: '',
        type: '',
      },
      typeChoice: ['GET_IN', 'PAY_OUT'],
    }
  },
  methods: {
    submitFormAdd(event, form) {
      this.$emit('submit-form-add', event, form)
    },
    hideModal(event) {
      this.$emit('hide-modal', event)
    },
    fetch(id) {
      this.$emit('fetch', id)
    },
  },
}
</script>
