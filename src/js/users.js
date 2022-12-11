const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");
const profileLink = document.getElementById("profile-link");
const usersLink = document.getElementById("users-link");

// ===============CHECKING IF USERS LOGGED_IN=======================
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

// ======================== Endpoints ==========================

const API_baseURL = " https://api.noroff.dev/api/v1";
const auctionEndpoint = "/auction/profiles"; // POST

const usersURL = `${API_baseURL}${auctionEndpoint}`;

let usersLists = [];

async function getAllUsers(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);

    const users = await response.json();

    usersLists = users;
    console.log("userLists:", usersLists);
    listData(users, results);
  } catch (error) {
    console.log(error);
  }
}

getAllUsers(usersURL);

const results = document.getElementById("container-for-usersList");

// ================== USERLISTS =================
function listData(list, results) {
  results.innerHTML = "";
  let newDivs = "";

  for (let user of list) {
    const profileAvatar =
      user.avatar === "" || user.avatar === null
        ? ["/images/—Pngtree—elephant avatar_3194470.png"]
        : user.avatar;

    newDivs += `
        <div class="col-lg-4 col-md-6 mb-5 mb-lg-5 border-5 border-dark">
        <div class="border text-center">
            <img src="${profileAvatar}" alt="profileAvatar" class="img-fluid">
            <div class="bg-dark text-white border-dark">
                <h2>${user.name}</h2>
                <span class="position mb-3 d-block">Credits: ${user.credits}</span>
            </div>
        </div>
    </div>`;
  }
  results.innerHTML = newDivs;

  //   ================ SEARCH FILTER =======================
  const inputField = document.getElementById("search-to-filter-users");

  inputField.addEventListener("keyup", filterUsers);

  function filterUsers() {
    const filterUsers = inputField.value.toLowerCase();

    const filtered = usersLists.filter((user) => {
      const author = user.name.toLowerCase();
      if (author.indexOf(filterUsers) > -1) return true;
      return false;
    });

    listData(filtered, results);
  }
}

// ________________ NENORVALLS _____________________
