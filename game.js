// the ninja locations are a 2D array of numbers (1 is a ninja, 0 is no ninja)
// it was originally hardcoded, now it is generated
var theDojo = [];
var dojoDiv = document.querySelector("#the-dojo");
var width_input = document.querySelector("#width");
var height_input = document.querySelector("#height");
var difficulty_input = document.querySelector("#difficulty");

function leftclick(i, j, element) {
  // console.log({ i, j });

  // if the square is marked or already revealed, don't do anything
  if (element.classList.contains("marked") || element.classList.contains("revealed"))
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
  // put number of nearby ninjas on the button unless zero
  element.innerText = sum > 0? sum : "";
  //add "revealed" class to button for different color
  element.classList.add("revealed");

  // if there are no nearby ninjas, reveal adjacent squares
  // by recursively calling the leftclick() function
  if (sum == 0) {
    for (var i2 = imin; i2 <= imax; i2++)
      for (var j2 = jmin; j2 <= jmax; j2++) {
        // get a reference to the nearby button
        // using :nth-child because the buttons are placed in the div
        // in a loop so we can calculate based on i and j
        var button = document.querySelector("#the-dojo > button:nth-child(" + (i2 * theDojo[i2].length + j2 + 1) + ")");
        // reveal the square only if it is not already revealed 
        // (or else infinite recursion)
        if(!button.classList.contains("revealed"))
          leftclick(i2,j2,button);
      }
  }
}

function rightclick(element)
{
  //don't let the user mark buttons that are already revealed
  if(element.classList.contains("revealed"))
    return;

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

function randomBoard(width, height, ninjas) {
  // console.log(`making board with ${width} width, ${height} height, ${ninjas} ninjas`);
  // create the board with all zeros
  theDojo = [];
  for (var i = 0; i < height; i++)
  {
    theDojo.push([])
    for (var j = 0; j < width; j++)
      theDojo[i].push(0);
  }

  // set {ninjas} random spots on the board to 1
  // infinite loop if ninjas > # squares on the board
  var count = 0;
  while (count < ninjas) {
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
      result += `<button onclick="leftclick(${i}, ${j}, this)" oncontextmenu="rightclick(this);return false;"></button>`;
    }
  }
  return result;
}

function updateLabel(element, labelID)
{
  var span = document.querySelector("#" + labelID + " span");
  span.innerText = element.value;
}

function calculateNinjas(width,height,difficulty)
{
  //convert difficulty range (1 to 8)
  //to ninja density range (1/12 to 1/5)
  var density = 1/(13-difficulty);
  return Math.round(width*height*density);
}

function newGame() {
  var width = parseInt(width_input.value);
  var height = parseInt(height_input.value);
  var difficulty = parseInt(difficulty_input.value);
  // generate new random ninja locations (including board size)
  randomBoard(width, height, calculateNinjas(width,height,difficulty));
  // log the ninja locations for debugging purposes
  console.table(theDojo);
  // set width of the board so the buttons wrap properly (buttons are 32px)
  dojoDiv.style.width = theDojo[0].length * 32 + "px";
  // generate the board buttons (overwrites old buttons)
  dojoDiv.innerHTML = render(theDojo);
}

newGame();