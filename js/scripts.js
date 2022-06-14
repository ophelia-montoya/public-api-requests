const url =
  "https://randomuser.me/api/?results=12&inc=picture,name,email,location,cell,dob&noinfo&nat=US";
let users = [];
let gallery = document.getElementById("gallery");
const body = document.body;


/**
 * @param  {string} url
 * fetch results from API
 */

fetch(url)
  .then((res) => res.json())
  .then((data) => fetchUsers(data.results))
  .catch((err) => console.log(err));

function fetchUsers(userData) {
  users = userData;
  displayUsers(users);
}

/**
 * @param  {array} userData - random user data returned from API server
 * iterates through results, builds HTML string for each user using a template literal.
 */

function displayUsers(userData) {
  let userHTML = "";

  userData.forEach((user, index) => {
    const picture = user.picture;
    const name = user.name;
    const email = user.email;
    const location = user.location;

    userHTML += `
        <div class="card" data-index="${index}"> 
        <div class="card-img-container">
            <img class="card-img" src="${picture.thumbnail}"alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${location.city}, ${location.state}</p>
        </div>
    </div>
    
    
    `;
  });
  gallery.insertAdjacentHTML("beforeend", userHTML);
}

/**
 * @param  {number} index - index for the closest card to event target
 * builds HTML string using template literal 
 */

function createModal(index) {
  const { //object destructuring allows access to individual object properties
    picture,
    name,
    email,
    location: { city, street, state, postcode },
    cell,
    dob,
  } = users[index];
  let date = new Date(dob.date); //reformats date
  let modalHTML = `
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${
              picture.medium
            }" alt="profile picture">
            <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
            <p class="modal-text">${email}</p>
            <p class="modal-text cap">${city}</p>
            <hr>
            <p class="modal-text">${cell.replace("-", " ")}</p>
            <p class="modal-text">${street.number} ${street.name} ${city}, ${state} ${postcode}</p>
            <p class="modal-text">Birthday: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    </div>
    
     `;

     body.insertAdjacentHTML("beforeend", modalHTML);
  


  /**
   * EVENT LISTENERS
   */

  const closeBtn = document.getElementById("modal-close-btn");
  const overlay = document.querySelector(".modal-container");

  closeBtn.addEventListener("click", (e) => {
    body.removeChild(body.lastElementChild); //removes (hides) modal when close button is clicked
  });
}

gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  const index = card.getAttribute("data-index");
  createModal(index); //creates modal for closest card to event listener using data-index attribute
});
