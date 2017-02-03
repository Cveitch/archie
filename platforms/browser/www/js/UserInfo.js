/**
 * Created by DavisGoulet on 2016-06-11.
 */

/**
 * Stores the username that the user gave to session storage.
 * @param {String} name
 */
function setUsername(name)
{
    //Saves the username in the session storage so that other pages can retrieve it.
    sessionStorage.setItem("Username",name);
}

/**
 * Sets the text of the container given by the id to the username that the user gave.
 * @param {String} container
 */
function displayUsername(container)
{
    //Sets the container text with given id to the username.
    document.getElementById(container).innerHTML = getUsername();
}

/**
 * Returns the username. If no name is given then a default name of guest is assigned.
 */
function getUsername()
{
    //Gets the variable saved to the session storage under the name "username".
    var name = sessionStorage.getItem("Username");

    //If the username is null, then assign a it the default value of "Guest".
    if(name === null)
    {
        name = "Guest";
    }

    return name;
}

/**
 * Increments the level counter.
 */
function increaseLevel()
{
    var currentLevel = sessionStorage.getItem("currentLevel");

    //If the current level is null, then initialize level counter.
    if(currentLevel !== null)
    {
        currentLevel++;
    }
    //Otherwise increment level counter.
    else
    {
        initializeLevelCounter();
    }
    sessionStorage.setItem("currentLevel", currentLevel)
}

/**
 * Returns the current level number.
 */
function getCurrentLevel()
{
    var currentLevel = sessionStorage.getItem("currentLevel");

    //If the current level is null, then initialize level counter.
    if(currentLevel === null)
    {
        currentLevel = 1;
        initializeLevelCounter();
    }

    return currentLevel;
}

/**
 * Stores an initial level value of 1.
 */
function initializeLevelCounter()
{
    sessionStorage.setItem("currentLevel", 1);
}

/**
 * Returns the current attempts at the level.
 */
function getLevelAttempts()
{
    var levelAttempts = sessionStorage.getItem("levelAttempts");

    //If the value is null, then this is the first time that it is being called to
    // reset value.
    if(levelAttempts !== null)
    {
        sessionStorage.setItem("levelAttempts", localStorage.attempt);
    }
    else
    {
        resetLevelAttempts();
    }

    return sessionStorage.getItem("levelAttempts");
}

/**
 * Increments level counter.
 */
function increaseLevelAttempts()
{
    var levelAttempts = sessionStorage.getItem("levelAttempts");

    //If the value is null, then this is the first time that it is being called so 
    // reset value.
    if(levelAttempts === null)
    {
        resetLevelAttempts();
    }

    //Increments counter then re-saves it.
    levelAttempts++;
    sessionStorage.setItem("levelAttempts", levelAttempts);
}

/**
 * Resets the level counter back to 0.
 */
function resetLevelAttempts()
{
    localStorage.attempt = 0;
    sessionStorage.setItem("levelAttempts", localStorage.attempt);
}
