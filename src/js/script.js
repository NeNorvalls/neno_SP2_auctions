const listing = document.getElementById("listing");

// check if user is logged in
function isUserLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    listing.style.display = "none";
  }
}

isUserLoggedIn();

// endpoints
const API_URL = "https://api.noroff.dev/api/v1";
const listingEndpoint = "/auction/listings";
const flag = "?_seller=true&_bids=true&sort=created&sortOrder=desc";

const auctionURL = `${API_URL}${listingEndpoint}${flag}`;
const username = localStorage.getItem("username");

const deleteEndpoint = "/auction/listings/delete";
const deleteURL = `${API_URL}${deleteEndpoint}`;

// get listing
let collection = [];

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
    collection = auction;
    listData(auction, outListing);
  } catch (error) {
    console.log(error);
  }
}

getAllListings(auctionURL);

const outListing = document.getElementById("post-container");

// Listing all auction posts on the page
function listData(list, out) {
  out.innerHTML = "";
  let newHTML = "";

  for (let auction of Object.values(list)) {
    const auctionImg =
      auction.media.length === 0 || auction.media == "undefined"
        ? "/images/246758.jpg"
        : `${auction.media[0]}`;
    const profileImg =
      auction.seller.avatar === "" || auction.seller.avatar === null
        ? ["/images/246758.jpg"]
        : auction.seller.avatar;

    newHTML += `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <a href="/single-item.html?id="${auction.id}">
                            <div class="card mt-5">
                                <img src="${auctionImg}" class="card-img-top card-img">
                                <div class="card-body">
                                    <h4 class="card-title">${auction.title}</h4>
                                    <div class="d-flex">
                                        <img src="${profileImg}" class="rounded-circle p-2" height="40" alt="Avatar" loading="lazy" />
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

  // Search functionality
  const searchInput = document.getElementById("search-auction");
  searchInput.addEventListener("keyup", filterAuctions);

  function filterAuctions() {
    const filterAuctions = searchInput.value.toLowerCase();

    const filtered = collection.filter((auction) => {
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
