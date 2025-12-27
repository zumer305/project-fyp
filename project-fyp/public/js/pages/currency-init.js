// Currency Converter Initialization
// Initializes the navbar currency selector and sets up event listeners

document.addEventListener("DOMContentLoaded", async function () {
  const currencySelect = document.getElementById("navbar-currency-select");

  if (currencySelect && typeof CurrencyConverter !== "undefined") {
    // Set initial value from localStorage
    const savedCurrency = CurrencyConverter.getUserCurrency();
    currencySelect.value = savedCurrency;

    // Convert all prices on initial load
    await CurrencyConverter.convertAllPrices();

    // Handle currency change
    currencySelect.addEventListener("change", async function (e) {
      const newCurrency = e.target.value;
      CurrencyConverter.setUserCurrency(newCurrency);

      // Convert all prices immediately
      await CurrencyConverter.convertAllPrices();

      // Dispatch event for other scripts to listen to
      const event = new CustomEvent("currencyChanged", {
        detail: { currency: newCurrency },
      });
      document.dispatchEvent(event);
    });
  }
});
