const API_KEY = 'AIzaSyCMB1FFzm5WR40cA0q_rZRI-JNLy9OnsXs';
const SHEET_ID = '11lGymWUKkBVr1UKjsdUNKSsMw2O9NGDpJVU6_6IaFHs';
const SHEET_NAMES = ['Round of 64', 'Round of 32', 'Sweet Sixteen', 'Elite Eight', 'Final Four'];

let currentSheet = 'Round of 64';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSheet(currentSheet);
    setupTabListeners();
    // Auto-refresh every 5 minutes (300000 ms)
    setInterval(() => loadSheet(currentSheet), 300000);
});

function setupTabListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentSheet = button.dataset.sheet;
            loadSheet(currentSheet);
        });
    });
}

async function loadSheet(sheetName) {
    const container = document.getElementById('sheet-container');
    container.innerHTML = '<div class="loading">Loading data...</div>';

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A:Z?key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const values = data.values || [];

        if (values.length === 0) {
            container.innerHTML = '<div class="error">No data found in this sheet.</div>';
            return;
        }

        // Create table
        const table = createTable(values);
        container.innerHTML = '';
        container.appendChild(table);

        // Update last updated time
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-updated').textContent = `Last updated: ${timeString}`;

    } catch (error) {
        console.error('Error loading sheet:', error);
        container.innerHTML = `<div class="error">Error loading sheet: ${error.message}</div>`;
    }
}

function createTable(values) {
    const table = document.createElement('table');

    // Header row
    if (values.length > 0) {
        const headerRow = document.createElement('tr');
        values[0].forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell || '';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    }

    // Data rows
    for (let i = 1; i < values.length; i++) {
        const row = document.createElement('tr');
        values[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        table.appendChild(row);
    }

    return table;
}