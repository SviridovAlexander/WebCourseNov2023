document.addEventListener("DOMContentLoaded", function () {
    const celsiusTemperatureTextField = document.getElementById("celsius-temperature-text-field");
    const outputTextBlock = document.querySelector(".output-text-block");

    function convertCelsiusToKelvin(celsius) {
        return celsius + 273.15;
    }

    function convertCelsiusToFahrenheit(celsius) {
        return celsius * 1.8 + 32;
    }

    document.getElementById("converter-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const celsiusTemperatureString = celsiusTemperatureTextField.value;

        if (celsiusTemperatureString.length === 0) {
            outputTextBlock.textContent = "Please fill in the field";
            outputTextBlock.classList.add("error-message");
            celsiusTemperatureTextField.classList.add("input-field-error");
            return;
        }

        if (isNaN(parseFloat(celsiusTemperatureString))) {
            outputTextBlock.textContent = "Incorrect input";
            outputTextBlock.classList.add("error-message");
            celsiusTemperatureTextField.classList.add("input-field-error");
            return;
        }

        celsiusTemperatureTextField.value = "";
        outputTextBlock.classList.remove("error-message");
        celsiusTemperatureTextField.classList.remove("input-field-error");

        const celsiusTemperature = parseFloat(celsiusTemperatureString);
        outputTextBlock.textContent = celsiusTemperatureString +
            " °Celsius = " +
            convertCelsiusToKelvin(celsiusTemperature).toFixed(3) +
            " °Kelvin = " +
            convertCelsiusToFahrenheit(celsiusTemperature).toFixed(3) +
            " °Fahrenheit";
    });
});