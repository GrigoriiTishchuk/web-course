function calculateDistance() {
    let x1Input = prompt("Enter x-coordinate for Point 1 (x1):");
    let y1Input = prompt("Enter y-coordinate for Point 1 (y1):");
    let x2Input = prompt("Enter x-coordinate for Point 2 (x2):");
    let y2Input = prompt("Enter y-coordinate for Point 2 (y2):");
    let x1 = parseFloat(x1Input);
    let y1 = parseFloat(y1Input);
    let x2 = parseFloat(x2Input);
    let y2 = parseFloat(y2Input);
    let resultDiv = document.getElementById("distance-result");

    // Validate all inputs
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        resultDiv.innerHTML = "<p style='color: red;'>Invalid input! Please enter valid numbers for all coordinates.</p>";
        return;
    }
    // Calculate Euclidean Distance
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    // Display the result in the HTML document
    resultDiv.innerHTML = `
        <p><strong>Point 1:</strong> (${x1}, ${y1})</p>
        <p><strong>Point 2:</strong> (${x2}, ${y2})</p>
        <p><strong>Distance:</strong> ${distance.toFixed(2)} units</p>
    `;
}