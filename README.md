# Investment Tracker Application

This project is a simple Investment Tracker application that utilizes local storage to manage user investments. It allows users to add, update, and remove investments, while providing a visual representation of asset distribution using charts.

## Features

- **Local Storage Integration**: Saves investment data locally so that the data persists across page reloads.
- **Data Visualization**: Uses pie charts to visualize the distribution of investments.
- **Dynamic Table**: Displays investments in a paginated table format.
- **Investment Management**: Allows users to add, update, and remove investments easily.

## Setup

1. **HTML Structure**: Ensure you have the necessary HTML elements in place to bind the JavaScript functionality. Key elements include:
   - A `<canvas>` element for the chart rendering.
   - A table for displaying investments.
   - Forms for adding and updating investment entries.
   - Pagination controls.

2. **Dependencies**: Include [Chart.js](https://www.chartjs.org/) in your project for the charting functionality.

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
