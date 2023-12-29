document.addEventListener("DOMContentLoaded", function () {
    const inputTextField = document.getElementById("temperature-celsius-input-text-field");
    const outputTextBlock = document.querySelector(".output-text-block");

    document.getElementById("converter-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const temperatureCelsiusInputString = inputTextField.value;

        if (temperatureCelsiusInputString.length === 0) {
            outputTextBlock.textContent = "Please fill in the field";
            outputTextBlock.classList.add("error-message");
            inputTextField.classList.add("input-field-error");
            return;
        }

        if (isNaN(parseFloat(temperatureCelsiusInputString))) {
            outputTextBlock.textContent = "Incorrect input";
            outputTextBlock.classList.add("error-message");
            inputTextField.classList.add("input-field-error");
            return;
        }

        inputTextField.value = "";
        outputTextBlock.classList.remove("error-message");
        inputTextField.classList.remove("input-field-error");

        outputTextBlock.textContent = temperatureCelsiusInputString +
            " °Celsius = " +
            celsiusToKelvin(parseFloat(temperatureCelsiusInputString)) +
            " °Kelvin = " +
            celsiusToFahrenheit(parseFloat(temperatureCelsiusInputString)) +
            " °Fahrenheit";
    });

    function celsiusToKelvin(celsius) {
        return (celsius + 273.15).toFixed(3);
    }

    function celsiusToFahrenheit(celsius) {
        return (celsius * 1.8 + 32).toFixed(3);
    }
});