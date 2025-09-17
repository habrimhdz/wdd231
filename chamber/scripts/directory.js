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

  const isIndex = document.body.classList.contains('index');
  let membersToShow;

  if (isIndex) {
    // Filter membership Level
    const goldSilverMembers = data.members.filter(m =>
      m.membershipLevel === 'Gold' || m.membershipLevel === 'Silver'
    );
    // Randomizer
    for (let i = goldSilverMembers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [goldSilverMembers[i], goldSilverMembers[j]] = [goldSilverMembers[j], goldSilverMembers[i]];
    }
    membersToShow = goldSilverMembers.slice(0, 3);
  } else {
    membersToShow = data.members;
  }

  displayMembers(membersToShow);
}

const displayMembers = (members) => {
  members.forEach((member) => {
    let card = document.createElement('section');
    let companyName = document.createElement('h2');
    let logo = document.createElement('img');
    let address = document.createElement('p');
    let phone = document.createElement('p');
    let website = document.createElement('a');
    let membership = document.createElement('p');

    companyName.textContent = `${member.name}`;
    address.textContent = `Address: ${member.address}`;
    phone.textContent = `Phone: ${member.phone}`;
    website.textContent = `${member.website}`;
    website.setAttribute('href', member.website);
    logo.setAttribute('src', `images/${member.image}`);
    logo.setAttribute('alt', `Logo of ${member.name}`);
    logo.setAttribute('loading', 'lazy');
    membership.textContent = `Membership Level: ${member.membershipLevel}`;

    card.appendChild(logo);
    card.appendChild(companyName);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);
    card.appendChild(membership);

    cards.appendChild(card);
  });
}

getMembersData(path);

const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const display = document.querySelector("#cards");

gridbutton?.addEventListener("click", () => {
  display?.classList.add("cards");
  display?.classList.remove("list");
});

listbutton?.addEventListener("click", showList);

function showList() {
  display?.classList.add("list");
  display?.classList.remove("cards");
}

// Weather

const currentTemp = document.querySelector('#temperature');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('#weatherdesc');

const url = 'https://api.openweathermap.org/data/2.5/weather?lat=24.024974989281706&lon=-104.66264380612525&units=metric&appid=29809cec684e7a6ee706ac029fe454ce';

async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayResults(data);
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}

apiFetch();

function displayResults(data) {
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    currentTemp.innerHTML = `${data.main.temp}&deg;C`;
    let desc = data.weather[0].description;
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = `${desc}`;
    const high = data.main.temp_max;
    const low = data.main.temp_min;
    const humidity = data.main.humidity;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const weatherDetails = document.createElement('div');
    weatherDetails.innerHTML = `
      <p>High: ${high}&deg;C</p>
      <p>Low: ${low}&deg;C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Sunrise: ${sunrise}</p>
      <p>Sunset: ${sunset}</p>
    `;

    captionDesc.appendChild(weatherDetails);
    
}

// Forecast
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=24.0249&lon=-104.6626&units=metric&appid=29809cec684e7a6ee706ac029fe454ce';

async function fetchForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (response.ok) {
      const data = await response.json();
      displayForecast(data);
    }
  } catch (error) {
    console.log(error);
  }
}

fetchForecast();

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast');
  const forecastList = data.list.filter(entry => entry.dt_txt.includes('18:00:00')).slice(0, 3);
  forecastList.forEach(entry => {
    const date = new Date(entry.dt_txt);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = entry.main.temp;
    const iconCode = entry.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    const iconDesc = entry.weather[0].description;
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h3>${dayName}</h3>
      <img src="${iconUrl}" alt="${iconDesc}" loading="lazy">
      <p>${temp}&deg;C</p>
    `;
    forecastContainer.appendChild(forecastItem);
  });
}
