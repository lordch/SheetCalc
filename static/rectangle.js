const form = document.getElementById("form")


form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Clear old rectangle if exists
    var oldRect = document.getElementById("rectangle");
    if (oldRect != null){
        oldRect.parentNode.removeChild(oldRect);
    }

    //set large Sheet attributes
    var largeSheetX = parseInt(form.elements.largeX.value);
    var largeSheetY = parseInt(form.elements.largeY.value);
    if (largeSheetX >= largeSheetY){
        var largeSheetLongAxis = 'x'
    }
    else{
        var largeSheetLongAxis = 'y'
    }
    var largeSheetFiberDirection = form.elements.largeFiberDirection.value;
    var largeSheetMargin = parseInt(form.elements.largeMargin.value);
    var largeSheetNetX = largeSheetX - 2*largeSheetMargin;
    var largeSheetNetY = largeSheetY - 2*largeSheetMargin;

    //set small sheet attributes
    var smallSheetX = parseInt(form.elements.smallX.value);
    var smallSheetY = parseInt(form.elements.smallY.value);
    if (smallSheetX >= smallSheetY){
        var smallSheetLongAxis = 'x'
    }
    else{
        var smallSheetLongAxis = 'y'
    }
    var smallSheetFiberDirection = form.elements.smallFiberDirection.value;
    var smallSheetMargin = parseInt(form.elements.smallMargin.value);
    var smallSheetGrossX = smallSheetX + 2*smallSheetMargin;
    var smallSheetGrossY = smallSheetY + 2*smallSheetMargin;

    // align axis
    // calculate best alignment if fiber direction is not important
    if (smallSheetFiberDirection == "notImportant"){
        var xToX = Math.floor(largeSheetNetX/smallSheetGrossX) * Math.floor(largeSheetNetY/smallSheetGrossY);
        var xToY = Math.floor(largeSheetNetY/smallSheetGrossX) * Math.floor(largeSheetNetX/smallSheetGrossY);
        if (xToY > xToX){
          [smallSheetX, smallSheetY] = [smallSheetY, smallSheetX];
        }
    }
    else{
       // align to fiber direction if fiber direction is important
        var longAxisEqual = (smallSheetLongAxis == largeSheetLongAxis)
        var fiberDirectionEqual = (smallSheetFiberDirection == largeSheetFiberDirection)
        if (longAxisEqual && !fiberDirectionEqual){
             [smallSheetX, smallSheetY] = [smallSheetY, smallSheetX];
        }
        if (!longAxisEqual && fiberDirectionEqual){
             [smallSheetX, smallSheetY] = [smallSheetY, smallSheetX];
        }
    }


    // calculate small sheet gross dimensions
    var smallSheetGrossX = smallSheetX + 2*smallSheetMargin;
    var smallSheetGrossY = smallSheetY + 2*smallSheetMargin;

    // calculate number of units on each axis and total number of units
    var unitsOnAxisX = Math.floor(largeSheetNetX/smallSheetGrossX);
    var unitsOnAxisY = Math.floor(largeSheetNetY/smallSheetGrossY);
    var numUnits = unitsOnAxisX * unitsOnAxisY;

    // create largest possible small sheet
    var maxX = largeSheetNetX/unitsOnAxisX
    var maxY = largeSheetNetY/unitsOnAxisY
    var maxMarginX = (maxX - smallSheetGrossX)/2
    var maxMarginY = (maxY - smallSheetGrossY)/2

    //Create svg
    var svg   = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var svgNS = svg.namespaceURI;
    svg.setAttribute('width', "100%");
    svg.setAttribute('height', "100%");
    svg.setAttribute('id', "rectangle");
    svg.setAttribute('viewBox',"-10 -10 1100 800")

    //Draw Large sheet
    const startingMargin = 1
    var largeSheet = document.createElementNS(svgNS,'rect');
    largeSheet.setAttribute('x',startingMargin);
    largeSheet.setAttribute('y',startingMargin);
    largeSheet.setAttribute('width',largeSheetX);
    largeSheet.setAttribute('height',largeSheetY);
    largeSheet.setAttribute('fill','Gainsboro');
    largeSheet.setAttribute('stroke', 'black');
    largeSheet.setAttribute('stroke-width', 1)
    svg.appendChild(largeSheet);

    //Draw large sheet net
    var largeSheetNet = document.createElementNS(svgNS,'rect');
    largeSheetNet.setAttribute('x',largeSheetMargin+startingMargin);
    largeSheetNet.setAttribute('y',largeSheetMargin+startingMargin);
    largeSheetNet.setAttribute('width',largeSheetNetX);
    largeSheetNet.setAttribute('height',largeSheetNetY);
    largeSheetNet.setAttribute('fill','white');
    largeSheetNet.setAttribute('stroke', 'gray');
    svg.appendChild(largeSheetNet);

    // draw small sheets
    var y = largeSheetMargin + startingMargin

    // iterate over axis y
    for (let l = 0; l < unitsOnAxisY; l++){
        var x = largeSheetMargin + startingMargin
        // create rectangles iterating over axis x
        for (let i = 0; i < unitsOnAxisX; i++) {
            // draw largest possible small sheet
            var rectMax = document.createElementNS(svgNS,'rect');
            rectMax.setAttribute('x', x)   ;
            rectMax.setAttribute('y', y);
            rectMax.setAttribute('width',maxX);
            rectMax.setAttribute('height',maxY);
            rectMax.setAttribute('fill','#cceeff');
            rectMax.setAttribute('stroke', '#005580');
            svg.appendChild(rectMax);

            x += maxMarginX

            //draw small sheet gross
            var rectGross = document.createElementNS(svgNS,'rect');
            rectGross.setAttribute('x', x)   ;
            rectGross.setAttribute('y', y+maxMarginY);
            rectGross.setAttribute('width',smallSheetGrossX);
            rectGross.setAttribute('height',smallSheetGrossY);
            rectGross.setAttribute('fill','#b3e6ff');
            rectGross.setAttribute('stroke', '#b3e6ff');
            svg.appendChild(rectGross);

            // draw small sheet net
            var rect = document.createElementNS(svgNS,'rect');
            rect.setAttribute('x', x+smallSheetMargin) ;
            rect.setAttribute('y', y+smallSheetMargin+maxMarginY);
            rect.setAttribute('width',smallSheetX);
            rect.setAttribute('height',smallSheetY);
            rect.setAttribute('fill','white');
            rect.setAttribute('stroke', 'black');
            svg.appendChild(rect);

            // move along x axis
            x += smallSheetGrossX;
            x += maxMarginX
        }
        // move along y axis
        y += maxY
    }

    // add svg to html
    document.getElementById("column-right").appendChild(svg);

    // display results
    document.getElementById("numUnits").innerHTML = numUnits;
    document.getElementById("maxX").innerHTML = Math.floor(maxX);
    document.getElementById("maxY").innerHTML = Math.floor(maxY);
    document.getElementById("maxMarginX").innerHTML = Math.floor((maxMarginX+smallSheetMargin));
    document.getElementById("maxMarginY").innerHTML = Math.floor((maxMarginY+smallSheetMargin));
});

