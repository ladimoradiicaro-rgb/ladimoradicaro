const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
const carousels = document.querySelectorAll("[data-carousel]");

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

  window.location.href = `mailto:ladimoradiicaro@gmail.com?subject=Richiesta%20disponibilit%C3%A0%20La%20Dimora%20di%20Icaro&body=${encodeURIComponent(text)}`;
});

carousels.forEach((carousel) => {
  const images = Array.from(carousel.querySelectorAll(".gallery-frame img"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dots = carousel.querySelector(".gallery-dots");
  let activeIndex = Math.max(0, images.findIndex((image) => image.classList.contains("is-active")));

  images.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("is-active", index === activeIndex);
    dots?.append(dot);
  });

  const dotItems = Array.from(dots?.querySelectorAll("span") || []);

  const showImage = (index) => {
    activeIndex = (index + images.length) % images.length;
    images.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === activeIndex);
    });
    dotItems.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  prev?.addEventListener("click", () => showImage(activeIndex - 1));
  next?.addEventListener("click", () => showImage(activeIndex + 1));
});
