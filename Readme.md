# March Madness 2026

A dynamic, mobile-responsive viewer for your March Madness bracket data stored in Google Sheets.

## Features

✅ Multi-sheet support with tab navigation  
✅ Mobile-responsive design  
✅ Auto-refresh every 5 minutes  
✅ Real-time updates from Google Sheets  
✅ Clean, professional UI  

## Your Site

**Live at:** https://scott12585.github.io/march-madness

## How It Works

- Fetches data from your Google Sheet using the Sheets API
- Displays all 5 brackets: Round of 64, Round of 32, Sweet Sixteen, Elite Eight, Final Four
- Auto-refreshes data every 5 minutes
- Fully responsive on mobile, tablet, and desktop

## Customization

**Edit `script.js` to:**
- Change refresh interval (find `300000`): 60000 = 1 min, 120000 = 2 min, etc.
- Add or remove sheets: modify `SHEET_NAMES` array
- Change column range: modify the `range` variable

**Edit `styles.css` to:**
- Customize colors, fonts, and layout
- Adjust for your branding

## Troubleshooting

**"Error loading sheet"** - Check that:
- Your Google Sheet is published to the web
- Sheet names match exactly (case-sensitive)
- You haven't hit API rate limits (1000 requests per 100 seconds)

For more help, check browser console (F12 → Console tab) for error messages.
