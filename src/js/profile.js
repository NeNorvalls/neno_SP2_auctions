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

// ========================================

const username = localStorage.getItem("username");

// Endpoints
const API_URL = " https://api.noroff.dev/api/v1";
const profileEndpoint = `/auction/profiles/${username}?_listings=true`; // POST

const profileURL = `${API_URL}${profileEndpoint}`;
const updateAvatarURL = `${API_URL}/auction/profiles/${username}/media`;

let profileLists = [];
// ========
async function getProfileInfo(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);

    const profile = await response.json();
    profileLists = profile;

    listData(profileLists, results);
  } catch (error) {
    console.log(error);
  }
}

getProfileInfo(profileURL);

// ================= CREATE LISTING - INNER HTML =================

const results = document.getElementById("profile-container");

function listData(list, results) {
  results.innerHTML = "";
  const avatarImg = document.getElementById("profile-avatar");
  avatarImg.src = `${list.avatar}`;

  const listCredits = document.getElementById("profile-credits");
  listCredits.innerHTML = `${list.credits}`;
  const listEmail = document.getElementById("email-for-profile-users");
  listEmail.innerHTML = `Email: ${list.email}`;

  let profileDivs = "";
  profileDivs += `
    <div class="mb-5 text-white"> 
    <h3 class="mt-0 mb-0">${list.name}</h3> 
    <p class="small mb-4"> 
        <i class="fas fa-map-marker-alt mr-2"></i>
        Bergen</p>
</div> 

    `;
  results.innerHTML = profileDivs;
}

// =================== GET PERSONAL LISTING ==================
async function getMyListings(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);

    const listings = await response.json();

    const myPosts = listings.listings;

    listListings(myPosts, resultsLists);
  } catch (error) {
    console.log(error);
  }
}

getMyListings(profileURL);

// ============
const resultsLists = document.getElementById("container-for-listings");

function listListings(list, resultsLists) {
  resultsLists.innerHTML = "";
  let newDivs = "";

  for (let post of list) {
    let date = new Date(post.endsAt);
    let ourDate = date.toLocaleString("default", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    newDivs += `
        <div class="col-lg-6 col-md-6 col-sm-12 mt-5">
             <a href="/pages/specific-bid/?id=${post.id}" >
                    <div class="card ">
                        <img src="${post.media}" class="card-img-top card-img" alt="...">
                        <div class="card-body">
                            <h4 class="card-title">${post.title}</h4>
                            <p class="card-text">${post.description}</p>
                        </div>
                        <div class="card-body">
                            <p class="text-success">${ourDate}</p>
                        </div>
                    </div>
              </a>
        </div>`;
  }
  resultsLists.innerHTML = newDivs;
}

// =====================UPDATE AVATAR=======================
const updateAvatarMsg = document.getElementById(
  "updateAvatar-message-for-profile"
);
const updateAvatarInput = document.getElementById("input-for-updateAvatar");
const updateAvatarBtn = document.getElementById("button-for-updating-avatar");
console.log(
  "Update avatar elements:",
  updateAvatarMsg,
  updateAvatarInput,
  updateAvatarBtn
);

async function updateAvatarFunc(url, data) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    const answer = await response.json();

    if (answer.statusCode) {
      updateAvatarMsg.innerHTML =
        "Invalid image URL, make sure is fully formatted!";
    }
    if (answer.name) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

updateAvatarBtn.addEventListener("click", newAvatar);
function newAvatar(event) {
  event.preventDefault();
  const avatarURL = updateAvatarInput.value.trim();

  let avatarData = {
    avatar: avatarURL,
  };

  updateAvatarFunc(updateAvatarURL, avatarData);
}
// ______________________________________________________ends...
