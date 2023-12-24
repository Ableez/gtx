const data = [
  {
    product: "crypto",
    vendor: "Ethereum",
    amount: 10400,
    status: "completed",
    isApproved: true,
    date: "2023-04-01T00:00:00.000Z",
  },
  {
    product: "giftcard",
    vendor: "Apple",
    amount: 204,
    status: "pending",
    isApproved: false,
    date: "2023-04-01T00:00:00.000Z",
  },
];

// Generate 10 more random objects
for (let i = 0; i < 15; i++) {
  const obj = {
    product: generateRandomProduct(),
    amount: generateRandomAmount(),
    status: generateRandomStatus(),
    isApproved: Math.random() < 0.5,
    date: generateRandomDate(),
  };
  data.push({
    product: obj.product,
    vendor:
      obj.product === "giftcard"
        ? generateRandomGVendor()
        : obj.product === "crypto"
        ? generateRandomBVendor()
        : "_error_",
    amount: generateRandomAmount(),
    status: generateRandomStatus(),
    isApproved: obj.status === "completed" ? true : false,
    date: generateRandomDate(),
  });
}

console.log(data);

function generateRandomProduct() {
  const products = ["crypto", "giftcard"];
  return products[Math.floor(Math.random() * products.length)];
}

function generateRandomBVendor() {
  const vendors = [
    "Bitcoin (BTC)",
    "Ethereum (ETH)",
    "Tether (USDT)",
    "Binance Coin (BNB)",
    "USD Coin (USDC)",
    "XRP (XRP)",
    "Cardano (ADA)",
    "Solana (SOL)",
    "Dogecoin (DOGE)",
    "Binance USD (BUSD)",
  ];
  return vendors[Math.floor(Math.random() * vendors.length)];
}
function generateRandomGVendor() {
  const vendors = [
    "Macy's",
    "Steam",
    "Google Play",
    "Amazon",
    "Nike",
    "Visa",
    "Amazon",
    "Walmart",
  ];
  return vendors[Math.floor(Math.random() * vendors.length)];
}

function generateRandomAmount() {
  return Math.floor(Math.random() * 1000) + 1;
}

function generateRandomStatus() {
  const statuses = ["completed", "pending", "cancelled", "rejected"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateRandomDate() {
  const minDate = new Date(2023, 11, 1); // January 1st, 2023
  const maxDate = new Date(2023, 11, 11); // December 31st, 2023
  return new Date(
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
  ).toISOString();
}
