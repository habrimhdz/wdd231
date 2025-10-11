

document.addEventListener("DOMContentLoaded", () => {
  //Hamburger
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.textContent = hamburger.textContent === "☰" ? "✖" : "☰";
    });
  }

  // Dark Mode Toggle
  const button = document.getElementById("toggleDark");
  const body = document.body;

  if (button) {
    button.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
    });
  }

  // Footer
  const lastModified = document.lastModified;
  const currentYear = new Date().getFullYear();

  const currentYearEl = document.getElementById("currentyear");
  if (currentYearEl) currentYearEl.textContent = currentYear;

  const lastModifiedEl = document.getElementById("lastModified");
  if (lastModifiedEl) lastModifiedEl.textContent = lastModified;

 
  // Timestamp for Form
  
  const timestampInput = document.getElementById('timestamp');
  if (timestampInput) {
    timestampInput.value = new Date().toISOString();
  }

  // Membership Cards Modals
  document.querySelectorAll(".open-modal").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const dialogId = link.dataset.dialog;
      const dialog = document.getElementById(dialogId);
      if (dialog) dialog.showModal();
    });
  });

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    });
  });


  // Thank You 
  const output = document.getElementById('submittedData');
  if (output) {
    const params = new URLSearchParams(window.location.search);
    const fieldLabels = {
      firstName: "First Name",
      lastName: "Last Name",
      organizationTitle: "Organizational Title",
      email: "Email",
      telephone: "Telephone",
      business: "Business Name",
      membershipLevel: "Membership Level",
      description: "Business Description",
      timestamp: "Submission Timestamp"
    };

    params.forEach((value, key) => {
      const li = document.createElement('li');
      li.textContent = `${fieldLabels[key] || key}: ${value}`;
      output.appendChild(li);
    });
  }

  // Membership Cards from JSON
  const path = 'data/members.json';
  const cardsContainer = document.getElementById('cards');

  async function getMembersData(path) {
    if (!cardsContainer) return;

    try {
      const response = await fetch(path);
      const data = await response.json();

      const isIndex = document.body.classList.contains('index');
      let membersToShow = data.members;

      if (isIndex) {
        membersToShow = data.members.filter(m => m.membershipLevel === 'Gold' || m.membershipLevel === 'Silver');
        // Shuffle and take top 3
        for (let i = membersToShow.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [membersToShow[i], membersToShow[j]] = [membersToShow[j], membersToShow[i]];
        }
        membersToShow = membersToShow.slice(0, 3);
      }

      displayMembers(membersToShow);

    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  }

  function displayMembers(members) {
    members.forEach(member => {
      const card = document.createElement('section');

      const logo = document.createElement('img');
      logo.setAttribute('src', `images/${member.image}`);
      logo.setAttribute('alt', `Logo of ${member.name}`);
      logo.setAttribute('loading', 'lazy');

      const companyName = document.createElement('h2');
      companyName.textContent = member.name;

      const address = document.createElement('p');
      address.textContent = `Address: ${member.address}`;

      const phone = document.createElement('p');
      phone.textContent = `Phone: ${member.phone}`;

      const website = document.createElement('a');
      website.href = member.website;
      website.textContent = member.website;

      const membership = document.createElement('p');
      membership.textContent = `Membership Level: ${member.membershipLevel}`;

      card.appendChild(logo);
      card.appendChild(companyName);
      card.appendChild(address);
      card.appendChild(phone);
      card.appendChild(website);
      card.appendChild(membership);

      cardsContainer.appendChild(card);
    });
  }

  getMembersData(path);

  // Grid/List Toggle
  const gridButton = document.querySelector("#grid");
  const listButton = document.querySelector("#list");

  gridButton?.addEventListener("click", () => {
    cardsContainer?.classList.add("cards");
    cardsContainer?.classList.remove("list");
  });

  listButton?.addEventListener("click", () => {
    cardsContainer?.classList.add("list");
    cardsContainer?.classList.remove("cards");
  });

  // Weather API
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

  function displayResults(data) {
    if (!currentTemp || !weatherIcon || !captionDesc) return;

    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    currentTemp.innerHTML = `${data.main.temp}&deg;C`;

    let desc = data.weather[0].description;
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = desc;

    const weatherDetails = document.createElement('div');
    weatherDetails.innerHTML = `
      <p>High: ${data.main.temp_max}&deg;C</p>
      <p>Low: ${data.main.temp_min}&deg;C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    `;
    captionDesc.appendChild(weatherDetails);
  }

  apiFetch();

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

  function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    if (!forecastContainer) return;

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

  fetchForecast();
});

async function buildItemCards() {
  const response = await fetch('data/items.json');
  if (!response.ok) return;
  const data = await response.json();
  const items = data.items.slice(0, 8);

  const container = document.getElementById('itemCards');
  if (!container) return;

  items.forEach(item => {
    const card = document.createElement('section');

    const title = document.createElement('h2');
    title.textContent = item.name;

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.loading = 'lazy';
    img.width = 300;
    img.height = 200;
    figure.appendChild(img);

    const address = document.createElement('address');
    address.textContent = item.address;

    const desc = document.createElement('p');
    desc.textContent = item.description;

    const button = document.createElement('button');
    button.textContent = 'Learn More';

    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(desc);
    card.appendChild(button);

    container.appendChild(card);
  });
}

buildItemCards();

document.addEventListener('DOMContentLoaded', () => {
  const messageContainer = document.createElement('div');
  messageContainer.id = 'visitMessage';
  messageContainer.style.padding = '10px';
  messageContainer.style.textAlign = 'center';

  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();

  let message = '';

  if (!lastVisit) {
  
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const msBetweenVisits = now - Number(lastVisit);
    const daysBetween = Math.floor(msBetweenVisits / (1000 * 60 * 60 * 24));

    if (daysBetween < 1) {
      message = 'Back so soon! Awesome!';
    } else if (daysBetween === 1) {
      message = `You last visited ${daysBetween} day ago.`;
    } else {
      message = `You last visited ${daysBetween} days ago.`;
    }
  }

  messageContainer.textContent = message;
  document.querySelector('main')?.prepend(messageContainer);

  localStorage.setItem('lastVisit', now);
});

