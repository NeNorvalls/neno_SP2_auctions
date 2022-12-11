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
let totalAuctions = [];

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
    totalAuctions = auction;
    listData(auction, outListing);
  } catch (error) {
    console.log(error);
  }
}
getAllListings(auctionURL);

const outListing = document.getElementById("post-listing-container");

// ================= LISTS OF ALL AUCTION POSTS ========================
function listData(list, out) {
  out.innerHTML = "";
  let newHTML = "";

  for (let auction of Object.values(list)) {
    const auctionImg =
      auction.media.length === 0 || auction.media == "undefined"
        ? "/images/—Pngtree—vector gallery icon_3989549.png"
        : `${auction.media[0]}`;
    const profileAvatar =
      auction.seller.avatar === "" || auction.seller.avatar === null
        ? ["/images/—Pngtree—elephant avatar_3194470.png"]
        : auction.seller.avatar;

    newHTML += `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <a href="/pages/specific-bid/?id="${auction.id}">
                            <div class="card mt-5">
                                <img src="${auctionImg}" class="card-img-top card-img">
                                <div class="card-body">
                                    <h4 class="card-title">${auction.title}</h4>
                                    <div class="d-flex">
                                        <img src="${profileAvatar}" class="rounded-circle p-2" height="40" alt="Avatar" loading="lazy" />
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
  out.innerHTML = newHTML;

  //  ============================= SEARCH FUNCTIONALITY ======================
  const searchInput = document.getElementById("search-for-auctions-lists");
  searchInput.addEventListener("keyup", filterAuctions);

  function filterAuctions() {
    const filterAuctions = searchInput.value.toLowerCase();

    const filtered = totalAuctions.filter((auction) => {
      const author = auction.seller.name.toLowerCase();
      const title = auction.title.toLowerCase();
      const published = auction.created.toString();

      if (author.indexOf(filterAuctions) > -1) return true;
      if (title.indexOf(filterAuctions) > -1) return true;
      if (published.indexOf(filterAuctions) > -1) return true;
      return false;
    });
    listData(filtered, outListing);
  }
}

// ============================================================================
// Create Listing
// Get elements
const listingTitle = document.getElementById("title-for-listings-post");
const listingDescription = document.getElementById(
  "description-text-for-listing"
);
const listingImg = document.getElementById("img-for-listing");
const endBid = document.getElementById("endBid");
const submitListing = document.getElementById("submit-button-for-listings");

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
  const title = listingTitle.value.trim();
  const description = listingDescription.value.trim();
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
let previewContainer = document.getElementById("preview-container-listings");
const previewTitle = document.getElementById("preview-title");
const previewImg = document.getElementById("preview-img");
const previewDescription = document.getElementById("preview-description");

// =================== Preview of creating auction ===================
listingTitle.addEventListener("keyup", preview);
listingImg.addEventListener("keyup", preview);
listingDescription.addEventListener("keyup", preview);

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
                          <p id="preview-description">${
                            listingDescription.value
                          }</p>
                      </div>
                      <div class="d-flex">
                          <img src="/images/—Pngtree—elephant avatar_3194470.png" width="200"
                          height="200" alt="Avatar" loading="lazy" />
                          <h4 class="p-2"> Seller</h4>
                      </div>
                    </div>
                  </div>
             </div>
  `;
}

// _____________________________ NENORVALLS _______________________________
