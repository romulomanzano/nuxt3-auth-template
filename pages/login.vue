<template>
  <div>
    <v-layout>
      <v-main>
        <v-container fluid fill-height>
          <v-row>
            <v-col align="center">
              <notifications group="auth" position="top" />
              <v-col xs="12" sm="12" md="5">
                <v-card class="elevation-12">
                  <v-toolbar dark color="primary">
                    <v-tabs left v-model="tab">
                      <v-tab
                        class="text-uppercase font-weight-medium text-subtitle-1"
                      >
                        {{
                          resetPasswordMode === true
                            ? "Reset Password"
                            : newPasswordMode
                            ? providerInvite
                              ? "Set Password"
                              : "Change Password"
                            : "Login"
                        }}
                      </v-tab>
                      <v-tab
                        v-if="!newPasswordMode"
                        class="text-uppercase font-weight-medium text-subtitle-1"
                        :disabled="providerInvite"
                      >
                        Register
                      </v-tab>
                    </v-tabs>
                  </v-toolbar>
                  <v-card-text>
                    <v-window v-model="tab">
                      <v-window-item>
                        <v-form>
                          <v-text-field
                            v-model="email"
                            :error-messages="invalidEmail"
                            label="Email"
                            required
                            :disabled="newPasswordMode"
                            @blur="v$.email.$touch()"
                          ></v-text-field>
                          <v-text-field
                            v-if="!resetPasswordMode"
                            v-model="password"
                            :error-messages="invalidNewPassword"
                            label="Password"
                            required
                            type="password"
                            @blur="v$.password.$touch()"
                          ></v-text-field>
                          <v-text-field
                            v-if="newPasswordMode"
                            v-model="passwordConfirmation"
                            :error-messages="invalidNewPasswordConfirmation"
                            label="Confirm Password"
                            required
                            type="password"
                            @blur="v$.passwordConfirmation.$touch()"
                          ></v-text-field>

                          <v-btn class="mr-4 mb-2 mt-2" @click="clearForm">
                            Clear
                          </v-btn>
                          <v-btn
                            v-if="!resetPasswordMode && !newPasswordMode"
                            class="mb-2 mt-2"
                            :disabled="!isValidForm"
                            @click="submitLogin()"
                          >
                            Submit
                          </v-btn>
                          <v-btn
                            v-if="newPasswordMode"
                            class="mb-2 mt-2"
                            :disabled="!isValidForm"
                            @click="submitNewPassword()"
                          >
                            Submit
                          </v-btn>
                          <v-btn
                            v-if="resetPasswordMode"
                            class="mb-2 mt-2"
                            :disabled="!isResetModeFormValid"
                            @click="submitResetPassword()"
                          >
                            Reset
                          </v-btn>
                        </v-form>
                      </v-window-item>
                      <v-window-item>
                        <v-form>
                          <v-text-field
                            v-model="email"
                            :error-messages="invalidEmail"
                            label="Email"
                            required
                            @blur="v$.email.$touch()"
                          ></v-text-field>
                          <v-text-field
                            v-model="password"
                            :error-messages="invalidNewPassword"
                            label="Password"
                            required
                            type="password"
                            @blur="v$.password.$touch()"
                          ></v-text-field>
                          <v-text-field
                            v-model="passwordConfirmation"
                            :error-messages="invalidNewPasswordConfirmation"
                            label="Confirm Password"
                            required
                            type="password"
                            @blur="v$.passwordConfirmation.$touch()"
                          ></v-text-field>
                          <v-btn class="mr-4 mb-2 mt-2" @click="clearForm">
                            Clear
                          </v-btn>
                          <v-btn
                            class="mb-2 mt-2"
                            :disabled="!isValidForm"
                            @click="submitRegister()"
                          >
                            Submit
                          </v-btn>
                        </v-form>
                      </v-window-item>
                      <v-window-item>
                        <v-form>
                          <v-text-field
                            v-model="email"
                            :error-messages="invalidEmail"
                            label="Email"
                            required
                            @blur="v$.email.$touch()"
                          ></v-text-field>
                          <v-btn class="mr-4 mb-2 mt-2" @click="clearForm">
                            Clear
                          </v-btn>
                          <v-btn
                            class="mb-2 mt-2"
                            :disabled="!isValidForm"
                            @click="submitRegister()"
                          >
                            Submit
                          </v-btn>
                        </v-form>
                      </v-window-item>
                    </v-window>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      v-if="tab === 0 && !newPasswordMode && !resetPasswordMode"
                      text
                      color="teal accent-4"
                      @click="setResetPasswordMode()"
                    >
                      Reset Password
                    </v-btn>
                    <v-btn
                      v-if="tab === 0 && resetPasswordMode"
                      text
                      color="teal accent-4"
                      @click="exitResetPasswordMode()"
                    >
                      Login
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </div>
</template>
<script>
import { email, required, minLength, sameAs } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  layout: "login",
  name: "login",
  data: () => ({
    tab: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    resetPasswordMode: false,
    newPasswordMode: false,
    newPasswordToken: null,
    providerInvite: false,
  }),
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
    passwordConfirmation: {
      sameAs: sameAs("password"),
    },
  },
  computed: {
    isValidForm() {
      return (
        !this.v$.email.$invalid &&
        !this.v$.password.$invalid &&
        ((this.tab === 0 && !this.newPasswordMode) ||
          !this.v$.passwordConfirmation.$invalid)
      );
    },
    isResetModeFormValid() {
      return !this.v$.email.$invalid;
    },
    invalidEmail() {
      if (this.v$.email.$error) {
        return "Invalid Email";
      }
      return "";
    },
    invalidPassword() {
      if (this.v$.password.$error) {
        return "Password must contain at least 8 characters";
      }
      return "";
    },
    invalidNewPassword() {
      if (this.v$.password.$error) {
        return "Password must contain at least 8 characters";
      }
      return "";
    },
    invalidNewPasswordConfirmation() {
      if (this.v$.passwordConfirmation.$error) {
        return "Passwords must match";
      }
      return "";
    },
  },
  methods: {
    exitResetPasswordMode() {
      this.resetPasswordMode = false;
      this.tab = 0;
      this.clearForm();
    },
    setResetPasswordMode() {
      this.resetPasswordMode = true;
      this.tab = 0;
      this.clearForm();
    },
    clearForm() {
      this.v$.$reset();
      this.email = null;
      this.password = null;
      this.passwordConfirmation = null;
    },
    async submitLogin() {
      if (this.isValidForm) {
        try {
          await this.$auth.loginWith("local", {
            data: { email: email, password: password },
          });
        } catch (error) {
          $notify({
            type: "error",
            text: error.response.data.message,
            group: "auth",
          });
          this.clearForm();
        }
      }
    },
    async submitRegister() {
      if (this.isValidForm) {
        $fetch("/users/register", {
            email: this.email,
            password: this.password,
          })
          .then((res) => {
            $notify({
              type: "success",
              text: res.data.message,
              group: "auth",
            });
            this.submitLogin();
          })
          .catch((error) => {
            $notify({
              type: "error",
              text: error.response.data.message,
              group: "auth",
            });
            this.clearForm();
          });
      }
    },
    submitResetPassword() {
      $fetch("/users/forgot_password", {
          email: this.email,
        })
        .then((res) => {
          $notify({
            type: "success",
            text: res.data.message,
            group: "auth",
          });
          this.exitResetPasswordMode();
        })
        .catch((error) => {
          $notify({
            type: "error",
            text: error.response.data.message,
            group: "auth",
          });
        });
    },
    submitNewPassword() {
      let data = {
        resetToken: this.newPasswordToken,
        password: this.password,
        email: this.email,
      };
      $fetch("/users/new_password", data)
        .then((res) => {
          $notify({
            type: "success",
            text: res.data.message,
            group: "auth",
          });
          this.newPasswordMode = false;
          this.submitLogin();
        })
        .catch((error) => {
          $notify({
            type: "error",
            text: error.response.data.message,
            group: "auth",
          });
        });
    },
    resetPasswordDetails(token) {
      $fetch("/users/reset_password/" + token, {})
        .then((res) => {
          this.newPasswordToken = token;
          this.newPasswordMode = true;
          this.clearForm();
          this.email = res.data?.data.user.email;
          this.$router.push("login");
        })
        .catch((error) => {
          $notify({
            type: "error",
            text: error.response.data.message,
            group: "auth",
          });
          $router.push("login");
        });
    },
  },
  mounted() {
    if (this.$route.query.providerInvite === "true") {
      this.providerInvite = true;
    }
    if (this.$route.query.resetPassword) {
      this.resetPasswordDetails(this.$route.query.resetPassword);
    }
  },
};
</script>
