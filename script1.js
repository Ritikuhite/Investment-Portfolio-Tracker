// Investment array of Object
const investments = [
    { name: 'Apple', invested: 1000, current: 1200 },
    { name: 'Google', invested: 500, current: 600 }
];
// calculate total investment

function calculateTotalValue() {
    return investments.reduce((total, investment) => total + investment.current, 0);
}

// create new Entries for investment list 
function updateTable() {
    const investmentList = document.getElementById('investment-list');
    investmentList.innerHTML = '';
    investments.forEach((investment, index) => {
        const row = document.createElement('tr');
        const percentChange = ((investment.current - investment.invested) / investment.invested * 100).toFixed(2) + '%';
        row.innerHTML = `
            <td>${investment.name}</td>
            <td>$${investment.invested}</td>
            <td>$${investment.current}</td>
            <td>${percentChange}</td>
            <td>
                <button onclick="updateInvestment(${index})">Update</button>
                <button onclick="removeInvestment(${index})">Remove</button>
            </td>
        `;
        investmentList.appendChild(row);
    });

    document.getElementById('total-value').innerText = calculateTotalValue();
}


function updateInvestment(index) {
    const name = prompt("Enter new asset name:", investments[index].name);
    const invested = prompt("Enter new invested amount:", investments[index].invested);
    const current = prompt("Enter new current value:", investments[index].current);
    investments[index] = { name, invested: parseFloat(invested), current: parseFloat(current) };
    updateTable();
    updateChartData()//call the updateChartData function for more sync pie
}

function removeInvestment(index) {
    investments.splice(index, 1);
    updateTable();
    updateChartData(); // Call the updateChartData function

}
function addInvestment(name, invested, current) {
    investments.push({ name, invested: parseFloat(invested), current: parseFloat(current) });
    updateTable();
    updateChartData(); // Call the updateChartData function

}
// Toggle funuctionality of form 
document.getElementById("add-new-investment").addEventListener("click", () => {
    const toggleInvestmentForm = document.querySelector(".investment-form-container");
    toggleInvestmentForm.classList.toggle("hidden");
});
document.getElementById('investment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const name = formData.get('asset-name');
    // const invested = formData.get('amount-invested');
    // const current = formData.get('current-value');
    const name = document.getElementById('asset-name').value;
    const invested = parseFloat(document.getElementById('amount-invested').value);
    const current = parseFloat(document.getElementById('current-value').value); 
    
    if (name && invested && current) {
        addInvestment(name, invested, current);
        name.value="";
        invested.value="";
        current.value="";
        document.querySelector(".investment-form-container").classList.toggle("hidden");
    } else {
        alert("Please fill in all fields.");
    }

});
// Initial call to populate the table on page load
updateTable();

// Chart initialization
const ctx = document.getElementById("asset-distribution-chart");
const chartData = {
    labels: investments.map(investment => investment.name),
    datasets: [{
        label: 'Asset Distribution',
        data: investments.map(investment => (investment.invested)),
        backgroundColor: ["#ff6384", "#36a2eb","#ffeebb","#eee","#13e8ab"],
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

// profit chart code 

// Function to update chart data
function updateChartData() {
    assetDistributionChart.data.labels = investments.map(investment => investment.name);
    assetDistributionChart.data.datasets[0].data = investments.map(investment => investment.invested);
    assetDistributionChart.update();
}