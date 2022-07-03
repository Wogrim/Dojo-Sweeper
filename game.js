// the board is represented as a 2D array of numbers for ninjas on that square
var theDojo = [[1, 0, 1, 1, 1, 0, 4, 0, 8, 0],
[3, 1, 0, 7, 0, 0, 6, 0, 8, 8],
[5, 0, 7, 0, 3, 6, 6, 6, 0, 0],
[2, 3, 0, 9, 0, 0, 6, 0, 8, 0],
[6, 0, 3, 3, 0, 2, 0, 3, 0, 4],
[0, 0, 3, 3, 0, 0, 2, 2, 3, 0],
[0, 0, 0, 0, 5, 0, 1, 2, 0, 6],
[2, 2, 2, 2, 0, 7, 1, 1, 1, 0],
[5, 2, 0, 2, 0, 0, 0, 1, 1, 2],
[9, 2, 2, 2, 0, 7, 0, 1, 1, 0]];
var dojoDiv = document.querySelector("#the-dojo");

// Creates the rows of buttons for this game
function render(theDojo) {
  var result = "";
  for (var i = 0; i < theDojo.length; i++) {
    for (var j = 0; j < theDojo[i].length; j++) {
      result += `<button class="tatami" onclick="howMany(${i}, ${j}, this)"></button>`;
    }
  }
  return result;
}

function howMany(i, j, element) {
  // console.log({ i, j });

  var imin = Math.max(0, i - 1);
  var imax = Math.min(theDojo.length - 1, i + 1);
  var jmin = Math.max(0, j - 1);
  var jmax = Math.min(theDojo[i].length - 1, j + 1);

  var sum = 0;
  for (var i2 = imin; i2 <= imax; i2++)
    for (var j2 = jmin; j2 <= jmax; j2++)
      sum += theDojo[i2][j2];

  // alert(sum + " ninjas hiding under this and adjacent squares");

  // put number of nearby ninjas on the button
  element.innerText = sum;
}

// BONUS CHALLENGES
// 3. if you click on a ninja you must restart the game 
//    dojoDiv.innerHTML = `<button onclick="location.reload()">restart</button>`;

// start the game
// message to greet a user of the game
var style = "color:cyan;font-size:1.5rem;font-weight:bold;";
console.log("%c" + "IF YOU ARE A DOJO STUDENT...", style);
console.log("%c" + "GOOD LUCK THIS IS A CHALLENGE!", style);

function randomBoard() {
  // reset the board to all zeros
  for (var i = 0; i < theDojo.length; i++)
    for (var j = 0; j < theDojo[i].length; j++)
      theDojo[i][j] = 0;

  // set 10 random spots on the board to 1
  var count = 0;
  while (count < 10) {
    // get location of a random spot on the board
    var i = Math.floor(Math.random()*theDojo.length);
    var j = Math.floor(Math.random()*theDojo[i].length);
    // if the spot is empty, fill it, otherwise try again
    if(theDojo[i][j] == 0)
    {
      theDojo[i][j] = 1;
      count++;
    }
  }
}

function newGame() {
  // generate random board
  randomBoard();
  // shows the dojo for debugging purposes
  console.table(theDojo);
  // adds the rows of buttons into <div id="the-dojo"></div> 
  dojoDiv.innerHTML = render(theDojo);
}

newGame();