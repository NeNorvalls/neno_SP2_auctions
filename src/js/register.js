const loginLink = document.getElementById("login-link");

const logoutLink = document.getElementById("logout-link");

const profileLink = document.getElementById("profile-link");

const usersLink = document.getElementById("users-link");

const registerForm = document.getElementById("registerForm");

// =========================================== Checking if user is logged in ===============
function isUserLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    logoutLink.style.display = "none";
    profileLink.style.display = "none";
    usersLink.style.display = "none";
  } else {
    loginLink.style.display = "none";
  }
}

isUserLoggedIn();

// =============== Get elements ================
const usernameInput = document.querySelector("input#registerUsername");

const emailInput = document.querySelector("input#registerEmail");

const passwordInput = document.querySelector("input#registerPassword");

const avatarInput = document.querySelector("input#registerAvatar");

const submitButton = document.querySelector("button#registerSubmit");

// Register user

// ================================================= API endpoints ====================
const API = "https://api.noroff.dev/api/v1";

const registerEndpoint = "/auction/auth/register";

const registerUrl = `${API}${registerEndpoint}`;

// ====================================== functionality of register submit button ==============
submitButton.addEventListener("click", registerSubmitFunction);

function registerSubmitFunction(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();

  const email = emailInput.value.trim();

  const password = passwordInput.value.trim();

  const avatar = avatarInput.value.trim();

  const newUserData = {
    name: username,
    email: email,
    password: password,
    avatar: avatar
  };
  registerNewUser(registerUrl, newUserData);
}

async function registerNewUser(url, data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    console.log(url, data, options);

    const response = await fetch(url, options);

    console.log(response);

    const reply = await response.json();

    console.log(reply);

    if (response.status === 201) {
      window.location = "/profile/login";
    } else if (reply.message === "Profile already exists, try to login!") {
      errorMessage.innerHTML = reply.message;
    }
  } catch (error) {
    console.log(error);
  }
}

// ==================================================== Get error message containers =================
const usernameError = document.querySelector("#usernameError");

const emailError = document.querySelector("#emailError");

const passwordError = document.querySelector("#passwordError");

const avatarError = document.querySelector("#avatarError");

// ================================================================ Validate form ==========
submitButton.addEventListener("click", validateForm);

function validateForm() {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const avatar = avatarInput.value.trim();

  usernameError.innerHTML = "";
  const submittedName = username.trim();

  if (submittedName.length < 2) {
    usernameError.innerHTML += "Username must be at least 2 characters long";
  }

  emailError.innerHTML = "";
  const submittedEmail = email.trim();
  let emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegEx.test(submittedEmail)) {
    emailError.innerHTML +=
      "Please enter a valid email with only characters, number, dot and underscore";
  }

  // ======================================================  Validate @noroff.no / @stud.noroff.no =============
  if (
    !(
      submittedEmail.includes("@gmail.com") ||
      submittedEmail.includes("@noroff.no")
    )
  ) {
    emailError.innerHTML += "Email must include @stud.noroff.no or @noroff.no";
  }

  passwordError.innerHTML = "";

  const submittedPassword = password;

  if (submittedPassword.length < 8) {
    passwordError.innerHTML +=
      "The password must be at least 8 characters long";
  }

  const submittedAvatar = avatar;

  avatarError.innerHTML = "";
  let avatarRegEx = /\.(jpeg|jpg|gif|png|svg)$/;
  if (!avatarRegEx.test(submittedAvatar)) {
    avatarError.innerHTML = "Invalid image URL";
  }

  if (submittedAvatar === "") {
    avatarInput.innerHTML = "/images/—Pngtree—elephant avatar_3194470.png";
  }

  if (
    usernameError.innerHTML === "" &&
    emailError.innerHTML === "" &&
    passwordError.innerHTML === ""
  ) {
    form.submit();
  } else {
    console.log("You have one or more errors!");
  }
}
