var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

var model = {
    boardSize: 7,  //if we decide to make a bigger board
    numShips: 3, //if we decide to add more ships in the future
    shipLength: 3,
    shipsSunk: 0, //we start with 0
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]}],
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess); 
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);   //this generates horizontal (1) or vertical (0) ship direction
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);   //leaving space for next two locations
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));   //generates starting location for horizontal ship
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));  //leaving space for next two locations
            col = Math.floor(Math.random() * this.boardSize);   //generates starting point for vertical ship
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));   //add location to array for new hor ship
            } else {
                newShipLocations.push((row + i) + "" + col);    //add location to array for a new vert ship
            }
        }
        return newShipLocations;
    },
    collision: function(locations) { //check if there are any ships who are colliding
        for (var i = 0; i < locations.length; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);  //we get location after validating players guess
        if (location) {
            this.guesses++;  //increasing the number of guesses the user took
            var hit = model.fire(location);     //pass the guess into fire method
            if (hit && model.shipsSunk === model.numShips) {    //if there was a hit and all ships are sunk
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
            }
        }
    }
};

//change input letter into number and check if the input is valid
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]; //array to use to convert it into number
    if (guess === null || guess.length !== 2) {  //checking if the guess meets the requirements
        alert("Opps, please enter a letter and a number on the board.");
    } else {
        firstChar = guess.charAt(0);  //we get the first character
        var row = alphabet.indexOf(firstChar); //we find the first character's corresponging letter in the array and get its index, assign it to the var row
        var column = guess.charAt(1); //we get the second character, and assign it to var column
        if (isNaN(row) || isNaN(column)) { //here we check if we have a number
            alert ("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { //here we check if it fits into our requirements
            alert("Oops, that isn't on the board.");
        } else {
            return row + column; //return the answer that we need for our code to work
        }
    }
    return null; //if there was a failed check, we return null
}

//simplifying the code in the book by making these variables global, leaving the other ones commented out so I know what I changed
var fireButton = document.getElementById("fireButton");
var guessInput = document.getElementById("guessInput");


function init() {
    // var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    // var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}

function handleFireButton() {
    // var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

//I feel like this is a very old way to do it, there must be a more simple one to look into
function handleKeyPress(e) {
    // var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}


window.onload = init;