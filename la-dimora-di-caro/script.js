const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const home = data.get("home");
  const checkin = data.get("checkin");
  const nights = data.get("nights");
  const guests = data.get("guests");
  const text = [
    "Ciao, vorrei informazioni per La Dimora di Icaro.",
    `Dimora: ${home}`,
    `Check-in: ${checkin}`,
    `Notti: ${nights}`,
    `Ospiti: ${guests}`,
    "",
    "Grazie"
  ].join("\n");

  window.location.href = `mailto:ladimoradiicaro@gmail.com?subject=Richiesta%20disponibilita%20La%20Dimora%20di%20Icaro&body=${encodeURIComponent(text)}`;
});
