const listing = document.getElementById("listing");

// ===================== check if user is logged-in =========================
function isUserLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    listing.style.display = "none";
  }
}

isUserLoggedIn();

// ================= endpoints ==================
const API_URL = "https://api.noroff.dev/api/v1";
const listingEndpoint = "/auction/listings";
const flag = "?_seller=true&_bids=true&sort=created&sortOrder=desc";

const auctionURL = `${API_URL}${listingEndpoint}${flag}`;
const username = localStorage.getItem("username");

const deleteEndpoint = "/auction/listings/delete";
const deleteURL = `${API_URL}${deleteEndpoint}`;

// ================= get listing ====================
let postsLists = [];

async function getAllListings(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);
    console.log(response);
    const auction = await response.json();
    postsLists = auction;
    listData(auction, resultsListing);
  } catch (error) {
    console.log(error);
  }
}
getAllListings(auctionURL);

const resultsListing = document.getElementById("listingContainer");

// ================= LISTS OF ALL AUCTION POSTS ========================
function listData(list, resultsListing) {
  resultsListing.innerHTML = "";
  let newHTML = "";

  for (let auction of Object.values(list)) {
    const auctionImg =
      auction.media.length === 0 || auction.media == "undefined"
        ? "/images/—Pngtree—elephant avatar_3194470.png"
        : `${auction.media[0]}`;
    const profileImg =
      auction.seller.avatar === "" || auction.seller.avatar === null
        ? ["/images/—Pngtree—elephant avatar_3194470.png"]
        : auction.seller.avatar;

    newHTML += `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <a href="/pages/specific-item/?id="${auction.id}">
                            <div class="card mt-5">
                                <img src="${auctionImg}" class="card-img-top card-img">
                                <div class="card-body">
                                    <h4 class="card-title">${auction.title}</h4>
                                    <div class="d-flex">
                                        <img src="${profileImg}" class="" height="140" width="140" alt="Avatar" loading="lazy" />
                                        <h4 class="p-2"> ${auction.seller.name}</h4>
                                    </div>
                                    <div class="d-flex mt-1 pt-2 justify-content-between">
                                        <div>
                                            <p>Bids:</p>
                                            <p>${auction._count.bids}</p>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </a>
                    </div>`;
  }
  resultsListing.innerHTML = newHTML;

  //  ============================= SEARCH FUNCTIONALITY ======================
  const searchInput = document.getElementById("listing-search");
  searchInput.addEventListener("keyup", filterAuctions);

  function filterAuctions() {
    const filterAuctions = searchInput.value.toLowerCase();

    const filtered = postsLists.filter((auction) => {
      const author = auction.seller.name.toLowerCase();
      const title = auction.title.toLowerCase();
      const published = auction.created.toString();

      if (author.indexOf(filterAuctions) > -1) return true;
      if (title.indexOf(filterAuctions) > -1) return true;
      if (published.indexOf(filterAuctions) > -1) return true;
      return false;
    });
    listData(filtered, resultsListing);
  }
}

// ============================================================================
// Create Listing
// Get elements
const listingTitle = document.getElementById("listingPost-title");
const listingCoverage = document.getElementById("listingCoverage");
const listingImg = document.getElementById("listingImg");
const endBid = document.getElementById("bidding-endTime");
const submitListing = document.getElementById("submitListing");

// Create listing
const createListing = `${API_URL}${listingEndpoint}`;

async function createNewListing(url, data) {
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
    console.log("URL:", url, "data:", data, "options:", options);

    const response = await fetch(url, options);
    console.log(response);
    const answer = await response.json();
    console.log("answer:", answer);
    if (answer.id) {
      window.location = "/index.html";
    }
  } catch (error) {
    console.log(error);
  }
}

// =================== Submit listing ======================
submitListing.addEventListener("click", doSubmit);
function doSubmit(event) {
  event.preventDefault();
  const title = listingPost - title.value.trim();
  const description = listingCoverage.value.trim();
  let media = [`${listingImg.value.trim()}`];

  if (media[0] === "") {
    media = ["/images/gallery4.jpg"];
  }

  const endsAt = `${endBid.value.trim()}:00.000Z`;

  const listingData = {
    title: title,
    description: description,
    media: media,
    endsAt: endsAt,
  };

  console.log(listingData);

  createNewListing(createListing, listingData);
}

// ================ Preview elements ====================
let previewContainer = document.getElementById("listing-preview-container");
const previewTitle = document.getElementById("listing-preview-title");
const previewImg = document.getElementById("listing-preview-img");
const previewDescription = document.getElementById(
  "listing-preview-description"
);

// =================== Preview of creating auction ===================
listingTitle.addEventListener("keyup", preview);
listingImg.addEventListener("keyup", preview);
listingCoverage.addEventListener("keyup", preview);

async function preview() {
  previewContainer.innerHTML = "";
  previewContainer.innerHTML = `
                <div class="col-sm-12">
                  <div class="card mt-5 border border-dark">
                    <img src="${
                      listingImg.value !== ""
                        ? listingImg.value
                        : "/images/—Pngtree—vector gallery icon_3989549.png"
                    }" class="card-img-top card-img" alt="..">

                      <div class="card-body">
                          <h4 class="card-title">${listingTitle.value}</h4>
                          <p id="listing-preview-description">${
                            listingContent.value
                          }</p>
                      </div>
                      <div class="d-flex">
                          <img src="/images/—Pngtree—elephant avatar_3194470.png" width="160"
                          alt="Avatar" loading="lazy" />
                          <h4 class="p-2"> Seller</h4>
                      </div>
                    </div>
                  </div>
             </div>
  `;
}

// _____________________________ NENORVALLS _______________________________
