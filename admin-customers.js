"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const table = document.getElementById("customersTable");
  const search = document.getElementById("customerSearch");
  const accountFilter = document.getElementById("accountFilter");
  const kycFilter = document.getElementById("kycFilter");
  const modal = document.getElementById("customerModal");

  let selectedCustomer = null;

  // Demo data only. Real customer records will come
  // from the authenticated backend.
  const customers = [];

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function updateStats() {
    document.getElementById("totalCustomers").textContent =
      customers.length;

    document.getElementById("verifiedCustomers").textContent =
      customers.filter(c => c.kyc === "verified").length;

    document.getElementById("suspendedCustomers").textContent =
      customers.filter(c => c.status === "suspended").length;
  }

  function renderCustomers() {

    const term = search.value.toLowerCase();
    const account = accountFilter.value;
    const kyc = kycFilter.value;

    const filtered = customers.filter(customer => {

      const matchesSearch =
        customer.id.toLowerCase().includes(term) ||
        customer.name.toLowerCase().includes(term) ||
        customer.phone.includes(term);

      const matchesAccount =
        !account || customer.status === account;

      const matchesKyc =
        !kyc || customer.kyc === kyc;

      return matchesSearch && matchesAccount && matchesKyc;
    });

    if (!filtered.length) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="empty-row">
            No customers found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = filtered.map(customer => `
      <tr>
        <td>${escapeHTML(customer.id)}</td>
        <td>${escapeHTML(customer.name)}</td>
        <td>${escapeHTML(customer.phone)}</td>
        <td>${escapeHTML(customer.date)}</td>
        <td>
          <span class="badge ${
            customer.kyc === "verified" ? "verified" : "unverified"
          }">
            ${escapeHTML(customer.kyc)}
          </span>
        </td>
        <td>
          <span class="badge ${
            customer.status === "active" ? "active" : "suspended"
          }">
            ${escapeHTML(customer.status)}
          </span>
        </td>
        <td>
          <button class="view-btn"
            data-id="${escapeHTML(customer.id)}">
            View
          </button>
        </td>
      </tr>
    `).join("");
  }

  function closeModal() {
    modal.style.display = "none";
    selectedCustomer = null;
  }

  table.addEventListener("click", event => {

    const button = event.target.closest("[data-id]");

    if (!button) return;

    const customer = customers.find(
      c => c.id === button.dataset.id
    );

    if (!customer) return;

    selectedCustomer = customer;

    document.getElementById("profileId").textContent = customer.id;
    document.getElementById("profileName").textContent = customer.name;
    document.getElementById("profilePhone").textContent = customer.phone;
    document.getElementById("profileEmail").textContent = customer.email;
    document.getElementById("profileDate").textContent = customer.date;
    document.getElementById("profileKyc").textContent = customer.kyc;
    document.getElementById("profileStatus").textContent = customer.status;

    document.getElementById("customerMessage").textContent = "";

    modal.style.display = "block";
  });

  document.getElementById("closeCustomerModal")
    .addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  function updateAccount(status) {

    if (!selectedCustomer) return;

    document.getElementById("customerMessage").textContent =
      "Account changes will be enabled after secure backend integration.";
  }

  document.getElementById("suspendCustomer")
    .addEventListener("click", () => updateAccount("suspended"));

  document.getElementById("activateCustomer")
    .addEventListener("click", () => updateAccount("active"));

  search.addEventListener("input", renderCustomers);
  accountFilter.addEventListener("change", renderCustomers);
  kycFilter.addEventListener("change", renderCustomers);

  updateStats();
  renderCustomers();

});
