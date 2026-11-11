"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  const message = document.getElementById("contactMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!form.reportValidity()) return;

    message.style.color = "#102C48";

    message.textContent =
      "Your message form is ready. Message delivery will be activated after backend integration.";

  });

});
