const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");
const profileLink = document.getElementById("profile-link");
const usersLink = document.getElementById("users-link");
// Check if user is logged in
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
const APIurl = " https://api.noroff.dev/api/v1";
const profileEndpoint = `/auction/profiles/${username}?_listings=true`; // POST

const profileUrl = `${APIurl}${profileEndpoint}`;
const updateAvatarUrl = `${APIurl}/auction/profiles/${username}/media`;

let collection = [];
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
    collection = profile;

    listData(collection, outElement);
  } catch (error) {
    console.log(error);
  }
}

getProfileInfo(profileUrl);

// ================= CREATE LISTING - INNER HTML =================

const outElement = document.getElementById("post-container");

function listData(list, out) {
  out.innerHTML = "";
  const avatarImg = document.getElementById("avatarImg");
  avatarImg.src = `${list.avatar}`;

  const listCredits = document.getElementById("list-credits");
  listCredits.innerHTML = `${list.credits}`;
  const listEmail = document.getElementById("list-email");
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
  out.innerHTML = profileDivs;
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

    const myOwnPosts = listings.listings;

    listListings(myOwnPosts, secondElement);
  } catch (error) {
    console.warn(error);
  }
}

getMyListings(profileUrl);

// ============
const secondElement = document.getElementById("listing-container");

function listListings(list, second) {
  second.innerHTML = "";
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
             <a href="shop-specific.html?id=${post.id}" class="text-decoration-none">
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
  second.innerHTML = newDivs;
}

// =====================UPDATE AVATAR=======================
const updateAvatarMsg = document.getElementById("updateAvatarMsg");
const updateAvatarInput = document.getElementById("updateAvatarInput");
const updateAvatarBtn = document.getElementById("updateAvatarBtn");
console.log(
  "Update avatar elements:",
  updateAvatarMsg,
  updateAvatarInput,
  updateAvatarBtn
);

async function updateAvatar(url, data) {
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
    console.warn(error);
  }
}

updateAvatarBtn.addEventListener("click", newAvatar);
function newAvatar(event) {
  event.preventDefault();
  const avatarUrl = updateAvatarInput.value.trim();

  let avatarData = {
    avatar: avatarUrl,
  };

  updateAvatar(updateAvatarUrl, avatarData);
}
// ______________________________________________________ends...
