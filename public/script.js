document.querySelectorAll("[data-confirm-delete]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!window.confirm("Delete this card from the inventory?")) event.preventDefault();
  });
});
