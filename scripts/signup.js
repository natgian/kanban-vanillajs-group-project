const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

const signupbutton = document.getElementById("signupbutton");
const checkbox = document.getElementById("checkbox");
const passwordError = document.getElementById("passwordError");
const accountError = document.getElementById("accountError");
const form = document.querySelector("form");

function init() {
  updateSignupState();
}

function updateSignupState() {
  signupbutton.disabled = !checkbox.checked;
}

function formAndPasswordIf(password, confirmpassword) {
  const confirmInput = document.getElementById('confirmpassword');

  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  if (password !== confirmpassword) {
    passwordError.classList.remove("d-none");
    confirmInput.classList.add('red-border');
    console.log(confirmInput.classList)
    return false;
  } else {
    passwordError.classList.add("d-none");
  }

  return true;
}

async function checkIfEmailExists(email) {
  try {
    let response = await fetch(databasURL + ".json");
    let responseJSON = await response.json();

    for (let id in responseJSON) {
      const user = responseJSON[id];
      if (user.email === email) {
        return id;
      }
    }
    return null;
  } catch (error) {
    console.error("Fehler bei der Datenbankabfrage:", error);
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später noch einmal.");
    return null;
  }
}

async function saveUserData(data) {
  try {
    await fetch(databasURL + "users.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Fehler bei der Datenbankabfrage:", error);
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später noch einmal.");
  }
}

async function postData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmpassword").value;

  if (!formAndPasswordIf(password, confirmpassword)) {
    return;
  }

  const existingID = await checkIfEmailExists(email);

  if (existingID !== null) {
    accountError.classList.remove("d-none");
    return;
  } else {
    accountError.classList.add("d-none");
    const data = {
      name: name,
      email: email,
      password: password,
      acceptedPolicy: checkbox.checked,
    };

    await saveUserData(data);
    localStorage.setItem("currentUser", name);
  }
  window.location.href = "summary.html";
  form.reset();
}

function backToLogin() {
  window.location.href = "/index.html";
}
