const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'aac1e024c5msh26d7dc1ad9faae9p1f8cdfjsn7d863e369a52',
        'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
    }
};

let person1 = document.getElementById('person1');
let person2 = document.getElementById('person2');

// pokemon API
// https://pokeapi.co/api/v2/pokemon/ditto

// all pokemon ?
// https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0

// get all pokemon
fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => {
    response.json().then(data => {
        // all pokemon
        let pokemon_all = data.results;
        // random pokemon
        let pokemon1 = pokemon[Math.floor(Math.random() * pokemon.length)];
        let pokemon2 = pokemon[Math.floor(Math.random() * pokemon.length)];
        // console.log(pokemon1.name);
        fetch(`https://love-calculator.p.rapidapi.com/getPercentage?fname=${pokemon1.name}&sname=${pokemon2.name}`, options)
            .then(response => response.json()
                .then(data => {
                    // write to the DOM
                    console.log(pokemon1)
                    // person 1
                    let person1Name = document.createElement('h2');
                    person1Name.innerText = pokemon1.name;
                    person1.appendChild(person1Name);
                    fetch(pokemon1.url).then(response => {
                        response.json().then(data => {
                            let person1Image = document.createElement('img');
                            person1Image.src = data.sprites.front_default;
                            person1.appendChild(person1Image);
                        })
                    });

                    // person 2
                    let person2Name = document.createElement('h2');
                    person2Name.innerText = pokemon2.name;
                    person2.appendChild(person2Name);
                    fetch(pokemon2.url).then(response => {
                        response.json().then(data => {
                            let person2Image = document.createElement('img');
                            person2Image.src = data.sprites.front_default;
                            person2.appendChild(person2Image);
                        })
                    });



                    // person2.innerHTML = pokemon2.name;
                    document.getElementById('percentage').innerHTML = data.percentage + '%';
                    document.getElementById('result').innerHTML = data.result;
                }))
            .catch(err => console.error(err));
    });
});




