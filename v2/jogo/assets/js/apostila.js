(function () {
  "use strict";

  const detailsState = new Map();
  const details = Array.from(document.querySelectorAll("details"));

  function rememberDetails() {
    details.forEach((item, index) => detailsState.set(index, item.open));
  }

  function openForPrint() {
    details.forEach((item) => {
      item.dataset.wasOpen = item.open ? "true" : "false";
      item.open = true;
    });
  }

  function restoreAfterPrint() {
    details.forEach((item) => {
      if (item.dataset.wasOpen) item.open = item.dataset.wasOpen === "true";
    });
  }

  document.getElementById("printButton")?.addEventListener("click", () => window.print());
  window.addEventListener("beforeprint", openForPrint);
  window.addEventListener("afterprint", restoreAfterPrint);
  rememberDetails();
})();
