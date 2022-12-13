const loginLink = document.getElementById("login-link");

const logoutLink = document.getElementById("logout-link");

const profileLink = document.getElementById("profile-link");

const usersLink = document.getElementById("users-link");

// ====================================== Checking if user is logged in====================
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

// ========================================= ENDPOINTS =====================
const API_URL = " https://api.noroff.dev/api/v1";

const auctionEndpoint = "/auction/listings/"; // POST

const AUCTION_URL = `${API_URL}${auctionEndpoint}`;

const extraFlag = "?_seller=true&_bids=true";

const deleteEndPoint = "/auction/listings/";
const DELETE_URL = `${API_URL}${deleteEndPoint}`;

let params = new URLSearchParams(document.location.search);
let id = params.get("id");

const getSingleAuctionURL = `${AUCTION_URL}${id}${extraFlag}`;
const makeBidUrl = `${AUCTION_URL}${id}/bids`;

// ========================
let auctionsResults = [];

async function getSingleAuction(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);

    const auctions = await response.json();

    auctionsResults = auctions;

    listData(auctions, auctionsListResults);
  } catch (error) {
    console.log(error);
  }
}

getSingleAuction(getSingleAuctionURL);

const auctionsListResults = document.getElementById("specificBid-container");

// ====================================================== Listing Auction Results =============
function listData(auctions, results) {
  let date = new Date(auctions.endsAt);

  let now = new Date().getTime();

  let distance = date - now;

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  let bidTime = "";
  bidTime = days + "d " + hours + "h " + minutes + "m ";

  if (distance < 0) {
    bidTime = "EXPIRED";
  }

  //  ================================= PLACEHOLDER FOR LISTINGS MEDIA ===============
  const productImg =
    auctions.media.length === 0 || auctions.media == "undefined"
      ? "/images/—Pngtree—vector gallery icon_3989549.png"
      : `${auctions.media[0]}`;

  //  =============================================== PLACEHOLDER FOR AVATAR ============
  const profileImg =
    auctions.seller.avatar === "" || auctions.seller.avatar === null
      ? ["/images/—Pngtree—elephant avatar_3194470.png"]
      : auctions.seller.avatar;

  // ======================================================= ELEMENTS =====================
  const numberOfBids = document.getElementById("number-of-bids");
  numberOfBids.innerHTML = `Number of bids: ${auctions._count.bids}`;

  const auctionAvatar = document.getElementById("auction-avatar");
  auctionAvatar.src = `${profileImg}`;

  const auctionSeller = document.getElementById("auction-seller");
  auctionSeller.innerHTML = `${auctions.seller.name}`;

  let newDivs = "";
  newDivs += `
                      <div class="mb-5" id="singleMedia">
                          <img src="${productImg}" alt="product img" class="img-fluid"> 
                      </div>
                      <h2 class="my-4">${auctions.title}</h2>
                      <p>${auctions.description}</p>
                      <div class="card-body d-flex">
                      <p>Auction ends: </p>
                      <p class=" timer">${bidTime}</p>
                   </div>
                   <h2 class="mt-4">Bidders: (${auctions._count.bids})</h2>
            `;

  const sendBidBtn = document.getElementById("create-bid-btn");

  sendBidBtn.addEventListener("click", validateAndProcess);

  results.innerHTML = newDivs;

  //   ===================================== BID TIMER =============
  const timer = document.querySelector(".timer");

  let bidEnding = timer.innerHTML;

  if (bidEnding !== "EXPIRED") {
    timer.classList.add("not-expired");
  } else {
    timer.classList.add("expired");
  }

  //   ===================================== ELEMENTS FOR LOGIN/LOGOUT, BID/NOT BID, EXPIRED OR NOT ==================
  const makeBid = document.getElementById("to-do-bid");

  const myOwnBid = document.getElementById("bid-my-own");

  const bidNotLoggedIn = document.getElementById("bid-not-loggedin");

  const bidExpired = document.getElementById("bid-expired");

  console.log(makeBid, myOwnBid, bidNotLoggedIn, bidExpired);

  function displayBid() {
    const accessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("username");

    if (accessToken && userName !== auctions.seller.name) {
      myOwnBid.style.display = "none";
      bidNotLoggedIn.style.display = "none";
      bidExpired.style.display = "none";
    } else if (accessToken && userName === auctions.seller.name) {
      makeBid.style.display = "none";
      bidNotLoggedIn.style.display = "none";
      bidExpired.style.display = "none";
    } else if (!accessToken) {
      makeBid.style.display = "none";
      myOwnBid.style.display = "none";
      bidExpired.style.display = "none";
    } else if ((timer.innerHTML = "Auction is expired")) {
      makeBid.style.display = "none";
      myOwnBid.style.display = "none";
      bidNotLoggedIn.style.display = "none";
    }
  }

  displayBid();

  //   ================================ DELETE LISTING =================
  const sellDelete = document.getElementById("deleteListingBtn");

  sellDelete.addEventListener("click", () => {
    if (confirm("Are you totally sure?")) {
      deletePost(auctions.id);
    }
  });

  //   ========================================== UPDATE LISTING =================
  const sellUpdate = document.getElementById("updateListingBtn");

  sellUpdate.addEventListener("click", () => {
    window.location = `/pages/editListing/?id=${auctions.id}`;
  });
}

// ==================================================== DELETING POST ===============
async function deletePost(id) {
  const url = `${DELETE_URL}${id}`;

  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);

    if (response.status === 204) {
      window.location = "/index.html";
    }
  } catch (error) {
    console.warn(error);
  }
}

// ===================================== FOR GETTING SINGLE BID ====================
async function getSingleBids(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);

    const bids = await response.json();

    const answer = bids.bids;

    listBids(answer, listBidsResults);
  } catch (error) {
    console.warn(error);
  }
}

getSingleBids(getSingleAuctionURL);

const listBidsResults = document.getElementById("bidContainer");

function listBids(list, listBidsResults) {
  listBidsResults.innerHTML = "";

  let newDivs = "";

  //   ============================================= SORTING HIGHEST OR LOW BIDS =============
  list.sort(function (a, b) {
    return b.amount - a.amount;
  });

  for (let bid of list) {
    newDivs += `
        <ul class="bidder mt-3">
                          <li class="d-flex justify-content-between align-items-center">
                              <div class="d-flex align-items-center">
                                  <span>-</span>
                                  <div class="d-flex align-items-center">
                                      <img src="">
                                      <span>${bid.bidderName}</span>
                                  </div>
                              </div>
                              <span class="price">${bid.amount}</span>
                          </li>
                      </ul>`;
  }
  listBidsResults.innerHTML = newDivs;
}

//MAKE A BID
async function createBid(url, data) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    console.log(response);

    const answer = await response.json();

    if (response.status === 200) {
      window.location.reload();
    }
    console.log(answer);
  } catch (error) {
    console.log(error);
  }
}

// ============================================= PROCESSING BID INPUTS ===============
function validateAndProcess(event) {
  event.preventDefault();

  const bidInput = document.getElementById("bidInput").value.trim();

  const bidInputMsg = document.getElementById("bidText");

  console.log("Bid elements:", bidInput, bidInputMsg);

  const bidToSend = parseInt(bidInput);

  console.log("bidToSend:", bidToSend);

  let bidData = {
    amount: bidToSend,
  };

  if (!isNaN(bidToSend)) {
    console.log("value is a number");
  } else {
    bidInputMsg.innerHTML = "Bid has to be a number.";
  }

  // ======================================= SECURING THAT USERS ARE isLoggedIn-IN =================
  function isUserLoggedIn() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Login in order to bid!");
      window.location.href = "/profile/login/";
    }
  }

  isUserLoggedIn();

  createBid(makeBidUrl, bidData);
}
