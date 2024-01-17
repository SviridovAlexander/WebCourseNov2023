// noinspection TypeScriptUMDGlobal

(function () {
    const people = [
        {age: 15, name: "Kirill"},
        {age: 54, name: "Pasha"},
        {age: 13, name: "Boris"},
        {age: 21, name: "John"},
        {age: 22, name: "Michal"},
        {age: 28, name: "Alex"},
        {age: 20, name: "Dima"},
        {age: 45, name: "Dasha"},
        {age: 12, name: "Jack"},
        {age: 23, name: "Alex"}
    ];

    console.log("Average age of all people:", _.meanBy(people, "age"));

    console.log("List of people aged 20 to 30 inclusive, sorted by ascending age:",
        _.chain(people)
            .filter(person => person.age >= 20 && person.age <= 30)
            .sortBy("age")
            .value()
    );

    console.log("List of unique names of people with ages from 20 to 30 inclusive, sorted in descending order:",
        _.chain(people)
            .filter(person => person.age >= 20 && person.age <= 30)
            .countBy("name")
            .map((count, name) => ({name, count}))
            .sortBy('count').reverse()
            .value()
    );

    console.log("Object where keys are the names and the values are the number of people with this name:",
        _.countBy(people, "name"));
})();