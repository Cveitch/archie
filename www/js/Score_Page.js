/**
 * Created by DavisGoulet on 2016-06-19.
 */

/**
 * When the score page loads, this function is called to set any variables onto the page.
 */
function updatePageInfo()
{
    var attemptString = "Score: " + getLevelAttempts();

    //Display level message based on completion of level
    if(localStorage.win === "false")
    {
        var levelString = "Level " + getCurrentLevel() + " incomplete!";
    }
    else if(localStorage.win === "null")
    {
        var levelString = "Level " + getCurrentLevel() + " still not complete!";
    }
    else
    {
        var levelString = "Level " + getCurrentLevel() + " complete!";
    }

    document.getElementById("attemptMessage").innerHTML = attemptString;
    document.getElementById("levelMessage").innerHTML = levelString;
}

/**
 * Reloads the previous level.
 */
function replayLevel()
{
    //Resets the variables used to generate the equations.
    resetVariables();
    //Go back to the Sprite page
    window.location.href = 'Sprite_Page.html'+'#'+'FALSE';
}

/**
 * Loads the next level.
 */
function nextLevel()
{
    //Resets the variables used to generate the equations.
    resetVariables();
    incrementCurrentLevel();
    localStorage.attempt = 0;
    localStorage.currentLevel = Number(localStorage.currentLevel) + 1;
    window.location.href = 'Sprite_Page.html';
}
