(function () {
    function getMaxCitiesCountCountries(countries) {
        let maxCitiesCount = 0;
        let maxCitiesCountCountries = [];

        countries.forEach(country => {
            if (country.cities.length > maxCitiesCount) {
                maxCitiesCount = country.cities.length;
                maxCitiesCountCountries = [country];
            } else if (country.cities.length === maxCitiesCount) {
                maxCitiesCountCountries.push(country);
            }
        });

        return maxCitiesCountCountries;
    }

    function getCountriesPopulations(countries) {
        const countriesPopulations = {};

        countries.forEach(country => {
            countriesPopulations[country.name] = country.cities
                .reduce((populationSum, city) => populationSum + city.population, 0);
        });

        return countriesPopulations;
    }

    const countries = [
        {
            name: "United States",
            cities: [
                {name: "New York", population: 8335897},
                {name: "Los Angeles", population: 3822238},
                {name: "Chicago", population: 2665039},
                {name: "Dallas", population: 1300000}
            ]
        },
        {
            name: "France",
            cities: [
                {name: "Paris", population: 2181370},
                {name: "Lyon", population: 472715}
            ]
        },
        {
            name: "Germany",
            cities: [
                {name: "Berlin", population: 3677000},
                {name: "Hamburg", population: 3677472},
                {name: "Munich", population: 1486708},
                {name: "Stuttgart", population: 665455}
            ]
        }
    ];

    console.log("Countries with the Maximum Number of Cities:", getMaxCitiesCountCountries(countries));
    console.log("Populations of Countries:", getCountriesPopulations(countries));
})();