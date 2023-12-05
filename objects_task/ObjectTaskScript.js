(function () {
    function getMaxCitiesCountCountries(countries) {
        let maxCitiesCount = 0;
        let maxCitiesCountCountries = [];

        countries.forEach(function (country) {
                if (country.cities.length > maxCitiesCount) {
                    maxCitiesCount = country.cities.length;
                    maxCitiesCountCountries = [country];
                } else if (country.cities.length === maxCitiesCount) {
                    maxCitiesCountCountries.push(country);
                }
            }
        )

        return maxCitiesCountCountries;
    }

    function getCountriesPopulations(countries) {
        let countriesPopulations = {};

        countries.forEach(function (country) {
            countriesPopulations[country.countryName] = country.cities.reduce(
                (currentPopulationSum, currentCity) => currentPopulationSum + currentCity.population, 0);
        })

        return countriesPopulations;
    }

    let countries = [
        {
            countryName: "United States",
            cities: [
                {cityName: "New York", population: 8335897},
                {cityName: "Loss Angeles", population: 3822238},
                {cityName: "Chicago", population: 2665039},
                {cityName: "Dallas", population: 1300000}
            ]
        },
        {
            countryName: "France",
            cities: [
                {cityName: "Paris", population: 2181370},
                {cityName: "Lyon", population: 472715}
            ]
        },
        {
            countryName: "Germany",
            cities: [
                {cityName: "Berlin", population: 3677000},
                {cityName: "Hamburg", population: 3677472},
                {cityName: "Munich", population: 1486708},
                {cityName: "Stuttgart", population: 665455}
            ]
        }
    ]

    console.log(getMaxCitiesCountCountries(countries));
    console.log(getCountriesPopulations(countries));
})();