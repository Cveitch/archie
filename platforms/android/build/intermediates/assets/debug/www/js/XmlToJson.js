/**
 * Created by Riley on 28/06/2016.
 */
//This code is directly referencing John Davis Dalton and David Walsh's code at https://davidwalsh.name/convert-xml-json

function xmlToJson(xml) 
{
   var attr,//assigns attributes
       child,
       attrs = xml.attributes,
       children = xml.childNodes,
       key = xml.nodeType,
       obj = {},
       i = -1;

   if (key == 1 && attrs.length)
   {
       obj[key = '@attributes'] = {};
       while (attr = attrs.item(++i))
       {
            obj[key][attr.nodeName] = attr.nodeValue;
       }
       i = -1;
   } else if (key == 3) 
   {
        obj = xml.nodeValue;
   }
   while (child = children.item(++i))//recursively searches for children and adds them to json file
   {
        key = child.nodeName;
        if (obj.hasOwnProperty(key)) 
        {
            if (obj.toString.call(obj[key]) != '[object Array]')
            {
                obj[key] = [obj[key]];
            }
            obj[key].push(xmlToJson(child));
        }
        else 
        {
            obj[key] = xmlToJson(child);
        }
    }
    return obj;
}

    /*--------------------------------------------------------------------------*/
//this is where we set the wolfram xml
var xml =
    '<ALEXA VER="0.9" URL="davidwalsh.name/" HOME="0" AID="=">' +
    '<SD TITLE="A" FLAGS="" HOST="davidwalsh.name">' +
    '<TITLE TEXT="David Walsh Blog :: PHP, MySQL, CSS, Javascript, MooTools, and Everything Else"/>' +
    '<LINKSIN NUM="1102"/>' +
    '<SPEED TEXT="1421" PCT="51"/>' +
    '</SD>' +
    '<SD>' +
    '<POPULARITY URL="davidwalsh.name/" TEXT="7131"/>' +
    '<REACH RANK="5952"/>' +
    '<RANK DELTA="-1648"/>' +
    '<COMMENT>foo</COMMENT>' +
    '</SD>' +
    '</ALEXA>';

//these statements allow for the json translated objects to be seen in the console of the browser
if (window.DOMParser) 
{
    xml = (new DOMParser).parseFromString(xml,'text/xml');
} else if (window.ActiveXObject) 
{
    xml = [new ActiveXObject('Microsoft.XMLDOM'), xml];
    xml[0].async = false;
    xml[0].loadXML(xml[1]);
    xml = xml[0];
}

    // in IE press F12 to use the developer tools console.
console.log(xmlToJson(xml)['ALEXA']);
window.alert(xmlToJson(xml));

