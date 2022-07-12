// the ninja locations are a 2D array of numbers (1 is a ninja, 0 is no ninja)
// it was originally hardcoded, now it is generated
var theDojo = [];
var dojoDiv = document.querySelector("#the-dojo");
var width_input = document.querySelector("#width");
var height_input = document.querySelector("#height");
var ninjas_input = document.querySelector("#ninjas");

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

function randomBoard(width, height, ninjas) {
  // create the board with all zeros
  theDojo = [];
  for (var i = 0; i < height; i++)
  {
    theDojo.push([])
    for (var j = 0; j < width; j++)
      theDojo[i].push(0);
  }

  // set {ninjas} random spots on the board to 1
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
      result += `<button class="tatami" onclick="howMany(${i}, ${j}, this)" oncontextmenu="rightclick(this);return false;"></button>`;
    }
  }
  return result;
}

function validateSettings()
{
  //make sure the inputs are numbers that make sense
  var width = parseInt(width_input.value);
  if(isNaN(width) || width < 1)
  {
    width = 1;
    width_input.value = width;
  }

  var height = parseInt(height_input.value);
  if(isNaN(height) || height < 1)
  {
    height = 1;
    height_input.value = height;
  }

  var ninjas = parseInt(ninjas_input.value);
  if(isNaN(ninjas) || ninjas < 1)
  {
    ninjas = 1;
    ninjas_input.value = ninjas;
  }
  else if(ninjas > width * height)
  {
    ninjas = width * height;
    ninjas_input.value = ninjas;
  }
}

function newGame() {
  // validate the settings
  validateSettings();
  // generate new random ninja locations (including board size)
  randomBoard(parseInt(width_input.value), parseInt(height_input.value), parseInt(ninjas_input.value));
  // log the ninja locations for debugging purposes
  console.table(theDojo);
  // set width of the board so the buttons wrap properly (buttons are 32px)
  dojoDiv.style.width = theDojo[0].length * 32 + "px";
  // generate the board buttons (overwrites old buttons)
  dojoDiv.innerHTML = render(theDojo);
}

newGame();