
var velocityString = "";
var equationCoefficientArray = [];
var maxFractionIteration = 0;
/**
 * After the user leaves the score_page, reset the variables so that if they
 * come back with a different canvas curve, the new equations will be calculated.
 */
function resetVariables()
{
    velocityString = "";
    equationCoefficientArray = [];
}

/**
 * Wrapper to load the interpolation equation.
 * @return {String} equation
 */
function getInterpolation()
{
    //arrayValues contains 2 arrays, the first holding x values, the second y values.
    var arrayValues = getDataPoints();
    //console.log(arrayValues[0].toString()+" "+arrayValues[1].toString());
    return (interpolate(arrayValues[0],arrayValues[1]));
}

/**
 * Wrapper to load the integral equation.
 * @return {String} equation
 */
function getIntegral()
{
    return (integrate());
}

/**
 * Wrapper to load the derivative equation.
 * @return {String} equation
 */
function getDerivative()
{
    return (differentiate());
}

/**
 * Tells MathJax to format any text in ``
 */
function format()
{
    //Configures MathJax to desired properties.
    //Should give warning of unresolved variable in an IDE since the MathJax object
    //only exists when the Score_Page is loaded.
    MathJax.Hub.Config(
        {
        //Allows the equation to wrap between lines.
        "HTML-CSS": {linebreaks: {automatic: true}},
        //Tells MathJax not to display a progress bar in bottom left.
        messageStyle: "none"
        }
    );
    //Call MathJax to recheck the page to format any new equations.
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

/**
 * Takes a set of data points and interpolates them into an equation
 * using divided differences.
 * @return {String} velocityString
 */
function interpolate(xValues, yValues)
{
    var numPoints = xValues.length;
    var divDiff   = [];
    //The first column holds y values. The rest are calculated from these.
    divDiff.push(yValues.slice(0));
    
    /*
     * This loop calculates a triangular table using divided differences. The
     * top number of each column then becomes the coefficient in a newtons
     * form equation which has the form:
     * f(x) = f[x0] + f[x0, x1](x-x0) + f[x0,x1,x2](x-x0)(x-x1) + .. + f[x0,..,xk](x-x0)..(x-xk).
     * After these number have been calculated, then expand each term to get the final polynomial.
     */
    for(var i=1; i<numPoints; i++)
    {
        var column = [];
        divDiff.push(column);
        for(var j=0; j<(numPoints-i); j++)
        {
            var entry = ((divDiff[i-1][j+1] - divDiff[i-1][j]) / (xValues[i+j] - xValues[j]));
            column.push(entry);
        }
    }

    //Creates an array with the coefficients to the newton polynomial.
    var newtonPolynomialCoefficients = [];
    for(var i=0; i<divDiff.length; i++)
    {
        //Add the top element of each column to the array.
        newtonPolynomialCoefficients.push(divDiff[i][0]);
    }

    /*
     * This array is used to hold the coefficients of the finished polynomial.
     * The index in the array of each number represents the power of X that is
     * is the coefficient of. Example: If X[1] = 7, then 7 is the coefficient
     * of X^1.
     */
    var finalPolynomialCoefficients = [];
    //Initializes the array values to 0
    for(var i=0; i<divDiff.length; i++)
    {
        finalPolynomialCoefficients.push(0);
    }

    //console.log(newtonPolynomialCoefficients.toString());

    /*
     * Now that we have the newton polynomial, we have to expand each
     * term so that we end up with the standard form of it.
     */
    for(var i=0; i<newtonPolynomialCoefficients.length; i++)
    {
        var termNumbers = [];
        for(var j=0; j<i ;j++)
        {
            termNumbers.push(-xValues[j]);
        }
        /*
         * To find the expansion of (x-a1)(x-a2)...(x-ak), find the power set of all the 'a' values.
         * These sets represent the possible combinations in the expansion since for each polynomial,
         * either the x can be selected, or the 'a' value. This allows us to see which coefficient it goes
         * to since the number of missing a values signifies how many x values were multiplied.
         */
        var sets = powerSet(termNumbers);
        for(var j=0; j<sets.length; j++)
        {
            //Calculates the coefficient for the expansion across that set.
            var setCoefficient = newtonPolynomialCoefficients[i]*product(sets[j]);
            //Calculates which power of x it is the coefficient for.
            var xPower = termNumbers.length - sets[j].length;
            //Adds this set expansion to the final coefficients. This acts like summing all the like terms together.
            finalPolynomialCoefficients[xPower] += setCoefficient;
        }
    }
    //Save information to be used later.
    equationCoefficientArray = finalPolynomialCoefficients.slice(0);
    velocityString = equationToString(finalPolynomialCoefficients);

    //console.log(velocityString);
    return velocityString;
}

/**
 * Takes the function generated from the interpolation and integrates it to obtain a position function.
 * @return {String} distanceString
 */
function integrate()
{
    //If the interpolation hasn't been calculated yet, you must do it before you integrate.
    if(equationCoefficientArray.length === 0)
    {
        var arrayValues = getDataPoints();
        interpolate(arrayValues[0],arrayValues[1]);
    }

    //Perform integration by dividing the coefficient by the index+1 and shifting it in the array.
    var integralCoefficients = [0];
    for(var i=0; i<equationCoefficientArray.length;i++)
    {
        integralCoefficients.push(equationCoefficientArray[i]/(i+1));
    }

    var distanceString = equationToString(integralCoefficients);
    //console.log(distanceString);
    return distanceString;
}

/**
 * Takes the function generated from the interpolation and differentiates it to obtain an acceleration function.
 * @return {String} accelerationString
 */
function differentiate()
{
    //If the interpolation hasn't been calculated yet, you must do it before you differentiate.
    if(equationCoefficientArray.length === 0)
    {
        var arrayValues = getDataPoints();
        interpolate(arrayValues[0],arrayValues[1]);
    }
    var derivativeCoefficients = [];

    //Perform differentiation by multiplying the coefficient by teh index and shifting it in the array.
    for(var i=1; i<equationCoefficientArray.length;i++)
    {
        derivativeCoefficients.push(equationCoefficientArray[i]*i);
    }
    var accelerationString = equationToString(derivativeCoefficients);

    //console.log(accelerationString);
    return accelerationString;
}

/**
 * Gets the data points from the canvas and returns it in an array containing 2 arrays, the first for x 
 * values and the second for y values. The ith x value corresponds to the ith y value.
 * @return {Array} values
 */
function getDataPoints()
{
    //Load data points from storage.
    var canvasPoints = JSON.parse(localStorage.ds);
    var xValues = [];
    var yValues = [];

    //Taking too many points in results in a very large polynomial being produced so split it up
    //so that we are only taking about 10 - 11 which still gives a pretty good accuracy, but reduces
    //the size that would be generated for say 50 points.
    var pointGap = 1;
    if(canvasPoints.length > 10)
    {
        pointGap = canvasPoints.length / 10;
    }

    for(var i=0; i<canvasPoints.length; i=i+pointGap)
    {
        xValues.push(Math.round(i));
        yValues.push(canvasPoints[Math.round(i)]);
        console.log(canvasPoints[Math.round(i)].toString());
    }
    return [xValues,yValues];
}

/**
 * Takes an array of coefficients where the index is the power of x,
 * converts any decimals into fractions and returns a string of the equation.
 * @param {Array} coefficients
 * @return {String} equation
 */
function equationToString(coefficients)
{
    var equation = "";
    //Iterate through the coefficients constructing a string from it.
    for(var i=coefficients.length-1; i>=0; i--)
    {
        //If the coefficient is 0, then skip that term.
        if(coefficients[i] !== 0)
        {
            var fraction = decimalToFraction(coefficients[i]);
            //Add the sign to the equation.
            if(fraction.isPositive())
            {
                equation = equation.concat("+");
            }
            else
            {
                equation = equation.concat("-");
            }
            //How to format if coefficient is fraction.
            if(fraction.denominator !== 1)
            {
                //Add the numerator. Surround the numerator and x value in brackets for format reasons.
                equation = equation.concat("("+Math.abs(fraction.numerator));
                //Add the x except on the x^0 term
                if(i !== 0)
                {
                    equation = equation.concat("x");
                    //Add the exponent to x except on x^1 since it is just x.
                    if(i !== 1)
                    {
                        equation = equation.concat("^"+i);
                    }
                }
                equation = equation.concat(")/"+Math.abs(fraction.denominator));
            }
            //How to format if coefficient is whole number.
            else
            {
                equation = equation.concat(Math.abs(fraction.numerator));
                //Add the x except on the x^0 term
                if(i !== 0)
                {
                    equation = equation.concat("x");
                    //Add the exponent to x except on x^1 since it is just x.
                    if(i !== 1)
                    {
                        equation = equation.concat("^"+i);
                    }
                }
            }
        }
    }
    return equation;
}

/**
 * Generates the power set of an array.
 * @param {Array} set
 * @return (Array) foundSets
 */
function powerSet(set)
{
    //Starts with an array containing only the empty array.
    var foundSets = [[]];

    //Go through all found sets adding that set back in with the next
    //element in the original set tacked onto it.
    for(var i=0; i<set.length; i++)
    {
        var counter = foundSets.length;
        for(var j=0; j<counter;j++)
        {
            foundSets.push(foundSets[j].concat(set[i]));
        }
    }
    return foundSets;
}

/**
 * Takes an array and returns the product of all the elements inside.
 * @param {Array} array
 * @returns {number} sum
 */
function product(array)
{
    var sum = 1;
    for(var i=0;i<array.length;i++)
    {
        sum *= array[i];
    }
    return sum;
}

/**
 * Takes a decimal and returns a String containing a fraction in the form "(x/y)",
 * or if y is a whole number, then just it by itself.
 * @param {number} decimal
 * @return {Fraction} equation
 */
function decimalToFraction(decimal)
{
    //A whole number % 1 will have no remainder whereas a decimal will.
    if((decimal % 1) !== 0)
    {
        /*
         * To calculate the fraction from a decimal, I'm using the method of continued fractions.
         * For easier use, I'm transforming all numbers into positive numbers that are greater
         * then 1. Then after finding the fraction of that number, I modify it back by either
         * multiplying by -1, or finding the reciprocal.
         */
        var isNegative = false;
        var isReciprocal = false;
        if(decimal < 0)
        {
            isNegative = true;
            decimal *= -1;
        }
        if(decimal < 1)
        {
            isReciprocal = true;
            decimal = 1/decimal;
        }

        //This array holds the a values using in continued fractions
        var aValues = continuedFraction([],decimal);
        maxFractionIteration = 0;
        //Start with the value 1/(last_a_Value)
        var numerator = 1;
        var denominator = aValues.pop();
        /*
         * This while loop iterates back through the aValues array, first adding the previous
         * fraction to a number/1 using common denominators, then it finds the reciprocal so
         * that when it repeats it for the next number, it is in the form x/y rather then 1/(y/x).
         */
        while(aValues.length > 0)
        {
            var temp = denominator;
            denominator = ((aValues.pop() * denominator) +numerator);
            numerator = temp;
        }

        /*
         * Since the previous while loop reciprocates the fraction in the last step,
         * this undoes that unless the decimal was originally between 1 and -1.
         * then it ignores this thus getting the original decimal in fraction form.
         */
        if(!isReciprocal)
        {
            var temp = numerator;
            numerator = denominator;
            denominator = temp;
        }
        if(isNegative)
        {
            numerator *= -1;
        }

        //Calculates the greatest common divisor.
        var divisor = gcd(numerator,denominator);
        //Creates a string with the fraction in it with the smallest denominator that can be calculated.
        return new Fraction(numerator/divisor,denominator/divisor);
    }
    else
    {
        //If the number is not a decimal, then just return it.
        return new Fraction(decimal,1);
    }
}

/**
 * Finds the greatest common divisor between 2 integers.
 * @param {number} numA
 * @param {number} numB
 * @return {number} small
 */
function gcd(numA, numB)
{
    //Find the largest and smallest numbers.
    var large = Math.max(numA, numB);
    var small = Math.min(numA, numB);

    //Using Euclid's algorithm, this method iterates over the numbers
    //until to finds one where they divide with no remainder.
    while((large % small) !== 0)
    {
        var temp = large;
        large = small;
        small = temp % small;
    }
    return small;
}

/**
 * Takes a positive number > 1 and returns an array containing the 'a' values
 * used in continued fractions to generate a fraction from a decimal recursively.
 * @param {Array} aValues
 * @param  {number} currentNumber
 * @returns {Array} aValues
 */
function continuedFraction(aValues,currentNumber)
{
    //Finds the integer and fraction parts of the number.
    var integerPart = Math.floor(currentNumber);
    var fractionPart = currentNumber - integerPart;
    maxFractionIteration++;

    //Finds the distance the fraction has to go to reach either 1 or 0
    var ceilingDifference = Math.ceil(fractionPart) - fractionPart;
    var floorDifference = fractionPart - Math.floor(fractionPart);

    /*
     * If the ceiling or floor distance is less then 0.001, then I'm assuming it
     * has reached a whole number and thus should stop calculating the continued fraction.
     * If the distance is greater then that, then call this function again passing in the
     * reciprocal of the fraction part of the number.
     */
    if(ceilingDifference < 0.001 || floorDifference < 0.001 || maxFractionIteration > 12)
    {
        aValues.push(Math.round(currentNumber));
    }
    else
    {
        aValues.push(integerPart);
        continuedFraction(aValues,(1/fractionPart));
    }
    return aValues;
}

/**
 * Creates a constructor which defines a fraction.
 * @param numerator
 * @param denominator
 * @constructor
 */
function Fraction(numerator, denominator)
{
    this.numerator = numerator;
    this.denominator = denominator;

    /**
     * Checks whether the fraction is positive or negative.
     * @returns {boolean} isPositive
     */
    this.isPositive = function()
    {
        if(numerator > 0 && denominator > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
}
