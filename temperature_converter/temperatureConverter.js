document.addEventListener("DOMContentLoaded", function () {
    const inputTextField = document.getElementById("input-text-field");
    const outputTextBlock = document.querySelector(".output-text-block");

    document.getElementById("converter-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const inputText = inputTextField.value;

        if (inputText.length === 0) {
            outputTextBlock.textContent = "Please fill in the field";
            outputTextBlock.classList.add("error-message");
            inputTextField.classList.add("input-field-error")
            return;
        }

        if (isNaN(inputText)) {
            outputTextBlock.textContent = "Incorrect input";
            outputTextBlock.classList.add("error-message");
            inputTextField.classList.add("input-field-error")
            return;
        }

        inputTextField.value = "";
        outputTextBlock.classList.remove("error-message");
        inputTextField.classList.remove("input-field-error")

        outputTextBlock.textContent = inputText +
            " °Celsius = " +
            parseFloat((parseFloat(inputText) + 273.15).toFixed(3)) +
            " °Kelvin = " +
            parseFloat((inputText * 1.8 + 32).toFixed(3)) +
            " °Fahrenheit";
    });
});