/**
 * Created by DavisGoulet on 2016-06-19.
 */

/**
 * When the score page loads, this function is called to set any variables onto the page.
 */
function updatePageInfo()
{
    var attemptString = "Attempts: " + localStorage.attempt;

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
    increaseLevel();
    localStorage.attempt = 0;
    window.location.href = 'Sprite_Page.html';
}

//this brings up the popup menu for the players data
function stageMenu()
{
    //this opens a popup window
    newWindow = window.open(encodeURI("Score_Page.html"), '_blank', "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");

    //this works in conjunction with the closeWindow function to be able to close the popup window in phonegap
    newWindow.addEventListener('loadstop', function(event) 
    {
        if (event.url.match("Score_Page.html")) 
        {
            newWindow.close();
        }
    });
    //allows js to function on popup
    newWindow.document.write('<script type = "text/javascript" src="js/Score_Page.js"></script>');
   //this gives it the css style we've been using
    newWindow.document.write("<link rel='stylesheet' type='text/css' href='Formatting.css'>");


    //this is basically html code making the page
    newWindow.document.write("<body class='pageBackground'>");
    newWindow.document.write("<div class='centerBoxHorizontal' align='center' >");
    newWindow.document.write("<div style='margin-bottom: 5%'>");
    newWindow.document.write("<h1 class='heading standardFormat' >Stage Info</h1>");

    //each of these buttons has a hidden page divide that will be filled and revealed when pressed
    newWindow.document.write("<button value ='displace' onclick='getDefinitions(this.value)'   class='standardButton standardFormat'>Displacement Func.</button>");
    newWindow.document.write('<div id="displace"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='veloc' onclick='getDefinitions(this.value)' class='standardButton standardFormat'>Velocity Func.</button>");
    newWindow.document.write('<div id="veloc"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='accel' onclick='getDefinitions(this.value)' class='standardButton standardFormat'>Acceleration Func.</button>");
    newWindow.document.write('<div id="accel"  style="display:none;" class="answer_list" ></div>');
    
    //this button closes the page on mobile device and goes to the score page on the web
    newWindow.document.write("<button onclick='closeBrowser()' class='standardButton standardFormat'>Back</button>");
    newWindow.document.write("</div>");
    newWindow.document.write("</div>");
    newWindow.document.write("</body>")
}

//this brings up the popup menu for the formal definitions, basically a copy of stageMenu()
function formalDefMenu()
{
    //this opens a popup window
    newWindow = window.open(encodeURI("Score_Page.html"), '_blank', "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");

    //this works in conjunction with the closeWindow function to be able to close the popup window in phonegap
    newWindow.addEventListener('loadstop', function(event) 
    {
        if (event.url.match("Score_Page.html")) 
        {
            newWindow.close();
        }
    });

    newWindow.document.write('<script type = "text/javascript" src=js/Score_Page.js"></script>');
    //this gives it the css style we've been using
    newWindow.document.write("<link rel='stylesheet' type='text/css' href='Formatting.css'>");

    //this is basically html code making the page
    newWindow.document.write("<body class='pageBackground'>");
    newWindow.document.write("<div class='centerBoxHorizontal' align='center' >");
    newWindow.document.write("<div style='margin-bottom: 5%'>");
    newWindow.document.write("<h1 class='heading standardFormat' >Formal Definitions</h1>");

    newWindow.document.write("<button value ='fdista' onclick='getDefinitions(this.value)' class='standardButton standardFormat'>Distance Func.</button>");
    newWindow.document.write('<div id="fdista"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='fderiv' onclick='getDefinitions(this.value)'   class='standardButton standardFormat'>Derivative</button>");
    newWindow.document.write('<div id="fderiv"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='finter' onclick='getDefinitions(this.value)'   class='standardButton standardFormat'>Integral</button>");
    newWindow.document.write('<div id="finter"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='fveloc' onclick='getDefinitions(this.value)' class='standardButton standardFormat'>Velocity</button>");
    newWindow.document.write('<div id="fveloc"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='ffunct' onclick='getDefinitions(this.value)' class='standardButton standardFormat'>Function</button>");
    newWindow.document.write('<div id="ffunct"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button value ='fgraph' onclick='getDefinitions(this.value)' class='standardButton standardFormat'>Graph</button>");
    newWindow.document.write('<div id="fgraph"  style="display:none;" class="answer_list" ></div>');

    newWindow.document.write("<button onclick='closeBrowser()' class='standardButton standardFormat'>Back</button>");
    newWindow.document.write("</div>");
    newWindow.document.write("</div>");
    newWindow.document.write("</body>")
}

//this function is used to get the value of the button pressed and give its corresponding div a defintion and maybe a equation
function getDefinitions(buttonValue)
{
    //these are the formal definitions that will appear after clicking the button
    var displaceDef = "This is the equation of the displacement you made this stage:";

    var velocDef = "This is the equation of your velocity this stage:";

    var accelDef = "This is the equation of your acceleration this stage:";

    var fDistaDef = "You’ve probably encountered these concepts before:" +
        " DISTANCE and DISPLACEMENT. Both talk about the length between two points," +
        " but distance is only concerned with the total length taken to reach the" +
        " second point while displacement is only concerned with the difference" +
        " between the two points. Let’s say you and your friend are racing each" +
        " other on the 800-meter track, and whoever runs the longest distance" +
        " without stopping wins. Your friend is able to run 2 full laps before" +
        " becoming exhausted, but you beat him by running an extra 400 meters." +
        " Your friend ran a distance 1600 meters while you ran for 2000 meters:" +
        " that’s quite a bit! But your friends displacement would be 0 meters as" +
        " his final position is aligned with the starting line (their difference " +
        "is zero) and yours is around 400 meters away from the starting line.";

    var fVelocDef = "Both SPEED and VELOCITY allude to the same concept" +
       " of motion of ravel over a period of time. Speed tells how fast something" +
       " is going whereas velocity tells how fast something is going in a certain" +
       " direction. ";

    var fGraphDef = "A GRAPH is a visual representation of what your function" +
        " should look like. It illustrates how the dependent variable (velocity)" +
        " behaves based on the manipulated independent variable (time)." +
        " The independent variable will always be on the x-axis of the graph" +
        " while the dependent variable will be placed on the y-axis. This allows " +
        "you to properly see the effects of how the independent variable " +
        "(our input for the function) to see changes made in the dependent" +
        " variable (our output for the function).";

    var fFunctDef = "What are functions anyway? They’re not there to confuse you," +
        " they’re there to help you understand how something works or behaves." +
        " A FUNCTION is a mathematical formula with one or more variables" +
        " created to give you an output based on some input. This is" +
        " similar to a vending machine: you place your money into the" +
        " machine and select your food (your inputs), and the machine" +
        " spits out the desired product (your output). A specific input" +
        " you place into the function should always give you the same" +
        " result every time; if not, then there is a problem with the" +
        " function and it should be scrapped for a new function.";

    var fDerivDef = "A DERIVATIVE of a function allows you to" +
        " understand how quickly or slowly the rate of change is " +
        "for the y-axis variable. It enables you to infer how much " +
        "of a change the next output of the function will be based" +
        " on a specific input. Graphically, it’s the slope of your" +
        " function that signifies the rate of change of for your y-axis " +
        "variable as the function progresses along the x-axis. In the" +
        " case with velocity, the slope at any given point is the " +
        "acceleration needed to reach the next velocity point at a" +
        " specific time point.";

    var fInterDef = "The inverse of the function (the opposite of the derivative)" +
        " is the INTEGRAL. The integral allows us to determine the amount of" +
        " the y-axis parameter used based on the amount of the x-axis parameter." +
        " This area is located between the curve and the x-axis, bounded" +
        " within a domain boundary. Using our velocity example, if we take" +
        " the integral of the function shown on the graph, the resulting area" +
        " is the distance made over a period of time.";

    switch (buttonValue)
    {
        case 'displace':
        {
            //add equation as a string to the end of var for innerHTML
            newWindow.document.getElementById(buttonValue).innerHTML = displaceDef + getIntegral();
            break;
        }
        case 'veloc':
        {
            //add equation as a string to the end of var for innerHTML
            newWindow.document.getElementById(buttonValue).innerHTML = velocDef + getInterpolation();
            break;
        }
        case 'accel':
        {
            //add equation as a string to the end of var for innerHTML
            newWindow.document.getElementById(buttonValue).innerHTML = accelDef + getDerivative();
            break;
        }
        case 'fdista':
        {
            newWindow.document.getElementById(buttonValue).innerHTML = fDistaDef;
            break;
        }
        case 'fderiv':
        {
            newWindow.document.getElementById(buttonValue).innerHTML = fDerivDef;
            break;
        }
        case 'finter':
        {
            newWindow.document.getElementById(buttonValue).innerHTML = fInterDef;
            break;
        }
        case 'fveloc':
        {
            newWindow.document.getElementById(buttonValue).innerHTML = fVelocDef;
            break;
        }
        case 'fgraph':
        {
            newWindow.document.getElementById(buttonValue).innerHTML = fGraphDef;
            break;
        }
        case 'ffunct':
        {
            newWindow.document.getElementById(buttonValue).innerHTML = fFunctDef;
            break;
        }

        default:
            document.write("<button  id='default'  class='standardButton standardFormat'>default</button>");
            break;
    }

    //this allows for the user to make the text appear and disappear
    if(newWindow.document.getElementById(buttonValue).style.display == "none")
    {
        newWindow.document.getElementById(buttonValue).style.display = "block";
    } 
    else
    {
        newWindow.document.getElementById(buttonValue).style.display = "none";
    }
}

//this is used to exit out of the popup menu by trying to go to Score_Page.html but this triggers the loadstop function in menu functions
function closeBrowser()
{
    window.location.href = 'Score_Page.html';
}
