const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'aac1e024c5msh26d7dc1ad9faae9p1f8cdfjsn7d863e369a52',
        'X-RapidAPI-Host': 'love-calculator.p.rapidapi.com'
    }
};

// ------- Range Slider ----------//
let slider = document.getElementById("myRange");
let output = document.getElementById("range_value");
// add listener to slider
slider.addEventListener("input", function () {
    output.innerHTML = slider.value + "%";
});
// set what happens with refresh
window.onload = function () {
    slider.value = 1;
    output.innerHTML = slider.value + "%";
}


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

let pokemon = null;
// get all pokemon
fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => {
    response.json().then(data => {
        // all pokemon
        pokemon = data.results;
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
        // get list of pokemon in alphabetical order
        pokemon = pokemonNames.map(name => pokemon.find(pokemon => pokemon.name == name));
        // append select to left side
        leftSide.appendChild(select);
        leftSide.appendChild(document.createElement('br'));
        let button = document.createElement('button');
        button.innerHTML = "Calculate";
        // set button id
        button.id = "calculate";
        document.getElementById('leftSide').appendChild(button);

        // add listener to select
        select.addEventListener('change', function () {
            console.log("in select listener");
            updatePokemon();
        });

        // ---------------- set first pokemon -----------------//
        updatePokemon();
        function updatePokemon() {
            let pokemon1 = pokemon.find(pokemon => pokemon.name == select.value);
            fetch(pokemon1.url).then(response => {
                response.json().then(data => {
                    // create li and anchor
                    let a = document.createElement('a');
                    a.href = pokemon1.url;
                    // create image 
                    let image = document.createElement('img');
                    image.src = data.sprites.other["official-artwork"].front_default;
                    // set size 
                    image.style.maxHeight = "300px";
                    image.style.maxWidth = "300px";

                    // name
                    let name_h2 = document.createElement('h2');
                    name_h2.innerText = pokemon1.name;

                    a.appendChild(name_h2);
                    a.appendChild(image);

                    let selected = document.getElementById('selected_pokemon');
                    selected.innerHTML = "";
                    selected.appendChild(a);
                })
            });
        }

        // ----------------  listener  -----------------//
        document.getElementById('calculate').addEventListener('click', function (e) {
            e.preventDefault();
            // get pokemon object from select name
            let results = document.getElementById('myUL');
            results.innerHTML = ""; // reset results

            let pokemon1 = pokemon.find(pokemon => pokemon.name == select.value);
            // -------- results --------//
            for (let i = 0; i < 100; i++) {
                fetch(`https://love-calculator.p.rapidapi.com/getPercentage?fname=${pokemon1.name}&sname=${pokemon[i].name}`, options)
                    .then(response => response.json()
                        .then(data => {
                            cardify(pokemon[i], data.percentage, data.result, results);
                        }))
                    .catch(err => console.error(err));
            }

            // ---------------- set first pokemon -----------------//
            updatePokemon();
        });

    });
});


function filterSearch() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
    let arr = [];

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h2")[0];
        txtValue = a.textContent || a.innerText;
        let percentage = li[i].getElementsByTagName("p")[0];
        // console.log(percentage.firstChild.data);
        // percentage = percentage.innerText;
        percentage = percentage.firstChild.data;
        // find pokemon from text
        // let pokemon = pokemon.find(pokemon => pokemon.name == txtValue);

        if (txtValue.toUpperCase().indexOf(filter) > -1 && percentage >= slider.value) {
            console.log(filter);
            console.log(txtValue.toUpperCase().indexOf(filter));
            li[i].style.display = "";
            // li[i].style.display = "none";
            arr.push(li[i]);
        } else {
            li[i].style.display = "none";
        }
    }

    function ascendingPercentages(a, b) {
        console.log("i sort now")
        var percentageA = a.getElementsByTagName("p")[0];
        percentageA = percentageA.firstChild.data;
        console.log(percentageA);

        var percentageB = b.getElementsByTagName("p")[0];
        percentageB = percentageB.firstChild.data;
        console.log(percentageB);

        
        if (percentageA <percentageB) {
            console.log("A < B -- -1");
            return -1;
        }

        if (percentageA > percentageB) {
            console.log("A > B -- 1");
            return 1;
        }

        console.log("A == B -- 0");
        return 0;
    }

    arr.sort(ascendingPercentages);

    for (i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        arr[i].style.display = "";
    }

    

}

// creates a compatibility card for given pokemon as an li element with picture and percentage and ru   
function cardify(pokemon, percentage, result, results) {
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
            // div of text
            let text_div = document.createElement('div');
            text_div.style.display = 'inline-block';
            text_div.style.marginLeft = '10px';
            text_div.style.verticalAlign = 'top';

            // name
            let name_h2 = document.createElement('h2');
            name_h2.innerText = pokemon.name;

            // percentage
            let percent_p = document.createElement('p');
            percent_p.innerText = percentage;
            percent_p.style.marginRight = '0';
            percent_p.style.display = 'inline-block';

            let percentSign = document.createElement('p');
            percentSign.innerText = "%";
            percentSign.style.margin = '0';
            percentSign.style.display = 'inline-block';


            // results
            let result_p = document.createElement('p');
            result_p.style.fontStyle = 'italic';
            result_p.innerText = result;

            // appendages 
            text_div.appendChild(name_h2);
            text_div.appendChild(percent_p);
            text_div.appendChild(percentSign);
            text_div.appendChild(result_p);

            anchor.appendChild(text_div);
            card.appendChild(anchor);
            results.appendChild(card);
        })
    });


}



