"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const password =
      document.getElementById("regPassword").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (!form.reportValidity()) return;

    if (password !== confirmPassword) {
      message.style.color = "#DC2626";
      message.textContent = "Passwords do not match.";
      return;
    }

    message.style.color = "#102C48";
    message.textContent =
      "Registration form validated. Secure account creation will be connected to the backend next.";

  });

});
