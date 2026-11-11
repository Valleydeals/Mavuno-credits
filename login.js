"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");
  const forgotPassword = document.getElementById("forgotPassword");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      message.style.color = "#102C48";
      message.textContent =
        "Login interface ready. Secure authentication will be connected to the backend.";
    });
  }

  if (forgotPassword) {
    forgotPassword.addEventListener("click", (event) => {
      event.preventDefault();

      message.style.color = "#A57C2D";
      message.textContent =
        "Password recovery will be available after backend integration.";
    });
  }

});
