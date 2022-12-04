const loginLink = document.getElementById("logged-in");
const logoutLink = document.getElementById("logged-out");
// Check if user is logged in
function isLoggedIn() {
  const accessToken = localStorage.getItem("token");
  if (!accessToken) {
    logoutLink.style.display = "none";
  } else if (accessToken) {
    loginLink.style.display = "none";
  }
}

isLoggedIn();

// Logging out the user
const logOut = document.getElementById("logged-out");
// console.log(logout);

logOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
  window.location = "/index.html";
});
