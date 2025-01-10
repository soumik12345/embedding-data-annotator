// Get the canvas and context
const canvas = document.getElementById('chartCanvas');
const ctx = canvas.getContext('2d');

// Data points array
const points = [
    { x: 100, y: 100, selected: false },
    { x: 200, y: 200, selected: false },
    { x: 300, y: 150, selected: false },
    // Add more points as needed
];

// Point properties
const pointRadius = 10;

// Variables for dragging
let selectedPoint = null;
let offsetX, offsetY;

/**
 * Draws grid lines and labels for the axes
 */
function drawGridAndAxes() {
    ctx.save();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.font = '10px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'start';

    const step = 50; // distance between grid lines

    // Draw vertical grid lines and x-axis labels
    for (let x = 0; x <= canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.closePath();

        // Label for the x-axis along the top
        ctx.fillText(x, x + 2, 10);
    }

    // Draw horizontal grid lines and y-axis labels
    // In canvas, y=0 is at the top, so it might appear "inverted" 
    // compared to a traditional Cartesian plane.
    for (let y = 0; y <= canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.closePath();

        // Label for the y-axis
        // Adjust label position so it doesn't overlap the line
        ctx.fillText(y, 2, y - 2);
    }

    ctx.restore();
}

/**
 * Render function - clears canvas, draws grid/axes, then plots the points
 */
function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid and axes
    drawGridAndAxes();

    // Draw all points
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    });
}

/**
 * Checks if mouse is over a particular point
 * @param x {number} - mouse x position
 * @param y {number} - mouse y position
 * @param point {object} - the point to check
 * @returns {boolean}
 */
function isPointClicked(x, y, point) {
    const dx = x - point.x;
    const dy = y - point.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= pointRadius;
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if a point is clicked
    points.forEach(point => {
        if (isPointClicked(mouseX, mouseY, point)) {
            point.selected = true;
            selectedPoint = point;
            offsetX = mouseX - point.x;
            offsetY = mouseY - point.y;
        } else {
            point.selected = false;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedPoint) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Update point position
        selectedPoint.x = mouseX - offsetX;
        selectedPoint.y = mouseY - offsetY;

        // Render the updated points
        render();
    }
});

canvas.addEventListener('mouseup', () => {
    selectedPoint = null;
});

// Initial render
render();