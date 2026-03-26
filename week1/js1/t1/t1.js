function convertTemperature() {
    let celsiusInput = prompt("Enter temperature in Celsius:");
    let celsius = parseFloat(celsiusInput);
    let resultDiv = document.getElementById("temp-result");
    // Validate input
    if (isNaN(celsius)) {
        resultDiv.innerHTML = "<p style='color: red;'>Invalid input! Please enter a valid number.</p>";
        return;
    }
    let fahrenheit = (celsius * 9/5) + 32;
    let kelvin = celsius + 273.15;
    // Display the converted temperatures in the HTML document
    resultDiv.innerHTML = `
        <p><strong>Celsius:</strong> ${celsius.toFixed(2)}°C</p>
        <p><strong>Fahrenheit:</strong> ${fahrenheit.toFixed(2)}°F</p>
        <p><strong>Kelvin:</strong> ${kelvin.toFixed(2)}K</p>
    `;
}