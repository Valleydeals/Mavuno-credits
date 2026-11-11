"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const payments = [];

  const paymentsTable = document.getElementById("paymentsTable");
  const paymentSearch = document.getElementById("paymentSearch");
  const statusFilter = document.getElementById("statusFilter");
  const paymentModal = document.getElementById("paymentModal");
  const paymentDetails = document.getElementById("paymentDetails");
  const closeModal = document.getElementById("closeModal");

  const money = amount =>
    "KSh " + Number(amount || 0).toLocaleString("en-KE");

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function updateStatistics() {
    const successful = payments.filter(
      payment => payment.status === "successful"
    );

    const pending = payments.filter(
      payment => payment.status === "pending"
    );

    const totalReceived = successful.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    document.getElementById("totalPayments").textContent =
      payments.length;

    document.getElementById("successfulPayments").textContent =
      successful.length;

    document.getElementById("pendingPayments").textContent =
      pending.length;

    document.getElementById("totalReceived").textContent =
      money(totalReceived);
  }

  function renderPayments() {
    const search = paymentSearch.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const filtered = payments.filter(payment => {
      const searchable = [
        payment.reference,
        payment.phone,
        payment.loanId,
        payment.customer,
        payment.mpesaReceipt
      ].join(" ").toLowerCase();

      const matchesSearch = searchable.includes(search);

      const matchesStatus =
        selectedStatus === "all" ||
        payment.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    if (!filtered.length) {
      paymentsTable.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            No matching payment records found.
          </td>
        </tr>
      `;
      return;
    }

    paymentsTable.innerHTML = filtered.map(payment => `
      <tr>
        <td>${escapeHTML(payment.reference)}</td>
        <td>${escapeHTML(payment.customer)}</td>
        <td>${escapeHTML(payment.phone)}</td>
        <td>${escapeHTML(payment.loanId)}</td>
        <td>${money(payment.amount)}</td>
        <td>${escapeHTML(payment.method)}</td>
        <td>${escapeHTML(payment.date)}</td>
        <td>
          <span class="status ${escapeHTML(payment.status)}">
            ${escapeHTML(payment.status)}
          </span>
        </td>
        <td>
          <button class="action-btn"
            data-reference="${escapeHTML(payment.reference)}">
            View
          </button>
        </td>
      </tr>
    `).join("");
  }

  function showPaymentDetails(reference) {
    const payment = payments.find(
      item => item.reference === reference
    );

    if (!payment) return;

    const details = [
      ["Payment Reference", payment.reference],
      ["Customer", payment.customer],
      ["Phone Number", payment.phone],
      ["Loan ID", payment.loanId],
      ["Amount", money(payment.amount)],
      ["Payment Method", payment.method],
      ["M-Pesa Receipt", payment.mpesaReceipt || "Not available"],
      ["Transaction Date", payment.date],
      ["Status", payment.status]
    ];

    paymentDetails.innerHTML = details.map(([label, value]) => `
      <div class="detail-row">
        <span>${escapeHTML(label)}</span>
        <strong>${escapeHTML(value)}</strong>
      </div>
    `).join("");

    paymentModal.style.display = "flex";
  }

  paymentsTable.addEventListener("click", event => {
    const button = event.target.closest("[data-reference]");
    if (!button) return;

    showPaymentDetails(button.dataset.reference);
  });

  paymentSearch.addEventListener("input", renderPayments);
  statusFilter.addEventListener("change", renderPayments);

  closeModal.addEventListener("click", () => {
    paymentModal.style.display = "none";
  });

  paymentModal.addEventListener("click", event => {
    if (event.target === paymentModal) {
      paymentModal.style.display = "none";
    }
  });

  updateStatistics();
  renderPayments();

  // DEMO ONLY:
  // Real payment records will be loaded from the secured backend.
  // Never mark a payment successful from frontend code.
});
