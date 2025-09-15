const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

// Currency → Country flag mapping
const currencyToCountry = {
  USD: "us", INR: "in", EUR: "eu", GBP: "gb", JPY: "jp",
  AUD: "au", CAD: "ca", CNY: "cn", RUB: "ru", BRL: "br",
  ZAR: "za", CHF: "ch", SEK: "se", NZD: "nz", SGD: "sg",
  MXN: "mx", HKD: "hk", KRW: "kr", SAR: "sa", AED: "ae"
};

// Load currency list
async function loadCurrencies() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const currencies = Object.keys(data.rates);

  currencies.forEach(curr => {
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");

    option1.value = curr;
    option2.value = curr;

    option1.text = curr;
    option2.text = curr;

    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });

  fromSelect.value = "USD";
  toSelect.value = "INR";
  updateFlag(fromSelect, fromFlag);
  updateFlag(toSelect, toFlag);

  result.innerText = ""; // no default conversion
}

// Update flag when currency changes
function updateFlag(selectElement, flagElement) {
  const curr = selectElement.value;
  const countryCode = currencyToCountry[curr] || "un";
  flagElement.src = `https://flagcdn.com/24x18/${countryCode}.png`;
}

// Convert currency (only when button clicked)
async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (amount === "" || amount <= 0) {
    result.innerText = "Please enter a valid amount!";
    return;
  }

  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
  const data = await res.json();

  const rate = data.rates[to];
  const converted = (amount * rate).toFixed(2);

  result.innerText = `${amount} ${from} = ${converted} ${to}`;
}

// Event listeners
fromSelect.addEventListener("change", () => updateFlag(fromSelect, fromFlag));
toSelect.addEventListener("change", () => updateFlag(toSelect, toFlag));
convertBtn.addEventListener("click", convertCurrency);

// Load currencies on start
loadCurrencies();
