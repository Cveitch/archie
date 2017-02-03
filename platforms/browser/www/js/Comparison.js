/**
 * PROJECT_ARCHIMEDES 2016.
 */

var jump = true;

function setCompare(text)
{
    if(text === "FALSE"){
        jump = false;
    }
}

function getCompare()
{
    return jump
}