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
            .filter((e) => e % 2 === 0)
            .reduce((currentSum, currentNumber) => currentSum + currentNumber, 0);
    }

    function fillArrayWithNumbers(array, startNumber, finishNumber) {
        for (let i = startNumber; i <= finishNumber; i++) {
            array.push(i);
        }

        return array;
    }

    function getEvenNumbersSquaresList(array) {
        return array
            .filter((e) => e % 2 === 0)
            .map((evenNumber) => evenNumber * evenNumber);
    }

    const numbers = [1, 5, 10, -20, 30, 6, 7, 100, 13, 75];

    console.log(sortDescending(numbers));
    console.log(getFirstElements(numbers, 5));
    console.log(getLastElements(numbers, 5));
    console.log(calculateEvenNumbersSum(numbers));

    const numbersFrom1To100 = [];
    fillArrayWithNumbers(numbersFrom1To100, 1, 100);

    console.log(getEvenNumbersSquaresList(numbersFrom1To100));
})();