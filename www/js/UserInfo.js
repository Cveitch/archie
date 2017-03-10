/**
 * This file contains user information. When the user selects their username, the JSON is loaded in
 * from local storage and a check is done for that username. All data associated with it is kept in session
 * memory and is only updated in the JSON when a level is completed.
 */

/**
 * Sets the text of the container given by the id to the username that the user gave.
 * @param {String} container
 */
function displayUsername(container)
{
    //Sets the container text with given id to the username.
    document.getElementById(container).innerHTML = getUsername();
}

/** Returns the username. */
function getUsername()
{
    return sessionStorage.getItem("username");
}

/** Returns the current level number. */
function getCurrentLevel()
{
    if(sessionStorage.getItem("currentLevel") === null)
    {
        return "1";
    }
    else
    {
        return sessionStorage.getItem("currentLevel");
    }
}

/** Returns the current attempts at the level. */
function getLevelAttempts()
{
    return sessionStorage.getItem("levelAttempts");
}

/** Returns the current point amount. */
function getPoints()
{
    return sessionStorage.getItem("points");
}

/** Increments the level counter by 1. */
function incrementCurrentLevel()
{
    sessionStorage.setItem("currentLevel", parseInt(sessionStorage.getItem("currentLevel"))+1);
}

/** Increments level counter. */
function incrementLevelAttempts()
{
    sessionStorage.setItem("levelAttempts", parseInt(sessionStorage.getItem("levelAttempts"))+1);
}

/** Adds the parameter to the current points count. */
function incrementPoints(amount)
{
    sessionStorage.setItem("points", parseInt(sessionStorage.getItem("points"))+amount);
}

/** Resets the level counter back to 0. */
function resetLevelAttempts()
{
    sessionStorage.setItem("levelAttempts", 0);
}
/** Resets the point count to 0. */
function resetPoints()
{
    sessionStorage.setItem("points",0);
}

/** Called after the level is completed, adds the level info to the JSON.
 *  Saves the new currentLevel.
 *  Resets the level attempts */
function storeLevelInfo()
{
    //If the user is signed in, then add the level info to their account.
    if(getUsername() !== "Guest")
    {
        var username = getUsername();
        var currentLevel = getCurrentLevel();
        var levelAttempts = getLevelAttempts();
        var points = getPoints();
        //Get spot in user array.
        var obj = JSON.parse(localStorage.getItem("UserData"));
        var spotInUserArray;
        for(var i in obj.users)
        {
            if(obj.users[i].username === username)
            {
                spotInUserArray = i;
            }
        }
        //Add the new level info.
        obj.users[i].previousLevels.push({"levelNumber":currentLevel,"points":points,"attempts":levelAttempts});
        obj.users[i].currentLevel = ++currentLevel;
        console.log("object: %O", obj);
        localStorage.setItem("UserData",JSON.stringify(obj));
    }
    incrementCurrentLevel();
    resetLevelAttempts();
    resetPoints();
}

/**  Creates a new user in the JSON file. */
function createNewUserInfo()
{
    localStorage.setItem("UserData",JSON.stringify({ "users":[]}));
}

/**
 * Loads the user data for that user from local storage to session storage.
 * If the user has no previous account, then create a new one for them.
 * @param username {string}
 */
function loadUser(username)
{
    //If the user signed in under a specific name, then load the data from it.
    if (getUsername() !== "Guest")
    {
        //If there is no previous user data, then create a new one.
            if (localStorage.getItem("UserData") == null)
            {
                console.log("creating new user data");
                createNewUserInfo()
            }
        //Checks to see if the username has a pre-existing account.
        var obj = JSON.parse(localStorage.getItem("UserData"));
        var hasExistingAccount = false;
        var spotInUserArray;
        for (var i in obj.users)
        {
            if (obj.users[i].username === username)
            {
                hasExistingAccount = true;
                spotInUserArray = i;
            }
        }
        //Loads the needed information into session memory based on if an account exists.
        if (hasExistingAccount)
        {
            console.log("Has existing account");
            setSessionInfo(username,obj.users[spotInUserArray].currentLevel,0,0)
        }
        else
        {
            console.log("creating new account");
            obj['users'].push({"username": username, "currentLevel": 1, "previousLevels": []});
            setSessionInfo(username,1,0,0);
        }
        //Re-saves the updates user data.
        localStorage.setItem("UserData", JSON.stringify(obj));
    }
    //If they signed in as a guest, give default info.
    else
    {
        setSessionInfo(username,1,0,0);
    }
}

/**Sets the sessionInfo based on given parameters.
 * @param username
 * @param currentLevel
 * @param levelAttempts
 * @param points */
function setSessionInfo(username,currentLevel,levelAttempts,points)
{
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("currentLevel", currentLevel);
    sessionStorage.setItem("levelAttempts", levelAttempts);
    sessionStorage.setItem("points", points);
}

/** Gets the user info from a specific level.
 *  Returns null if level data doesn't exit for that level.
 *  @param levelNum */
function getSpecificLevelInfo(levelNum)
{
    //If the user signed in under a specific name, then load the data from it.
    if (getUsername() !== "Guest")
    {

        var username = getUsername();
        var obj = JSON.parse(localStorage.getItem("UserData"));
        console.log(obj);
        var spotInUserArray;
        for (var i in obj.users)
        {
            if (obj.users[i].username === username)
            {
                spotInUserArray = i;
            }
        }

        var levelInfo = [];
        for(var i in obj.users[spotInUserArray].previousLevels)
        {
            if(obj.users[i].previousLevels.levelNumber = levelNum)
            {
                levelInfo.push(obj.users[spotInUserArray].previousLevels[i].levelNumber);
                levelInfo.push(obj.users[spotInUserArray].previousLevels[i].points);
                levelInfo.push(obj.users[spotInUserArray].previousLevels[i].attempts);
            }
        }
        if(levelInfo.length === 0) {return null} else {return levelInfo}
    }
}

/** Deletes all user data */
function deleteLocal()
{
    localStorage.removeItem("UserData");
}
