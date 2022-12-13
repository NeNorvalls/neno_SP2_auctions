const loginLink = document.getElementById("login-link");

const logoutLink = document.getElementById("logout-link");

const profileLink = document.getElementById("profile-link");

const usersLink = document.getElementById("users-link");

// =================  Check if user is logged in =================
function isLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    logoutLink.style.display = "none";
    profileLink.style.display = "none";
    usersLink.style.display = "none";
  } else if (accessToken) {
    loginLink.style.display = "none";
  }
}

isLoggedIn();

// =========== Logging out the user =============
const logOut = document.getElementById("logout-link");

logOut.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  window.location = "/index.html";
});
