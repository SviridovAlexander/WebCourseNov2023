(function () {
    function sortDescending(array) {
        return array.sort((e1, e2) => e2 - e1);
    }

    function getFirstElements(array, elementsCount) {
        return array.slice(0, elementsCount);
    }

    function getLastElements(array, elementsCount) {
        return array.slice(-elementsCount);
    }

    function calculateEvenNumbersSum(array) {
        return array
            .filter(number => number % 2 === 0)
            .reduce((sum, number) => sum + number, 0);
    }

    function getArrayWithNumbersFromTo(startNumber, endNumber) {
        const array = [];

        for (let i = startNumber; i <= endNumber; i++) {
            array.push(i);
        }

        return array;
    }

    function getEvenNumbersSquaresArray(array) {
        return array
            .filter(number => number % 2 === 0)
            .map(number => number * number);
    }

    const numbers = [1, 5, 10, -20, 30, 6, 7, 100, 13, 75];

    console.log("Sorted in descending order:", sortDescending(numbers));
    console.log("First 5 elements:", getFirstElements(numbers, 5));
    console.log("Last 5 elements:", getLastElements(numbers, 5));
    console.log("Sum of even numbers:", calculateEvenNumbersSum(numbers));
    console.log("Squares of even numbers from 1 to 100:", getEvenNumbersSquaresArray(getArrayWithNumbersFromTo(1, 100)));
})();