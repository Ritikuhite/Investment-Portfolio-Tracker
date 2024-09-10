// LocalStorageService class
class LocalStorageService {
  constructor() {
    this.storage = window.localStorage;
    this.dataKey = 'investments';
  }

  saveData(data) {
    const dataString = JSON.stringify(data);
    this.storage.setItem(this.dataKey, dataString);
  }

  getData() {
    const dataString = this.storage.getItem(this.dataKey);
    return dataString ? JSON.parse(dataString) : [];
  }
}

// Create an instance of the LocalStorageService
const localStorageService = new LocalStorageService();

// Load investments from local storage
let investments = [...localStorageService.getData()];

// If no investments are found, initialize an empty array
if (!investments.length) {
  // Create two default entries for empty array 
  investments = [
    { name: 'Apple', invested: 1000, current: 1200 },
    { name: 'Google', invested: 500, current: 600 }
  ];
}

// Chart initialization
// Ensure the DOM is fully loaded before running the script
// window.onload = function() {
// Chart initialization
const ctx = document.getElementById("asset-distribution-chart");
const chartData = {
  labels: investments.map(investment => investment.name),
  datasets: [{
    label: 'Asset Distribution',
    data: investments.map(investment => investment.invested),
    backgroundColor: ["#ff6384", "#36a2eb", "#ffeebb", "#eee", "#13e8ab"],
    hoverOffset: 4
  }]
};

const assetDistributionChart = new Chart(ctx, {
  type: 'pie',
  data: chartData,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Investment Asset Distribution'
      }
    }
  }
});

// Initial call to populate the table on page load
updateTable();
// Function to update chart data
function updateChartData() {
  assetDistributionChart.data.labels = investments.map(investment => investment.name);
  assetDistributionChart.data.datasets[0].data = investments.map(investment => investment.invested);
  assetDistributionChart.update();
}
updateChartData();
// };

// Save investments to local storage whenever the data changes
function saveInvestments() {
  localStorageService.saveData(investments);
}
 
// Function to calculate total investment value
function calculateTotalValue() {
  return investments.reduce((total, investment) => total + investment.current, 0);
}

// Function to update the table
let currentPage = 1;
let pageSize = 5;

function updateTable(page = 1, pageSize = 5) {
  const investmentList = document.getElementById('investment-list');
  investmentList.innerHTML = '';
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedInvestments = investments.slice(startIndex, endIndex);
  paginatedInvestments.forEach((investment, index) => {
    const row = document.createElement('tr');
    const percentChange = ((investment.current - investment.invested) / investment.invested * 100).toFixed(2) + '%';
    row.innerHTML = `
      <td>${investment.name}</td>
      <td>$${investment.invested}</td>
      <td>$${investment.current}</td>
      <td>${percentChange}</td>
      <td>
        <button onclick="updateInvestment(${startIndex + index})">Update</button>
        <button onclick="removeInvestment(${startIndex + index})">Remove</button>
      </td>
    `;
    investmentList.appendChild(row);
  });

  document.getElementById('total-value').innerText = calculateTotalValue();
  saveInvestments();
  // Update pagination controls
  const totalPages = Math.ceil(investments.length / pageSize);
  document.getElementById('page-no').innerText = `Page ${page} of ${totalPages}`;
  const prevButton = document.querySelector('.load-more button:first-child');
  const nextButton = document.querySelector('.load-more button:last-child');
  prevButton.disabled = page === 1;
  nextButton.disabled = page === totalPages;
  prevButton.onclick = () => updateTable(page - 1, pageSize);
  nextButton.onclick = () => updateTable(page + 1, pageSize);
}

// Initial call to populate the table on page load
updateTable();


// Function to update an investment
function updateInvestment(index) {
  document.querySelector(".update").classList.remove("hidden");
  document.getElementById('update-asset-name').value = investments[index].name;
  document.getElementById('update-amount-invested').value = investments[index].invested;
  document.getElementById('update-current-value').value = investments[index].current;

  document.getElementById('update-form').onsubmit = function (e) {
    e.preventDefault();
    investments[index].name = document.getElementById('update-asset-name').value;
    investments[index].invested = parseFloat(document.getElementById('update-amount-invested').value);
    investments[index].current = parseFloat(document.getElementById('update-current-value').value);
    document.querySelector(".update").classList.add("hidden");
    updateTable();
    updateChartData();
  };
}

// Function to remove an investment
function removeInvestment(index) {
  investments.splice(index, 1);
  updateTable();
  updateChartData();
}

// Function to add a new investment
function addInvestment(name, invested, current) {
  investments.push({ name, invested: parseFloat(invested), current: parseFloat(current) });
  updateTable();
  updateChartData();
}

// Toggle functionality of form
document.getElementById("add-new-investment").addEventListener("click", () => {
  const toggleInvestmentForm = document.querySelector(".investment-form-container");
  toggleInvestmentForm.classList.toggle("hidden");
  updateChartData()
});
document.getElementById('investment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('asset-name').value;
  const invested = parseFloat(document.getElementById('amount-invested').value);
  const current = parseFloat(document.getElementById('current-value').value);
  if (name && invested > 0 && current > 0) {
    addInvestment(name, invested, current);
    document.getElementById('asset-name').value = "";
    document.getElementById('amount-invested').value = "";
    document.getElementById('current-value').value = "";
    document.querySelector(".investment-form-container").classList.toggle("hidden")

  }
  else {
    alert("Please fill in all fields Correctly.")
  }
  updateChartData()
})

// Code for pagination

