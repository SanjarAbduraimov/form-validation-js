// Get the form and all its fields
const form = document.querySelector("form");
const firstNameField = form.firstName;
const lastNameField = form.lastName;
const passwordField = form.password;
const passwordRepeatField = form["confirm-password"];
const textareaField = form.message;
const submitBtn = form.querySelector("#submit-btn");

// function validateTextarea() {
//   const textareaValue = textareaInput.value.trim();

//   if (textareaValue === "") {
//     errorTextarea.textContent = "Textarea is required";
//     return false;
//   } else if (textareaValue.length < 100) {
//     errorTextarea.textContent = "Textarea must be at least 100 characters long";
//     return false;
//   } else {
//     errorTextarea.textContent = "";
//     return true;
//   }
// }

class FormValidator {
  constructor(form) {
    this.form = form;
  }

  initialize() {
    this.validateOnEntry();
    this.validateOnSubmit();
    this.togglePasswordVisibility();
    this.textareaIndicator();
    this.submitBtnHandler();
  }
  validateOnSubmit() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.form.checkValidity()) {
        e.stopPropagation();
        this.form.querySelectorAll("[name]").forEach((input) => {
          this.validateFields(input);
        });
      }
      let formData = new FormData(this.form);
      alert(Array.from(formData));
      this.form.reset();
    });
  }
  togglePasswordVisibility() {
    let self = this;
    this.form.querySelectorAll(".password-toggle").forEach((btn) => {
      btn.addEventListener("mousedown", (event) => {
        event.preventDefault();
        self.setVisibility(btn);
      });
    });
  }
  submitBtnHandler() {
    let submitBtn = this.form.querySelector("[type='submit']");
    if (this.form.checkValidity()) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }
  validateOnEntry() {
    let self = this;
    this.form.querySelectorAll("[name]").forEach((input) => {
      input.addEventListener("input", (event) => {
        self.validateFields(input);
        this.submitBtnHandler();
      });

      input.addEventListener("focusout", (event) => {
        event.target.isFocusedBefore = true;
        self.validateFields(input);
      });
    });
  }
  textareaIndicator() {
    this.form.querySelectorAll("textarea").forEach((textarea) => {
      textarea.addEventListener("input", (event) => {
        var maxlength = textarea.maxLength;
        var length = textarea.value.length;
        var indicator = textarea.nextElementSibling;
        indicator.innerHTML = length + "/" + maxlength;
      });
    });
  }
  validatePasswordFields(field, passwordValue) {
    const symbolsRegex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const numbersRegex = /[0-9]/;
    const uppercaseRegex = /[A-Z]/;
    if (passwordValue.length < 8) {
      this.setStatus(
        field,
        "Password must be at least 8 characters long",
        "error"
      );
    } else if (!symbolsRegex.test(passwordValue)) {
      this.setStatus(field, "Password must contain at least 1 symbol", "error");
    } else if (!numbersRegex.test(passwordValue)) {
      this.setStatus(
        field,
        "Password must contain at least 2 numbers",
        "error"
      );
    } else if (!uppercaseRegex.test(passwordValue)) {
      this.setStatus(
        field,
        "Password must contain at least 1 uppercase letter",
        "error"
      );
    } else {
      this.setStatus(field, null, "success");
    }
  }
  hasContainer(field) {
    return field.parentElement.getAttribute("class").includes("container");
  }
  getLabel(field) {
    return this.hasContainer(field)
      ? field.parentElement.previousElementSibling.innerText
      : field.previousElementSibling.innerText;
  }
  validateFields(field) {
    // Check presence of values
    let isPasswordField =
      field.id === "password" || field.id === "confirm-password";
    if (field.value.trim() === "" && field.required) {
      let label = this.getLabel(field);
      this.setStatus(field, `${label} is required`, "error");
      field.isFocusedBefore = true;
      return;
    } else {
      this.setStatus(field, null, "success");
    }
    if (!field.isFocusedBefore && !isPasswordField) {
      return;
    }
    // check for a valid email address
    if (field.type === "email") {
      const re = /\S+@\S+\.\S+/;
      if (re.test(field.value)) {
        this.setStatus(field, null, "success");
      } else {
        this.setStatus(field, "Please enter valid email address", "error");
      }
    }

    if (field.id === "password") {
      const passwordValue = field.value.trim();
      const confirmPasswordField = this.form.querySelector("#confirm-password");
      const confirmPasswordValue = confirmPasswordField.value.trim();

      if (confirmPasswordValue.length > 0) {
        this.setStatus(
          confirmPasswordField,
          "Password does not match",
          "error"
        );
      }
      if (field.value == confirmPasswordValue) {
        this.setStatus(confirmPasswordField, null, "success");
      }
      this.validatePasswordFields(field, passwordValue);
    }

    // Password confirmation edge case
    if (field.id === "confirm-password") {
      const passwordField = this.form.querySelector("#password");
      if (field.value != passwordField.value) {
        this.setStatus(field, "Password does not match", "error");
      }
    }

    if (field.id === "message") {
      // if (field.value.trim().length < 100) {
      //   this.setStatus(
      //     field,
      //     "Textarea must be at least 100 characters long",
      //     "error"
      //   );
      // } else {
      //   this.setStatus(field, null, "success");
      // }
    }
  }
  errorMessageField(field) {
    return this.hasContainer(field)
      ? field.parentElement.nextElementSibling
      : field.nextElementSibling;
  }
  setStatus(field, message, status) {
    const errorMessage = this.errorMessageField(field);
    const formWrapper = field.closest(".form__control--wrapper");
    if (status === "success") {
      if (errorMessage) {
        errorMessage.innerText = "";
      }
      errorMessage.classList.remove("show");
      formWrapper.classList.remove("invalid");
      field.setCustomValidity("");
      return true;
    }

    if (status === "error") {
      errorMessage.innerText = message;
      errorMessage.classList.add("show");
      formWrapper.classList.add("invalid");
      field.setCustomValidity(message);
      return false;
    }
  }
  setVisibility(element) {
    const target =
      element.tagName.toLowerCase() === "i" ? element.parentNode : element;
    const passwordInput = target.previousElementSibling;
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    passwordInput.focus();
    target.querySelector("i").classList.toggle("fa-eye");
    target.querySelector("i").classList.toggle("fa-eye-slash");
  }
}

const validator = new FormValidator(form);
validator.initialize();
