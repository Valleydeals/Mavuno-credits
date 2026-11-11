"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const table = document.getElementById("applicationsTable");
  const search = document.getElementById("searchApplications");
  const filter = document.getElementById("statusFilter");
  const modal = document.getElementById("applicationModal");

  let selectedApplication = null;

  // Demo data only.
  // Replace with authenticated backend data later.
  const applications = [];

  function renderApplications() {

    const term = search.value.toLowerCase();
    const status = filter.value;

    const filtered = applications.filter(app => {

      const matchesSearch =
        app.number.toLowerCase().includes(term) ||
        app.name.toLowerCase().includes(term) ||
        app.phone.includes(term);

      const matchesStatus =
        !status || app.status === status;

      return matchesSearch && matchesStatus;

    });

    if (!filtered.length) {
      table.innerHTML = `
        <tr>
          <td colspan="8" class="empty-row">
            No applications found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = filtered.map(app => `

      <tr>
        <td>${escapeHTML(app.number)}</td>
        <td>${escapeHTML(app.name)}</td>
        <td>${escapeHTML(app.phone)}</td>
        <td>KSh ${Number(app.amount).toLocaleString()}</td>
        <td>${Number(app.period)} Months</td>
        <td>${escapeHTML(app.date)}</td>
        <td>
          <span class="status ${escapeHTML(app.status.replace("_", "-"))}">
            ${escapeHTML(app.status.replace("_", " "))}
          </span>
        </td>
        <td>
          <button class="action-btn"
            data-id="${escapeHTML(app.number)}">
            Review
          </button>
        </td>
      </tr>

    `).join("");

  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function closeModal() {
    modal.style.display = "none";
    selectedApplication = null;
  }

  table.addEventListener("click", event => {

    const button = event.target.closest("[data-id]");

    if (!button) return;

    const app = applications.find(
      item => item.number === button.dataset.id
    );

    if (!app) return;

    selectedApplication = app;

    document.getElementById("modalNumber").textContent = app.number;
    document.getElementById("modalName").textContent = app.name;
    document.getElementById("modalPhone").textContent = app.phone;
    document.getElementById("modalID").textContent = app.id;
    document.getElementById("modalAmount").textContent =
      "KSh " + Number(app.amount).toLocaleString();
    document.getElementById("modalPeriod").textContent =
      app.period + " Months";
    document.getElementById("modalIncome").textContent =
      "KSh " + Number(app.income).toLocaleString();
    document.getElementById("modalPurpose").textContent = app.purpose;

    document.getElementById("adminNotes").value = app.notes || "";

    modal.style.display = "block";

  });

  document.getElementById("closeModal")
    .addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  function reviewApplication(status) {

    const message = document.getElementById("reviewMessage");

    if (!selectedApplication) return;

    message.style.color = "#102C48";
    message.textContent =
      "Approval and rejection will be enabled after secure backend integration.";

  }

  document.getElementById("approveApplication")
    .addEventListener("click", () => reviewApplication("approved"));

  document.getElementById("rejectApplication")
    .addEventListener("click", () => reviewApplication("rejected"));

  search.addEventListener("input", renderApplications);
  filter.addEventListener("change", renderApplications);

  renderApplications();

});
