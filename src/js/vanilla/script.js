const createListing = document.getElementById("createListing");
// Checking if user is logged in
function isLoggedin() {
const accessToken = localStorage.getItem("accessToken");
if (!accessToken) {
    createListing.style.display="none";
}
}

isLoggedin();

// Endpoints
const APIurl = " https://api.noroff.dev/api/v1";
const auctionEndpoint = "/auction/listings"; // POST
const extraFlag = "?_seller=true&_bids=true&sort=created&sortOrder=desc"

const auctionUrl = `${APIurl}${auctionEndpoint}${extraFlag}`;
const username = localStorage.getItem('username');

const deleteEndPoint = '/auction/listings/'; 
const deleteURL = `${APIurl}${deleteEndPoint}`;




//let AUCTION = [];
let collection = [];

async function getAllAuctions (url) {
    try {
        const accessToken = localStorage.getItem('accessToken'); 
        const options = {
            method: 'GET', 
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }
        //console.log(url, options);

        const response = await fetch(url, options); 
        //console.log(response);
        const auction = await response.json();
        //console.log("Posts:", auction);
        collection = auction;
        //console.log("Collection:", collection);
        listData(auction, outElement)
    } catch(error) {
        console.warn(error);
    }
}   

getAllAuctions(auctionUrl);

const outElement = document.getElementById("post-container");

//Liste ut alle poster på html siden
function listData(list, out){
   // console.log ("List:", list);
    out.innerHTML = "";
    let newDivs = "";

    for (let auction of list) {
    //console.log ("Auction Media: ", auction.media[0], auction.media.length);

   //Ternyary for listing media
   const productImg =
   auction.media.length === 0 || auction.media == "undefined"
   ? 
    "../placeholder.png"
    : `${auction.media[0]}`;
   //console.log ("Fikset Action Media: ", productImg);

   //Ternyary for avatar img
    const profileImg =
    auction.seller.avatar === "" || auction.seller.avatar === null
    ? [
        "../Img/60111.jpg"
    ]
    :auction.seller.avatar;

//FIX DATE LAYOUT
    let date = new Date(auction.endsAt);
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


        newDivs += `
        <div class="col-lg-4 col-md-6 col-sm-12">
            <a href="./public/shop-specific.html?id=${auction.id}" class="text-decoration-none"> 
               <div class="card mt-5">
                 <img src="${productImg}" class="card-img-top card-img" alt="..">
        
                 <div class="card-body">
                 <h4 class="card-title">${auction.title}</h4>
                 <div class="d-flex">
                    <img src="${profileImg}" class="rounded-circle p-2"
                    height="40" alt="Avatar" loading="lazy" />
                    <h4 class="p-2"> ${auction.seller.name}</h4>
                 </div>
                   <div class="d-flex mt-1 pt-2 justify-content-between">
                       <div>
                          <p>Bids:</p>
                          <p>${auction._count.bids}</p>
                        </div>
                        <div>
                          <p>Auction ends: </p>
                          <p class="timer">${bidTime}</p>
                         </div>
                    </div>
                    </a> 
                 </div>
               </div>
          </div>`;
          //console.log("Auction media:", auction.media[0]);
          //console.log(auction.seller.avatar);
    }
    out.innerHTML = newDivs;

           //TIMER
           const timer = document.getElementsByClassName("timer");
        for(let i = 0; i < timer.length; i++) {

        let bidEnding = timer[i].innerHTML;
        
        if (bidEnding !== "EXPIRED") {
        timer[i].classList.add("not-expired");
        } else {
             timer[i].classList.add("expired");
        }    
    }
}


      //Filtrere posts / search input
      const inputField = document.getElementById("filter-auction");
      //console.log(inputField);
      inputField.addEventListener("keyup", filterAuctions);
  
      function filterAuctions () {
          const filterAuctions = inputField.value.toLowerCase();
          //console.log(filterAuctions);
  
          const filtered = collection.filter((auction)=> {
              //console.log(post.author.name, filterPosts);
              //console.log(post.author.name.toUpperCase().indexOf(filterPosts.toUpperCase()) > -1);
              //console.log(collection.length);
              const author = auction.seller.name.toLowerCase();
              const title = auction.title.toLowerCase();
              const published = auction.created.toString();
              //console.log(author, title, published);
              if (author.indexOf(filterAuctions) > -1) return true;
              if (title.indexOf(filterAuctions) > -1) return true;
              if (published.indexOf(filterAuctions) > -1) return true;
              return false;
          })
  
          listData(filtered, outElement);
      }
  




//-----------------------------------------------------  
//Hente create post verdier:
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const postMedia = document.getElementById("postMedia");
const endsBid = document.getElementById("endBid");
const submitPost = document.getElementById("submitPost");
//console.log(postTitle, postContent, postMedia, endsBid, submitPost);


//Create a new post - method: POST
const createAuction = `${APIurl}${auctionEndpoint}`;


async function createNewAuction (url, data) {
    try {
        const accessToken = localStorage.getItem('accessToken'); 
        const options = {
            method: 'POST', 
            headers : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        };
        console.log("Url:", url,"Data:", data,"Options:", options);

        const response = await fetch(url, options); 
        console.log(response);
        const answer = await response.json();
        console.log("Answer", answer);
        if (answer.id) {
            window.location = "./index.html";
          }
    } catch(error) {
        console.warn(error);
    }
}


//Hente p taggene for å skrive ut beskjed ved validering
const titleMsg = document.getElementById("titleMsg");
const bodyMsg = document.getElementById("bodyMsg");
const mediaMsg = document.getElementById("mediaMsg");
const endbidMsg = document.getElementById("endbidMsg");


//console.log(titleMsg, bodyMsg, mediaMsg);

//Validate form 
submitPost.addEventListener('click', validateFormAndProcess);
function validateFormAndProcess(event) {
    event.preventDefault();
    const title = postTitle.value.trim();
    const description = postContent.value.trim();
    let media = [`${postMedia.value.trim()}`]

    if (media[0] === "") {
        media = [
            "https://github.com/AnnaHelene01/SemesterProject2/blob/main/placeholder.png?raw=true"
        ]
    }

    const endsAt = `${endsBid.value.trim()}:00.000Z`;


    //var dateParts = listingDate.value.trim().split("-");
    //var deadline = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    //var endsAt = deadline.toISOString();
    //console.log(endsAt);

    if (media.value === []) 
    media = 
    ["https://upload.wikimedia.org/wikipedia/commons/6/67/Learning_Curve_--_Coming_Soon_Placeholder.png"];

    const auctionData = {
        title: title,
        description: description,
        media: media,
        endsAt: endsAt,   
       };
    console.log(auctionData);

    

    const submittedTitle = title;
    titleMsg.innerHTML = "";
     if (submittedTitle.length < 1) {
     titleMsg.innerHTML = 'Your title has to be at least 1 or more characters.';
     }
     
     bodyMsg.innerHTML = "";
    const submittedBody = description;
    if (submittedBody.length < 1) {
        bodyMsg.innerHTML = 'Your description has to be at least 1 or more characters.';
    }

    mediaMsg.innerHTML = "";
    const submittedMedia = media;
    if (submittedMedia === "") {
        mediaMsg.innerHTML = 'You must add a real URL';
    }

    endbidMsg.innerHTML = "";
    const submittedEndbid = endsAt;
    if (submittedEndbid === "") {
        endbidMsg.innerHTML = 'You have to add a date and time to end your auction!'
    }

      if (titleMsg.innerHTML === "" && bodyMsg.innerHTML === "" && mediaMsg.innerHTML === "") {
        //console.log("Form is submitted!");
        //form.submit(); ///for å submitte skjema 
     }
     else {
        console.log("You still have validation errors");
    }
    createNewAuction(createAuction, auctionData);
}

// Preview elements:
let previewContainer = document.getElementById("preview-container");
const previewTitle = document.getElementById("preview-title");
const previewImg = document.getElementById("preview-img");
const previewDescription = document.getElementById("preview-description");

// Preview of creating auction:
postTitle.addEventListener("keyup", preview);
postMedia.addEventListener("keyup", preview);
postContent.addEventListener("keyup", preview)

async function preview() {
  previewContainer.innerHTML = "";
  previewContainer.innerHTML = `
                <div class="col-sm-12">
                  <div class="card mt-5">
                    <img src="${
                        postMedia.value !== ""
                          ? postMedia.value
                          : "../placeholder.png"
                      }" class="card-img-top card-img" alt="..">
           
                      <div class="card-body">
                          <h4 class="card-title">${postTitle.value}</h4>
                          <p id="preview-description">${postContent.value}</p>
                      </div>
                      <div class="d-flex">
                          <img src="/Img/60111.jpg" class="rounded-circle p-2"
                          height="40" alt="Avatar" loading="lazy" />
                          <h4 class="p-2"> Seller</h4>
                      </div>
                    </div>
                  </div>
             </div>
  `;
}