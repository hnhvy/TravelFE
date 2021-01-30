<template>
  <div class="bg-auth vh-100">
    <b-container class="h-100">
      <b-row class="h-100">
        <b-col md="10" class="m-auto">
          <b-card class="d-flex flex-row auth-card border-0" no-body>
            <div class="position-relative image-side text-white">
              <p class="h2">MAGIC IS IN THE DETAILS</p>
              <p>
                Please use your credentials to login. <br />If you are not a
                member, please register.
              </p>
            </div>
            <div class="form-side">
              <nuxt />
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss" scoped>
.bg-auth {
  background: url('~assets/img/balloon.jpg') no-repeat center fixed;
  background-size: cover;
}

.auth-card {
  border-radius: $border-radius-rounded;
  height: 500px;
  .image-side {
    width: 40%;
    background: url('~assets/img/login-balloon.jpg') no-repeat center top;
    background-size: cover;
    padding: 80px 40px;
    border-top-left-radius: $border-radius-rounded;
    border-bottom-left-radius: $border-radius-rounded;

    .h3 {
      line-height: 0.8rem;
    }
  }

  .form-side {
    width: 60%;
    padding: 80px;
  }
}
</style>
