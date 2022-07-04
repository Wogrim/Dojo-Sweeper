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

function howMany(i, j, element) {
  // console.log({ i, j });

  // if the square is marked, don't do anything
  if (element.classList.contains("marked"))
    return;

  // lose condition
  if (theDojo[i][j] != 0) {
    alert("game over");
    newGame();
    return;
  }

  // indices to check for ninjas when this button is clicked
  var imin = Math.max(0, i - 1);
  var imax = Math.min(theDojo.length - 1, i + 1);
  var jmin = Math.max(0, j - 1);
  var jmax = Math.min(theDojo[i].length - 1, j + 1);
  // count how many ninjas are under this button or adjacent
  var sum = 0;
  for (var i2 = imin; i2 <= imax; i2++)
    for (var j2 = jmin; j2 <= jmax; j2++)
      sum += theDojo[i2][j2];
  // put number of nearby ninjas on the button
  element.innerText = sum;

  // if there are no nearby ninjas, reveal adjacent squares
  // by recursively calling the howMany() function
  if (sum == 0) {
    for (var i2 = imin; i2 <= imax; i2++)
      for (var j2 = jmin; j2 <= jmax; j2++) {
        // get a reference to the nearby button
        // using :nth-child because the buttons are placed in the div
        // in a loop
        var button = document.querySelector("#the-dojo > button:nth-child(" + (i2 * theDojo[i2].length + j2 + 1) + ")");
        // reveal the square only if it is not already revealed 
        // (or else infinite recursion)
        if(button.innerText === "")
          howMany(i2,j2,button);
      }
  }
}

function rightclick(element)
{
  // mark or unmark the square via class for special CSS styling
  if(element.classList.contains("marked"))
  {
    element.classList.remove("marked");
    element.innerText="";
  }
  else
  {
    element.innerText="*";
    element.classList.add("marked");
  }
}

function randomBoard() {
  // reset the board to all zeros
  for (var i = 0; i < theDojo.length; i++)
    for (var j = 0; j < theDojo[i].length; j++)
      theDojo[i][j] = 0;

  // set 10 random spots on the board to 1
  var count = 0;
  while (count < 10) {
    // get location of a random spot on the board
    var i = Math.floor(Math.random() * theDojo.length);
    var j = Math.floor(Math.random() * theDojo[i].length);
    // if the spot is empty, fill it, otherwise try again
    if (theDojo[i][j] == 0) {
      theDojo[i][j] = 1;
      count++;
    }
  }
}

// Creates the rows of buttons for this game
function render(theDojo) {
  var result = "";
  for (var i = 0; i < theDojo.length; i++) {
    for (var j = 0; j < theDojo[i].length; j++) {
      result += `<button class="tatami" onclick="howMany(${i}, ${j}, this)" oncontextmenu="rightclick(this);return false;"></button>`;
    }
  }
  return result;
}

function newGame() {
  // remove the board buttons
  dojoDiv.innerHTML = "";
  // generate random board
  randomBoard();
  // shows the dojo for debugging purposes
  console.table(theDojo);
  // adds the rows of buttons into <div id="the-dojo"></div> 
  dojoDiv.innerHTML = render(theDojo);
}

newGame();