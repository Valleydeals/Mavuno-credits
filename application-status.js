
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("trackingForm");
  const error = document.getElementById("trackingError");
  const result = document.getElementById("trackingResult");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const reference =
      document.getElementById("applicationNumber").value.trim();

    error.textContent = "";
    result.style.display = "none";

    if (!reference) {
      error.textContent = "Please enter your application reference.";
      return;
    }

    error.textContent =
      "Application tracking will be activated after backend integration.";

  });

});
