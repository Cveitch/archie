/**
 * Created by DavisGoulet on 2016-06-28.
 */


/**
 * Take the user input from the splash page and if it is correct,
 * saves it and moves on to the next page.
 * @param {String} buttonID
 */
function signIn(buttonID)
{
    var name;

    //Gets the name of the user from the options that they select on the splash screen
    //If the user clicks the guest button, the assign the name as guest, else sign in as the username they gave
    if(buttonID === "continueGuestButton")
    {
        name = "Guest";
    }
    else if(buttonID === "signInButton")
    {
        name = document.getElementById("userNameInput").value;

        //Checks that the username length is not less then 2 or greater then 20 characters.
        if(name.length < 2 || name.length > 20)
        {
            //If the user tries to sign in as username with no username entered, then display message.
            document.getElementById("invalidLengthLabel").style.visibility = "visible";
            return;
        }
    }
    //If for some reason this function is called from neither of the buttons, then prevent it from continuing on
    else
    {
        return;
    }
    loadUser(name);

    //Load the instructions by hiding the sign in container and making the instruction one visible.
    document.getElementById("signInContainer").style.display = "none";
    document.getElementById("instructionContainer").style.display = "block";
    document.getElementById("usernameLabel").innerHTML = name;

}

/**
 * Continues on to the game.
 */
function continueToGame()
{
    window.location.href = "Sprite_Page.html";
}

/**
 * Displays or hides the invalidLengthLabel depending on the length of the name the user has entered.
 */
function usernameLengthListener()
{
    var nameLength = document.getElementById("userNameInput").value.length;

    //If the username length is between 2 - 20 or 0 characters, hide the invalidLengthLabel.
    //If outside this range, then inform the user.
    if((nameLength < 2 || nameLength > 20) && nameLength !== 0)
    {
        document.getElementById("invalidLengthLabel").style.visibility = "visible";
    }
    else
    {
        document.getElementById("invalidLengthLabel").style.visibility = "hidden";
    }
}
