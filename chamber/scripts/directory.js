const lastModified = document.lastModified;

const currentYear = new Date().getFullYear();
document.getElementById("currentyear").textContent = currentYear;

document.getElementById("lastModified").textContent = lastModified;

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.textContent = hamburger.textContent === "☰" ? "✖" : "☰";
  });
}

// Dark Mode 
const button = document.getElementById("toggleDark");
const body = document.body;

if (button) {
  button.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
  });
}

// JSON Stuff

const path = 'data/members.json';

const cards = document.querySelector('#cards');

async function getMembersData(path) {
  const response = await fetch(path);
  const data = await response.json();
  //console.table(data.prophets);
  displayMembers(data.members); 

}

const displayMembers = (members) => {
   members.forEach((member) => {
    let card = document.createElement('section');
    let companyName = document.createElement('h2'); 
    let logo = document.createElement('img');
    let address = document.createElement('p');
    let phone = document.createElement('p');
    let website = document.createElement('a');

    companyName.textContent = `${member.name}`; 
    address.textContent = `Address: ${member.address}`;
    phone.textContent = `Phone: ${member.phone}`;
    website.textContent = `${member.website}`;
    website.setAttribute('href', member.website);
    logo.setAttribute('src', `images/${member.image}`);
    logo.setAttribute('alt', `Logo of ${member.name}`); 
    logo.setAttribute('loading', 'lazy');

    card.appendChild(logo);
    card.appendChild(companyName);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);

    cards.appendChild(card);
  }); 
}

getMembersData(path);

const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("#cards");


gridbutton.addEventListener("click", () => {
	display.classList.add("cards");
	display.classList.remove("list");
});

listbutton.addEventListener("click", showList);

function showList() {
	display.classList.add("list");
	display.classList.remove("cards");
}
