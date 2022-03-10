/*
? @document-start
=========================
| ELEMENT API UTILITIES |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          eutil.js
? @document-created:       03/04/2022
? @document-modified:      03/07/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

This library was designed to work with the Code Quiz program

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

|
* eutil.addToPropertyCache([object] "element", [hash-table] "settings") {
    Purpose:    Save current element properties given a dictionary of properties to save.

    Params:     [object] "element"
                The raw HTML element object

                [hash-table] "settings"
                The dictionary of element properties to save. Dictionary structure should look like this:
                ---
                {"property01": true, "property02": true, ...}
                ---

                Where associating a value of 'true' with the given property name indicates it will be saved. This dictionary 
                can also be nested:
                ---
                {"property01: true, "property02": {"property11": true", ...}, ...}
                ---

    Returns:    [hash-table] The the saved properties of the element.

    Example:

    // get the element & set some text
    let element = document.getElementByTagName("H1");
    element.textContent = "Hello, world!";

    // save the textContent for the element internally
    let result = eutil.addToPropertyCache(element, {"textContent": true});
    console.log(result) --> { "textContent": "Hello, world!" }
}

|
* eutil.getPropertyCache([object] "element", *[string] "property") {
    Purpose:    Get the saved properties from when 'addToPropertyCache' was last called on the element

    Params:     [object] "element"
                The raw HTML element object

                *[string] "property"
                An initial index of the element.

    Result:     The saved property table of the element

    Example:

    // get the element
    let element = document.getElementByTagName("H1");
    element.textContent = "Hello, world!";


==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   

==================================================================================================================================
*/

const eutil = {}
const defaultElementStates = {}

// @note create a better way to store default css properties
eutil.addToPropertyCache = function(element, settings) {
    let writePath = {}
    let readPath = element;

    // recursive function
    function deepSearch(currentPath) {
        for (let key in currentPath) {
            let value = currentPath[key];
            const valueStyle = key === "style" ? getComputedStyle(element) : readPath[key]; // thanks Javascript and CSS... >_>
            const typeofValue = typeof value;

            if (typeofValue === "object" && typeofValue != null && typeofValue != undefined) {
                writePath[key] = {}                 // create new ref
                const prevWritePath = writePath;    // save old ref(s)
                const prevReadPath = readPath;
                writePath = writePath[key];         // update current ref(s) to new ref(s)
                readPath = valueStyle;

                deepSearch(value);                  // start recursion branch

                readPath = prevReadPath;            // revert back to old ref after recursion branch
                writePath = prevWritePath;
            } else {
                writePath[key] = valueStyle;        // write to normal fields
            }
        }
    }

    // begin recursive search
    deepSearch(settings);
    defaultElementStates[element] = writePath;

    // return the actual property table in regard to the settings
    return writePath;
}

eutil.getPropertyCache = function(element, attribute) {
    return attribute ? defaultElementStates[element][attribute] : defaultElementStates[element];
}

eutil.hideElement = function(element, keepInFlow) {
    if (keepInFlow) {
        element.style.visibility = "hidden";
    } else {
        element.style.display = "none";
    }
}

eutil.showElement = function(element) {
    element.style.visibility = "visible"
    element.style.display = this.getPropertyCache(element, "style").display;
}

eutil.clearChildrenOnElement = function(element) {
    let children = element.children;
    for (let i = children.length - 1; i >= 0; i--) {
        children[i].remove();
    }
}

eutil.generateDynamicText = function($parent, data) {
    this.clearChildrenOnElement($parent);

    // generate text children
    for (let i = 0; i < data.length; i++) {
        const info = data[i];
        const $subtext = document.createElement("span");

        $subtext.textContent = info.content;
        if (info.style) $subtext.setAttribute("style", info.style);

        $parent.append($subtext);
    }

    // return text children
    return $parent.children;
}

// export utility
export default eutil;
