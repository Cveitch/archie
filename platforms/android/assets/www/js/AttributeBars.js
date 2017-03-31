/**
 * Object the represents three attribute bars and the ability to move the up or down.
 * @constructor
 */
function AttributeBars()
{
    /* If each game update tries to set the attribute bars, then it causes them to freak out since the values keep
     * changing. To get around this, if the attribute bar is already undergoing an update, just set the new value
     * to this new amount and let the previous animation continue on. */
    var newPercentBar1;
    var newPercentBar2;
    var newPercentBar3;
    var currentPercentBar1;
    var currentPercentBar2;
    var currentPercentBar3;
    var animatingBar1 = false;
    var animatingBar2 = false;
    var animatingBar3 = false;
    /**
     * Animates the bar moving between percent values.
     * @param name - name of object whose width is to be updated.
     * @param barNum - which attribute bar it is updating.
     */
    function animate(name,barNum)
    {
        switch(barNum)
        {
            case 1:
                animatingBar1 = true;
                break;
            case 2:
                animatingBar2 = true;
                break;
            case 3:
                animatingBar3 = true;
                break;
        }

        var element = document.getElementById(name);
        var id = setInterval(frame, 5);
        function frame()
        {
            stopCheck(barNum,id);
            frameCalculation(barNum,element);
        }
        /**
         * Checks if the animation is complete, and if so stops the update of it.
         * @param barNum - the attribute bar that it is moving.
         * @param repetitionId - reference to the object that is updating it.
         */
        function stopCheck(barNum,repetitionId)
        {
            //One case for each attribute bar.
            switch(barNum)
            {
                case 1:
                    if(currentPercentBar1 > 100 || currentPercentBar1 < 0 || currentPercentBar1 == newPercentBar1)
                    {
                        clearInterval(repetitionId);
                        animatingBar1 = false;
                    }
                    break;
                case 2:
                    if(currentPercentBar2 > 100 || currentPercentBar2 < 0 || currentPercentBar2 == newPercentBar2)
                    {
                        clearInterval(repetitionId);
                        animatingBar2 = false;
                    }
                    break;
                case 3:
                    if(currentPercentBar3 > 100 || currentPercentBar3 < 0 || currentPercentBar3 == newPercentBar3)
                    {
                        clearInterval(repetitionId);
                        animatingBar3 = false;
                    }
                    break;
            }
        }

        /**
         * Computes each frame of the update.
         * @param barNum
         * @param element
         */
        function frameCalculation(barNum,element)
        {
            //Move the width value up or down depending if the new value is larger or smaller the the current.
            //First computes the value, the sets the components new width.
            switch(barNum)
            {
                case 1:
                    if(currentPercentBar1 > newPercentBar1)
                        currentPercentBar1 -= 1;
                    else
                        currentPercentBar1 += 1;
                    element.style.width = (currentPercentBar1) + "%";
                    break;
                case 2:
                    if(currentPercentBar2 > newPercentBar2)
                        currentPercentBar2 -= 1;
                    else
                        currentPercentBar2 += 1;
                    element.style.width = (currentPercentBar2) + "%";
                    break;
                case 3:
                    if(currentPercentBar3 > newPercentBar3)
                        currentPercentBar3 -= 1;
                    else
                        currentPercentBar3 += 1;
                    element.style.width = (currentPercentBar3) + "%";
                    break;
            }
        }
    }

    /**
     * Makes sure that the given percent falls between 0 and 100.
     * @param percent
     * @returns {*}
     */
    function validPercent(percent)
    {
        if(percent >= 100)
        {
            percent = 100;
        }
        else if(percent <= 0)
        {
            percent = 0;
        }
        return percent;
    }

    /**
     * Calculates the percentage that the innerElement takes up of outerElement.
     * @param innerElement
     * @param outerElement
     * @returns {number}
     */
    function calcCurrentWidthPercent(innerElement, outerElement)
    {
        return Math.floor(document.getElementById(innerElement).offsetWidth / document.getElementById(outerElement).offsetWidth * 100);
    }

    /**
     * Sets the first attribute bar to a new value.
     * @param percent
     */
    this.setAttributeBar_1 = function(percent)
    {
        newPercentBar1 =  Math.round(validPercent(percent));
        if(!animatingBar1)
        {
            currentPercentBar1 = calcCurrentWidthPercent('attributeBar_1_animate','attributeBar_1');
            animate('attributeBar_1_animate',1);
        }
    };

    /**
     * Sets the second attribute bar to a new value.
     * @param percent
     */
    this.setAttributeBar_2 = function(percent)
    {
        newPercentBar2 =  Math.round(validPercent(percent));
        if(!animatingBar2)
        {
            currentPercentBar2 = calcCurrentWidthPercent('attributeBar_2_animate','attributeBar_2');
            animate('attributeBar_2_animate',2);
        }
    };

    /**
     * Sets the third attribute bar to a new value.
     * @param percent
     */
    this.setAttributeBar_3 = function(percent)
    {
        newPercentBar3 =  Math.round(validPercent(percent));
        if(!animatingBar3)
        {
            currentPercentBar3 = calcCurrentWidthPercent('attributeBar_3_animate','attributeBar_3');
            animate('attributeBar_3_animate',3);
        }
    };

    /**
     * Increments / Decrements the first attribute bar.
     * @param changePercent
     */
    this.changeAttributeBar_1 = function(changePercent)
    {
        var currentPercent = calcCurrentWidthPercent('attributeBar_1_animate','attributeBar_1');
        animate('attributeBar_1_animate',currentPercent + changePercent, currentPercent);
    };

    /**
     * Increments / Decrements the second attribute bar.
     * @param changePercent
     */
    this.changeAttributeBar_2 = function(changePercent)
    {
        var currentPercent = calcCurrentWidthPercent('attributeBar_2_animate','attributeBar_2');
        animate('attributeBar_2_animate',currentPercent + changePercent, currentPercent);
    };

    /**
     * Increments / Decrements the third attribute bar.
     * @param changePercent
     */
    this.changeAttributeBar_3 = function(changePercent)
    {
        var currentPercent = calcCurrentWidthPercent('attributeBar_3_animate','attributeBar_3');
        animate('attributeBar_3_animate',currentPercent + changePercent, currentPercent);
    };

}
