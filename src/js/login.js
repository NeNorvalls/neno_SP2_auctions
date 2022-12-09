const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");
const profileLink = document.getElementById("profile-link");
const usersLink = document.getElementById("users-link");
const loginForm = document.getElementById("loginForm");
const errorMessage = document.querySelector("#errorMessage");

// ================= check if user is logged in =======================
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

// =========== Get elements ==============
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const submitButton = document.getElementById("loginSubmit");

// =========== Validate form ==================
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");

submitButton.addEventListener("click", validateForm);
function validateForm() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const submittedEmail = email;
  let emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegEx.test(submittedEmail)) {
    emailError.innerHTML += "Please enter a valid email";
  }

  passwordError.innerHTML = "";
  const submittedPassword = password;
  if (submittedPassword.length < 8) {
    passwordError.innerHTML +=
      "The password must be at least 8 characters long";
  }

  if (emailError.innerHTML === "" && passwordError.innerHTML === "") {
    // loginForm.submit();
  } else {
    console.log("You have one or more errors!");
  }
}

// ================ Login user functionality ====================

// Endpoints
const API = "https://api.noroff.dev/api/v1";
const loginEndpoint = "/auction/auth/login";

const loginUrl = `${API}${loginEndpoint}`;

submitButton.addEventListener("click", loginSubmitFunction);

function loginSubmitFunction(event) {
  event.preventDefault();

  /**
   *  @param {string} url URL to API endpoint
   *  @param {object} data Object with the data for new user */

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const loginData = {
    email: email,
    password: password,
  };

  loginUser(loginUrl, loginData);
}

async function loginUser(url, data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    console.log(url, data, options);

    const response = await fetch(url, options);
    console.log(response);
    const reply = await response.json();
    console.log(reply);

    if (response.status === 200) {
      localStorage.setItem("username", reply.name);
      localStorage.setItem("accessToken", reply.accessToken);
      window.location = "/index.html";
    } else if (
      reply.message === "This user doesn't exist. Please register an account"
    ) {
      errorMessage.innerHTML = answer.message;
    }
  } catch (error) {
    console.warn(error);
  }
}

// _______________________________ NENORVALLS ____________________________
