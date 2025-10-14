export function setupLastVisit() {

document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.href.includes('schedule.html')) return;
  const messageContainer = document.createElement('div');
  messageContainer.id = 'visitMessage';
  messageContainer.style.padding = '10px';
  messageContainer.style.textAlign = 'center';
  messageContainer.style.fontWeight = '200';

  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();

  let message = '';

  if (!lastVisit) {
  
    message = "Welcome! It's good to have you here. Let us know if you have any questions.";
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
})};