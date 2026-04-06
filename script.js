const API_KEY = 'AIzaSyCMB1FFzm5WR40cA0q_rZRI-JNLy9OnsXs';
const SHEET_ID = '11lGymWUKkBVr1UKjsdUNKSsMw2O9NGDpJVU6_6IaFHs';
const SHEET_NAMES = ['Round of 64', 'Round of 32', 'Sweet Sixteen', 'Elite Eight', 'Final Four'];

let currentSheet = 'Round of 64';

// Bracket region definitions (column indices and row starts)
const BRACKET_REGIONS = {
    'East': {
        name: 'EAST BRACKET',
        startRow: 11, // D10 is header, data starts at D12
        matchupRows: [12, 15, 18, 21, 24, 27, 30, 33], // rows where matchups start
        cols: {
            seed1: 3,     // D
            logo1: 4,     // E
            college1: 5,  // F
            spread1: 6,   // G
            name1: 7,     // H
            score1: 9,    // J
            winner: 12,   // M
            score2: 14,   // O
            name2: 16,    // Q
            spread2: 17,  // R
            college2: 18, // S
            logo2: 19,    // T
            seed2: 20     // U
        }
    },
    'South': {
        name: 'SOUTH BRACKET',
        startRow: 11,
        matchupRows: [12, 15, 18, 21, 24, 27, 30, 33],
        cols: { /* same as East, but different starting column */ }
    },
    'West': {
        name: 'WEST BRACKET',
        startRow: 11,
        matchupRows: [12, 15, 18, 21, 24, 27, 30, 33],
        cols: { /* same as East, but different starting column */ }
    },
    'Midwest': {
        name: 'MIDWEST BRACKET',
        startRow: 11,
        matchupRows: [12, 15, 18, 21, 24, 27, 30, 33],
        cols: { /* same as East, but different starting column */ }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadSheet(currentSheet);
    setupTabListeners();
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
    container.innerHTML = '<div class="loading">Loading bracket data...</div>';

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/'${sheetName}'!A:Z?key=${API_KEY}`;
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

        // Parse and render brackets
        const bracketsHTML = renderBrackets(values);
        container.innerHTML = bracketsHTML;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-updated').textContent = `Last updated: ${timeString}`;

    } catch (error) {
        console.error('Error loading sheet:', error);
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

function renderBrackets(values) {
    let html = '<div class="brackets-container">';

    // Parse each bracket region
    for (const [region, config] of Object.entries(BRACKET_REGIONS)) {
        html += renderBracketRegion(region, config, values);
    }

    html += '</div>';
    return html;
}

function renderBracketRegion(regionName, config, values) {
    let html = `<div class="bracket-region">
        <h2>${config.name}</h2>
        <div class="matchups">`;

    // Parse each matchup in this region
    config.matchupRows.forEach(rowIndex => {
        const matchup = parseMatchup(rowIndex, config, values);
        if (matchup) {
            html += renderMatchup(matchup);
        }
    });

    html += '</div></div>';
    return html;
}

function parseMatchup(rowIndex, config, values) {
    // rowIndex is the 1-based row number; values array is 0-based
    const row = rowIndex - 1;

    if (!values[row]) return null;

    const cols = config.cols;
    
    return {
        seed1: getValue(values, row, cols.seed1),
        college1: getValue(values, row, cols.college1),
        spread1: getValue(values, row, cols.spread1),
        name1: getValue(values, row, cols.name1),
        score1: getValue(values, row, cols.score1),
        winner: getValue(values, row + 1, cols.winner),
        score2: getValue(values, row, cols.score2),
        name2: getValue(values, row, cols.name2),
        spread2: getValue(values, row, cols.spread2),
        college2: getValue(values, row, cols.college2),
        seed2: getValue(values, row, cols.seed2)
    };
}

function getValue(values, rowIdx, colIdx) {
    if (values[rowIdx] && values[rowIdx][colIdx]) {
        return values[rowIdx][colIdx];
    }
    return '';
}

function renderMatchup(matchup) {
    return `
    <div class="matchup">
        <div class="team left">
            <div class="seed">${matchup.seed1}</div>
            <div class="info">
                <div class="college">${matchup.college1}</div>
                <div class="name">${matchup.name1}</div>
                <div class="spread">${matchup.spread1}</div>
            </div>
            <div class="score">${matchup.score1}</div>
        </div>
        <div class="vs">
            ${matchup.winner ? `<div class="winner">${matchup.winner}</div>` : '<div class="vs-text">VS</div>'}
        </div>
        <div class="team right">
            <div class="seed">${matchup.seed2}</div>
            <div class="info">
                <div class="college">${matchup.college2}</div>
                <div class="name">${matchup.name2}</div>
                <div class="spread">${matchup.spread2}</div>
            </div>
            <div class="score">${matchup.score2}</div>
        </div>
    </div>`;
}
