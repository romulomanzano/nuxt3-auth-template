<template>
  <div>
    <v-container fluid fill-height>
      <v-row>
        <v-col>
          <notifications group="auth" position="center" />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-col xs="12" sm="12" md="5" align="left">
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-tabs left v-model="state.tab">
                  <v-tab
                    class="text-uppercase font-weight-medium text-subtitle-1"
                  >
                    {{
                      state.resetPasswordMode === true
                        ? "Reset Password"
                        : state.newPasswordMode
                        ? state.providerInvite
                          ? "Set Password"
                          : "Change Password"
                        : "Login"
                    }}
                  </v-tab>
                  <v-tab
                    v-if="!state.newPasswordMode"
                    class="text-uppercase font-weight-medium text-subtitle-1"
                    :disabled="state.providerInvite"
                  >
                    Register
                  </v-tab>
                </v-tabs>
              </v-toolbar>
              <v-card-text>
                <v-window v-model="state.tab">
                  <v-window-item>
                    <v-form>
                      <v-text-field
                        v-model="state.email"
                        :error-messages="invalidEmail"
                        label="Email"
                        :disabled="state.newPasswordMode"
                        @blur="v$.email.$touch()"
                      ></v-text-field>
                      <v-text-field
                        v-if="!state.resetPasswordMode"
                        v-model="state.password"
                        :error-messages="invalidNewPassword"
                        label="Password"
                        type="password"
                        @blur="v$.password.$touch()"
                      ></v-text-field>
                      <v-text-field
                        v-if="state.newPasswordMode"
                        v-model="state.passwordConfirmation"
                        :error-messages="invalidNewPasswordConfirmation"
                        label="Confirm Password"
                        type="password"
                        @blur="v$.passwordConfirmation.$touch()"
                      ></v-text-field>

                      <v-btn class="mr-4 mb-2 mt-2" @click="clearForm">
                        Clear
                      </v-btn>
                      <v-btn
                        v-if="
                          !state.resetPasswordMode && !state.newPasswordMode
                        "
                        class="mb-2 mt-2"
                        :disabled="!isValidForm"
                        @click="submitLogin()"
                      >
                        Submit
                      </v-btn>
                      <v-btn
                        v-if="state.newPasswordMode"
                        class="mb-2 mt-2"
                        :disabled="!isValidForm"
                        @click="submitNewPassword()"
                      >
                        Submit
                      </v-btn>
                      <v-btn
                        v-if="state.resetPasswordMode"
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
                        v-model="state.email"
                        :error-messages="invalidEmail"
                        label="Email"
                        @blur="v$.email.$touch()"
                      ></v-text-field>
                      <v-text-field
                        v-model="state.password"
                        :error-messages="invalidNewPassword"
                        label="Password"
                        type="password"
                        @blur="v$.password.$touch()"
                      ></v-text-field>
                      <v-text-field
                        v-model="state.passwordConfirmation"
                        :error-messages="invalidNewPasswordConfirmation"
                        label="Confirm Password"
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
                        v-model="state.email"
                        :error-messages="invalidEmail"
                        label="Email"
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
                  v-if="
                    state.tab === 0 &&
                    !state.newPasswordMode &&
                    !state.resetPasswordMode
                  "
                  text
                  color="teal accent-4"
                  @click="setResetPasswordMode()"
                >
                  Reset Password
                </v-btn>
                <v-btn
                  v-if="state.tab === 0 && state.resetPasswordMode"
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
  </div>
</template>
<script setup>
definePageMeta({
  layout: "login",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

import { email, required, minLength, sameAs } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useNotification } from "@kyvg/vue3-notification";

const state = reactive({
  tab: 0,
  email: null,
  password: null,
  passwordConfirmation: null,
  resetPasswordMode: null,
  newPasswordMode: null,
  newPasswordToken: null,
  providerInvite: null,
});
//validations
const validations = {
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
};
//composables
const v$ = useVuelidate(validations, state);
const $router = useRouter();
const $route = useRoute();
const notification = useNotification();
const $auth = useAuth();
const $config = useRuntimeConfig();

const exitResetPasswordMode = function () {
  state.resetPasswordMode = false;
  state.tab = 0;
  clearForm();
};
const setResetPasswordMode = function () {
  state.resetPasswordMode = true;
  state.tab = 0;
  clearForm();
};

const clearForm = function () {
  v$.value.$reset();
  state.email = null;
  state.password = null;
  state.passwordConfirmation = null;
};

const submitLogin = function () {
  if (isValidForm) {
    $auth
      .signIn("local", {
        email: state.email,
        password: state.password,
        callbackUrl: "/",
      })
      .catch(function (error) {
        console.log(error);
        let response = JSON.parse(error.response._data);
        notification.notify({
          type: "error",
          text: response.message,
          group: "auth",
        });
      });
    clearForm();
  }
};

const submitRegister = async function () {
  if (isValidForm) {
    $fetch($config.public.apiBaseUrl + "/users/register", {
      method: "POST",
      body: {
        email: state.email,
        password: state.password,
      },
    })
      .then((res) => {
        notification.notify({
          type: "success",
          text: res.message,
          group: "auth",
        });
        submitLogin();
      })
      .catch((error) => {
        notification.notify({
          type: "error",
          text: error.response.message,
          group: "auth",
        });
        clearForm();
      });
  }
};

const submitResetPassword = function () {
  apiFetch("/users/forgot_password", {
    method: "POST",
    body: { email: state.email },
  })
    .then((res) => {
      notification.notify({
        type: "success",
        text: res.message,
        group: "auth",
      });
      exitResetPasswordMode();
    })
    .catch((error) => {
      notification.notify({
        type: "error",
        text: error.response.message,
        group: "auth",
      });
    });
};

const submitNewPassword = function () {
  let data = {
    resetToken: state.newPasswordToken,
    password: state.password,
    email: state.email,
  };
  apiFetch("/users/new_password", {
    method: "POST",
    body: data,
  })
    .then((res) => {
      notification.notify({
        type: "success",
        text: res.message,
        group: "auth",
      });
      state.newPasswordMode = false;
      submitLogin();
    })
    .catch((error) => {
      notification.notify({
        type: "error",
        text: error.response.message,
        group: "auth",
      });
    });
};
const resetPasswordDetails = function (token) {
  apiFetch("/users/reset_password/" + token, {
    method: "GET",
  })
    .then((res) => {
      state.newPasswordToken = token;
      state.newPasswordMode = true;
      clearForm();
      state.email = res.data.user?.email;
      $router.push("login");
    })
    .catch((error) => {
      notification.notify({
        type: "error",
        text: error.response.message,
        group: "auth",
      });
      $router.push("login");
    });
};

const isValidForm = computed(function () {
  return (
    !v$.value.email.$invalid &&
    !v$.value.password.$invalid &&
    ((state.tab === 0 && !state.newPasswordMode) ||
      !v$.value.passwordConfirmation.$invalid)
  );
});

const isResetModeFormValid = computed(function () {
  return !v$.value.email.$invalid;
});
const invalidEmail = computed(function () {
  if (v$.value.email.$error) {
    return "Invalid Email";
  }
  return "";
});
const invalidNewPassword = computed(function () {
  if (v$.value.password.$error) {
    return "Password must contain at least 8 characters";
  }
  return "";
});

const invalidNewPasswordConfirmation = computed(function () {
  if (v$.value.passwordConfirmation.$error) {
    return "Passwords must match";
  }
  return "";
});

onMounted(function () {
  if ($route.query.providerInvite === "true") {
    state.providerInvite = true;
  }
  if ($route.query.resetPassword) {
    resetPasswordDetails($route.query.resetPassword);
  }
});
</script>
