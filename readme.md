## what is it?

a Coding Dojo algorithm problem (count the ninjas in this and adjacent squares) that is the basis of a minesweeper clone, which I am making into a fully functional game (see the original files in the other branch)

## where to play?

the link to play is [https://wogrim.github.io/Dojo-Sweeper/](https://wogrim.github.io/Dojo-Sweeper/)

## how to play?

The goal is to reveal all the safe squares and mark all the bad squares (where a ninja assassin is hiding).

Left click a square to reveal it.  If there is a ninja there, you lose.  If it is safe, it will tell you how many ninjas are in adjacent squares (if none, it auto reveals adjacent squares to save you some clicks).

Right click a square to mark it.  If you later decide a ninja is not hiding there, you must right click it again to unmark it before you can reveal it.

If you lose, the rest of the board will be revealed with alternate colors and your mistake(s) will have a special color.

## difficulty

The difficulty slider simply increases the density of ninjas, which are always placed completely randomly.  This generally increases the difficulty of the game by requiring less-obvious ways to figure out where the ninjas are.

However, at any difficulty you can get situations where you just have to guess, and if you're unlucky you lose.  When you are deciding where to guess, consider the odds of the guess being correct, and the odds of that correct guess giving you enough information that you won't have to make another guess.

I originally made the difficulty more granular, but small changes in difficulty weren't noticable so I changed it to a system where you feel more like you've graduated to the next difficulty level.

I capped difficulty at a point where the amount of guessing required feels reasonably minimal (if you're clever enough).

Making the board bigger will reduce your chances of victory by increasing the average number of correct guesses you may have to make, but it generally doesn't affect the level of logic you need to use.

Making the board smaller can make it feel relatively harder on the higher difficulties because you will frequently not have enough information to figure out ninja locations, but it is good practice for starting and ending the game.