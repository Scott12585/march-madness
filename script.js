const API_KEY = 'AIzaSyCMB1FFzm5WR40cA0q_rZRI-JNLy9OnsXs';
const SHEET_ID = '11lGymWUKkBVr1UKjsdUNKSsMw2O9NGDpJVU6_6IaFHs';

// East Bracket configuration
const EAST_CONFIG = {
    sheetName: 'Round of 64',
    matchupRows: [11, 14, 17, 20, 23, 26, 29, 32],
    columns: {
        seed1: 3, college1: 5, spread1: 6, name1: 7, score1: 9,
        winner: 12, score2: 14, name2: 16, spread2: 17, college2: 18, seed2: 20
    }
};

document.addEventListener('DOMContentLoaded', loadEastBracket);

async function loadEastBracket() {
    const container = document.getElementById('sheet-container');
    
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Round%20of%2064!A:U?key=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const values = data.values || [];
        
        if (values.length === 0) {
            container.innerHTML = '<div class="error">No data found</div>';
            return;
        }
        
        const matchups = [];
        for (let rowIdx of EAST_CONFIG.matchupRows) {
            if (rowIdx < values.length) {
                const matchup = parseMatchup(values, rowIdx);
                if (matchup) matchups.push(matchup);
            }
        }
        
        container.innerHTML = renderMatchups(matchups);
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

function parseMatchup(values, rowIdx) {
    const c = EAST_CONFIG.columns;
    const row = values[rowIdx] || [];
    const row2 = values[rowIdx + 1] || [];
    
    return {
        seed1: getValue(row, c.seed1),
        college1: getValue(row, c.college1),
        spread1: getValue(row, c.spread1),
        name1: getValue(row, c.name1),
        score1: getValue(row, c.score1),
        winner: getValue(row2, c.winner),
        score2: getValue(row, c.score2),
        name2: getValue(row, c.name2),
        spread2: getValue(row, c.spread2),
        college2: getValue(row, c.college2),
        seed2: getValue(row, c.seed2)
    };
}

function getValue(row, colIdx) {
    return (row && row[colIdx]) ? row[colIdx].toString().trim() : '';
}

function renderMatchups(matchups) {
    let html = '<table style="width: 100%; border-collapse: collapse;"><tbody>';
    
    matchups.forEach((m, i) => {
        html += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.seed1}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.college1}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.name1}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.spread1}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee; font-weight: bold;">${m.score1}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee; font-weight: bold; color: #667eea;">VS</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee; font-weight: bold;">${m.score2}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.spread2}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.name2}</td>
                <td style="padding: 10px; text-align: center; border-right: 1px solid #eee;">${m.college2}</td>
                <td style="padding: 10px; text-align: center;">${m.seed2}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}
