/**
 * Gets and trims the input values for name, email and phone number
 *
 * @returns - An object containing the input values
 */
function getInputValues() {
  const fullName = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  return { fullName, email, phone };
}

/**
 * Validates the name, email and phone number fields.
 * Displays or hides the validation messages.
 *
 * @param {string} name - The full name to validate
 * @param {string} email - The email to validate
 * @param {string} phone - The phone number to validate
 * @returns - "true" if all inputs are valids otherwise "false"
 */
function validateContact(name, email, phone) {
  let isValid = true;

  const nameIsValid = validateFullName(name);
  toggleValidationMessage(nameIsValid, "name-validation");
  if (!nameIsValid) isValid = false;

  const emailIsValid = validateEmail(email);
  toggleValidationMessage(emailIsValid, "email-validation");
  if (!emailIsValid) isValid = false;

  const phoneIsValid = validatePhone(phone);
  toggleValidationMessage(phoneIsValid, "phone-validation");
  if (!phoneIsValid) isValid = false;

  return isValid;
}

/**
 * Shows or hides the validation message
 *
 * @param {boolean} isValid - Is the input valid (true or false)
 * @param {string} elementId - The ID of the validation message element
 */
function toggleValidationMessage(isValid, elementId) {
  const validateElement = document.getElementById(elementId);
  validateElement.classList.toggle("d_none", isValid);
}

/**
 * Checks if the name is in a valid format
 *
 * @param {string} name - The full name to validate
 * @returns - "true" if the name is valid, otherwise "false"
 */
function validateFullName(name) {
  const fullNamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)+$/;
  return fullNamePattern.test(name.trim());
}

/**
 * Checks if the email is in a valid format
 *
 * @param {string} email - The email address
 * @returns - "true" if the email is valid, otherwise "false"
 */
function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email.trim());
}

/**
 * Checks if the phone number is in a valid format
 *
 * @param {string} phone - The phone number
 * @returns - "true" if the phone number is valid, otherwise "false"
 */
function validatePhone(phone) {
  const phonePattern = /^\+\d{6,15}$/;
  return phonePattern.test(phone.trim());
}

/**
 * Adds focus event listeners to the input fields.
 * Hides the validation message when the input is focused.
 *
 */
function initFocusHideValidation() {
  ["name", "email", "phone"].forEach((id) => {
    const input = document.getElementById(id);
    const validationElement = document.getElementById(`${id}-validation`);

    input.addEventListener("focus", () => {
      validationElement.classList.add("d_none");
    });
  });
}
