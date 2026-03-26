'use strict';
let numbersArray = [];

function getNumbersFromUser() {
    // Reset the array
    numbersArray = [];
    while (true) {
        let userInput = prompt("Enter a number (or 'done' to finish):");
        // Check if user wants to stop
        if (userInput === null || userInput.toLowerCase() === 'done') {
            break;
        }
        let number = parseFloat(userInput);
        if (!isNaN(number)) {
            // Add the number to the array
            numbersArray.push(number);
        } else {
            alert("Invalid input! Please enter a valid number or 'done' to finish.");
        }
    }
    return numbersArray;
}

function extractAndDisplayEvenNumbers() {
    let resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    // Check if array is empty
    if (numbersArray.length === 0) {
        resultsContainer.innerHTML = '<p>No numbers were entered.</p>';
        return;
    }
    // Array to store even numbers
    let evenNumbers = [];
    for (let number of numbersArray) {
        if (number % 2 === 0) {
            evenNumbers.push(number);
        }
    }
    // Display the even numbers on the HTML document
    if (evenNumbers.length > 0) {
        // Join the even numbers with comma and space
        let evenNumbersString = evenNumbers.join(', ');
        resultsContainer.innerHTML = `
            <p class="even-numbers">Even Numbers: ${evenNumbersString}</p>
        `;
    } else {
        // Display message if no even numbers found
        resultsContainer.innerHTML = `
            <p class="no-even">Even Numbers: None</p>
        `;
    }
    
    // After the loop completes, display a message indicating the end of the program
    let endMessage = document.createElement('div');
    endMessage.className = 'end-message';
    endMessage.innerHTML = `<strong>Program Completed</strong>
    <br>All numbers have been processed.`;
    resultsContainer.appendChild(endMessage);
}

function main() {
    getNumbersFromUser();
    extractAndDisplayEvenNumbers();
}

// Event listener for the start button
document.getElementById('start-extractor').addEventListener('click', main);