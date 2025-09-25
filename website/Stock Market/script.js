// Mock stock data
let stocks = [
  { name: "Apple Inc", ticker: "AAPL", sector: "Tech", price: 172 },
  { name: "Microsoft Corp", ticker: "MSFT", sector: "Tech", price: 315 },
  { name: "Goldman Sachs", ticker: "GS", sector: "Finance", price: 365 },
  { name: "Tesla Inc", ticker: "TSLA", sector: "Energy", price: 255 },
  { name: "Reliance Energy", ticker: "REL", sector: "Energy", price: 90 }
];

// Display stocks on home page
function loadStocks() {
  if ($("#stockTableBody").length) {
    let search = $("#searchInput").val().toLowerCase();
    let sector = $("#sectorFilter").val();

    $("#stockTableBody").empty();
    stocks.forEach(stock => {
      if (
        (stock.name.toLowerCase().includes(search) ||
         stock.ticker.toLowerCase().includes(search)) &&
        (sector === "" || stock.sector === sector)
      ) {
        let row = `
          <tr onclick="viewDetails('${stock.ticker}')">
            <td>${stock.name}</td>
            <td>${stock.ticker}</td>
            <td>${stock.sector}</td>
            <td>$${stock.price}</td>
          </tr>
        `;
        $("#stockTableBody").append(row);
      }
    });
  }
}

// Navigate to details page with query param
function viewDetails(ticker) {
  window.location.href = `details.html?ticker=${ticker}`;
}

// Stock details page
function loadDetails() {
  if ($("#stockName").length) {
    let params = new URLSearchParams(window.location.search);
    let ticker = params.get("ticker");
    let stock = stocks.find(s => s.ticker === ticker);

    if (stock) {
      $("#stockName").text(stock.name);
      $("#stockTicker").text(stock.ticker);
      $("#stockSector").text(stock.sector);
      $("#stockPrice").text(stock.price);

      // Chart demo data
      let ctx = document.getElementById("priceChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [{
            label: "Price ($)",
            data: [
              stock.price - 5,
              stock.price - 3,
              stock.price,
              stock.price + 2,
              stock.price
            ],
            borderColor: "blue",
            fill: false
          }]
        }
      });
    }
  }
}

// Attach listeners
$(document).ready(function () {
  loadStocks();
  loadDetails();

  $("#searchInput, #sectorFilter").on("input change", loadStocks);

  // Simulate real-time updates every 5s
  setInterval(() => {
    stocks.forEach(s => {
      s.price += (Math.random() * 4 - 2).toFixed(2) * 1;
    });
    loadStocks();
    loadDetails();
  }, 5000);
});
