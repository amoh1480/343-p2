const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'aac1e024c5msh26d7dc1ad9faae9p1f8cdfjsn7d863e369a52',
        'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
    }
};

// Range slider
let slider = document.getElementById("myRange");
let output = document.getElementById("range_value");
output.innerHTML = slider.value; // Display the default slider value
// add listener to slider
slider.addEventListener("input", function () {
    let output = document.getElementById("range_value");
    output.innerHTML = slider.value;
});



let rightSide = document.getElementById('rightSide');
let leftSide = document.getElementById('leftSide');

function getValidPokemon() {
    // console.log("in get valid");
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => {
        response.json().then(data => {
            let allPokemon = data.results;
            let pokemon = allPokemon[Math.floor(Math.random() * allPokemon.length)];
            // console.log("here is a pokemon");
            // console.log(pokemon);
            fetch(pokemon.url).then(response => {
                response.json().then(pokemon_stats => {
                    // console.log("here are the stats");
                    // console.log(pokemon.name);
                    // console.log(pokemon_stats);
                    // console.log(pokemon_stats.species);
                    if (pokemon_stats.name != pokemon_stats.species.name) {
                        return getValidPokemon();
                    } else {
                        // console.log("i have reached the result");
                        // console.log(pokemon);
                        return pokemon;
                    }
                })
            });
        });
    });
}

// pokemon API
// https://pokeapi.co/api/v2/pokemon/ditto

// all pokemon ?
// https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0

// all pokemon species
// https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0

// get all pokemon
fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => {
    response.json().then(data => {
        // all pokemon
        let pokemon = data.results;
        // create select
        let select = document.createElement('select');
        // set options for person1 select
        // get array of names from pokemon
        let pokemonNames = pokemon.map(pokemon => pokemon.name).sort();
        for (let i = 0; i < pokemon.length; i++) {
            let option = document.createElement('option');
            option.value = pokemonNames[i];
            option.innerHTML = pokemonNames[i];
            select.appendChild(option);
        }
        // append select to left side
        leftSide.appendChild(select);
        leftSide.appendChild(document.createElement('br'));
        let button = document.createElement('button');
        button.innerHTML = "Calculate";
        // set button id
        button.id = "calculate";
        document.getElementById('leftSide').appendChild(button);

        // set options for person2 select
        // leftSide.appendChild(document.create)
        // listen for submit
        document.getElementById('calculate').addEventListener('click', function (e) {
            e.preventDefault();
            // get pokemon object from select name
            let pokemon1 = pokemon.find(pokemon => pokemon.name == select.value);
            console.log(pokemon1);
            let results = document.getElementById('myUL');
            results.innerHTML = ""; // reset results

            // fetch compatibility for each pokemon in array
            for (let i = 0; i < 50; i++) {
                fetch(`https://love-calculator.p.rapidapi.com/getPercentage?fname=${pokemon1.name}&sname=${pokemon[i].name}`, options)
                    .then(response => response.json()
                        .then(data => {

                            // // write to results
                            // let result = document.createElement('li');
                            // let anchor = document.createElement('a');
                            // anchor.href = `https://pokeapi.co/api/v2/pokemon/${pokemon[i].name}`;
                            // anchor.innerHTML = `${pokemon1.name} and ${pokemon[i].name} are ${data.percentage}% compatible`;
                            // result.appendChild(anchor);

                            let result = cardify(pokemon[i].name, data.percentage, data.result);
                            results.appendChild(result);
                        }))
                    .catch(err => console.error(err));
            }

        });


        // // random pokemon
        // let pokemon1 = pokemon[Math.floor(Math.random() * pokemon.length)];

        // console.log(pokemon1);

        // let pokemon2 = pokemon[Math.floor(Math.random() * pokemon.length)];
        // fetch(pokemon2.url).then(response => {
        //     response.json().then(pokemon_stats => {
        // });
        // console.log(pokemon2);

        // // console.log(pokemon1.name);
        // fetch(`https://love-calculator.p.rapidapi.com/getPercentage?fname=${pokemon1.name}&sname=${pokemon2.name}`, options)
        //     .then(response => response.json()
        //         .then(data => {
        //             // // write to the DOM
        //             // console.log(pokemon1)
        //             // // person 1
        //             // let person1Name = document.createElement('h2');
        //             // person1Name.innerText = pokemon1.name;
        //             // person1.appendChild(person1Name);
        //             // fetch(pokemon1.url).then(response => {
        //             //     response.json().then(data => {
        //             //         console.log(data.sprites.other);
        //             //         let person1Image = document.createElement('img');
        //             //         // person1Image.src = data.sprites.front_default;
        //             //         person1Image.src = data.sprites.other["official-artwork"].front_default;
        //             //         person1.appendChild(person1Image);
        //             //     })
        //             // });

        //             // person 2
        //             console.log(pokemon2);
        //             let person2Name = document.createElement('h2');
        //             person2Name.innerText = pokemon2.name;
        //             person2.appendChild(person2Name);
        //             fetch(pokemon2.url).then(response => {
        //                 response.json().then(data => {
        //                     let person2Image = document.createElement('img');
        //                     // person2Image.src = data.sprites.front_default;
        //                     person2Image.src = data.sprites.other["official-artwork"].front_default;
        //                     person2.appendChild(person2Image);
        //                 })
        //             });



        //             // person2.innerHTML = pokemon2.name;
        //             document.getElementById('percentage').innerHTML = data.percentage + '%';
        //             document.getElementById('result').innerHTML = data.result;
        //         }))
        //     .catch(err => console.error(err));
    });
});


function filterSearch() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        // find pokemon from text
        // let pokemon = pokemon.find(pokemon => pokemon.name == txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }

}

// creates a compatibility card for given pokemon as an li element with picture and percentage and ru   
function cardify(pokemon, percentage, result) {
    // li
    let card = document.createElement('li');

    // anchor
    let anchor = document.createElement('a');
    anchor.href = pokemon.url;

    // image
    let image = document.createElement('img');
    // fetch pokemon url
    fetch(pokemon.url).then(response => {
        response.json().then(data => {
            image.src = data.sprites.other["official-artwork"].front_default;
            // append image to anchor
            anchor.appendChild(image);
        })
    });

    // name
    let name_h2 = document.createElement('h2');
    name_h2.innerText = pokemon.name;

    // percentage
    let percent_p = document.createElement('p');
    percent_p.innerText = percentage;

    // results
    let result_p = document.createElement('p');
    result_p.style.fontStyle = 'italic';
    result_p.innerText = result;

    // appendages 
    // anchor.appendChild(image);
    anchor.appendChild(name_h2);
    anchor.appendChild(percent_p);
    anchor.appendChild(result_p);
    card.appendChild(anchor);
    return card;
}


    // <li><a href="#"></a></li>