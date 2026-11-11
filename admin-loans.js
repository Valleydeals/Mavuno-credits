"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const table = document.getElementById("loansTable");
  const search = document.getElementById("loanSearch");
  const filter = document.getElementById("loanStatusFilter");
  const modal = document.getElementById("loanModal");

  // Demo records only. Real loan records will be
  // retrieved from the secure backend.
  const loans = [];

  function money(value) {
    return "KSh " + Number(value).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

  function updateStats() {

    const active = loans.filter(l => l.status === "active");
    const overdue = loans.filter(l => l.status === "overdue");

    document.getElementById("totalLoans").textContent =
      active.length;

    document.getElementById("totalIssued").textContent =
      money(active.reduce((sum, l) => sum + Number(l.principal), 0));

    document.getElementById("totalOutstanding").textContent =
      money(active.concat(overdue).reduce(
        (sum, l) => sum + Number(l.balance), 0
      ));

    document.getElementById("overdueLoans").textContent =
      overdue.length;
  }

  function renderLoans() {

    const term = search.value.toLowerCase();
    const status = filter.value;

    const filtered = loans.filter(loan => {

      const matchesSearch =
        loan.id.toLowerCase().includes(term) ||
        loan.customer.toLowerCase().includes(term) ||
        loan.phone.includes(term);

      const matchesStatus =
        !status || loan.status === status;

      return matchesSearch && matchesStatus;

    });

    if (!filtered.length) {
      table.innerHTML = `
        <tr>
          <td colspan="8" class="loan-empty">
            No loans found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = filtered.map(loan => `
      <tr>
        <td>${escapeHTML(loan.id)}</td>
        <td>${escapeHTML(loan.customer)}</td>
        <td>${escapeHTML(loan.phone)}</td>
        <td>${money(loan.principal)}</td>
        <td>${money(loan.balance)}</td>
        <td>${escapeHTML(loan.dueDate)}</td>
        <td>
          <span class="loan-badge loan-${escapeHTML(loan.status)}">
            ${escapeHTML(loan.status)}
          </span>
        </td>
        <td>
          <button class="loan-view-btn"
            data-id="${escapeHTML(loan.id)}">
            View
          </button>
        </td>
      </tr>
    `).join("");
  }

  table.addEventListener("click", event => {

    const button = event.target.closest("[data-id]");
    if (!button) return;

    const loan = loans.find(l => l.id === button.dataset.id);
    if (!loan) return;

    document.getElementById("detailLoanId").textContent = loan.id;
    document.getElementById("detailCustomer").textContent = loan.customer;
    document.getElementById("detailPrincipal").textContent =
      money(loan.principal);
    document.getElementById("detailBalance").textContent =
      money(loan.balance);
    document.getElementById("detailRepaid").textContent =
      money(loan.repaid);
    document.getElementById("detailDueDate").textContent = loan.dueDate;
    document.getElementById("detailStatus").textContent = loan.status;
    document.getElementById("detailCharges").textContent =
      money(loan.charges);

    modal.style.display = "block";
  });

  document.getElementById("closeLoanModal")
    .addEventListener("click", () => {
      modal.style.display = "none";
    });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  search.addEventListener("input", renderLoans);
  filter.addEventListener("change", renderLoans);

  updateStats();
  renderLoans();

});
