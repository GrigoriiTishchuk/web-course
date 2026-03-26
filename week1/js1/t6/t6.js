
let userInput = prompt("Enter a positive integer:");
//Convert the user's input from a string to a number
let number = parseInt(userInput);
let container = document.getElementById("result-container");
// Validate input to ensure it is a positive number
if (isNaN(number) || number < 1) {
    container.innerHTML = "<p style='color: red;'>Please refresh and enter a valid positive integer.</p>";
} else {
    container.innerHTML += "<h2>Multiplication Table for " + number + "</h2>";
    // Start building the HTML table string
    let tableHTML = "<table>";
    //Rows
    for (let i = 1; i <= number; i++) {
        tableHTML += "<tr>";
        //Columns
        for (let j = 1; j <= number; j++) {
            //Calculate the product of the current row and column values
            let product = i * j;
            // Display each product in a formatted table cell
            tableHTML += "<td>" + product + "</td>";
        }
        // End the table row
        tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    container.innerHTML += tableHTML;
}