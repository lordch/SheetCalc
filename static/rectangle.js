const form = document.getElementById("form");
const startingMargin = 50;
var viewBoxParams = "-10 -10 1300 900";
s = new XMLSerializer();

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
    var largeSheetFiberDirectionAxis
    if (largeSheetFiberDirection == 'long'){
        largeSheetFiberDirectionAxis = 'x'
    }
    else{
        largeSheetFiberDirectionAxis = 'y'
    }

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

    // calculate view box parameters
    var viewBoxX = largeSheetX + 2*startingMargin + 20
    var viewBoxY = largeSheetY + 2*startingMargin + 20
    var viewBoxArray = [-10, -10, viewBoxX, viewBoxY]
    viewBoxParams = viewBoxArray.join(" ");
    console.log(viewBoxParams)


    //Create svg
    var svg   = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var svgNS = svg.namespaceURI;
    svg.setAttribute('width', "100%");
    svg.setAttribute('height', "100%");
    svg.setAttribute('id', "rectangle");
    svg.setAttribute('viewBox', viewBoxParams)

    //Draw Large sheet
    var largeSheet = document.createElementNS(svgNS,'rect');
    largeSheet.setAttribute('x',startingMargin);
    largeSheet.setAttribute('y',startingMargin);
    largeSheet.setAttribute('width',largeSheetX);
    largeSheet.setAttribute('height',largeSheetY);
    largeSheet.setAttribute('fill','#DCDCDC');
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
            rectGross.setAttribute('x', x);
            rectGross.setAttribute('y', y+maxMarginY);
            rectGross.setAttribute('width',smallSheetGrossX);
            rectGross.setAttribute('height',smallSheetGrossY);
            rectGross.setAttribute('fill','#00aaff');
            rectGross.setAttribute('fill-opacity', 0.2)
//            rectGross.setAttribute('stroke', '#b3e6ff');
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


    // Draw fiber direction lines
    var numFiberLines
    if (largeSheetFiberDirectionAxis == 'x'){
        numFiberLines = largeSheetNetY / 47
        var fiberLinesX = startingMargin + largeSheetMargin
        var fiberLinesY = startingMargin + largeSheetMargin
        for (let l = 0; l < numFiberLines; l++){
            var fiberLine = document.createElementNS(svgNS, 'line')
            fiberLine.setAttribute('x1', fiberLinesX )
            fiberLine.setAttribute('x2', fiberLinesX+largeSheetNetX)
            fiberLine.setAttribute('y1', fiberLinesY)
            fiberLine.setAttribute('y2', fiberLinesY)
            fiberLine.setAttribute('stroke', '#005580')
            fiberLine.setAttribute('stroke-opacity', 0.15)

            svg.appendChild(fiberLine)
            fiberLinesY += 47
        }
    }
    else{
        numFiberLines = largeSheetNetX / 47
        var fiberLinesX = startingMargin + largeSheetMargin
        var fiberLinesY = startingMargin + largeSheetMargin
        for (let l = 0; l < numFiberLines; l++){
            var fiberLine = document.createElementNS(svgNS, 'line')
            fiberLine.setAttribute('x1', fiberLinesX)
            fiberLine.setAttribute('x2', fiberLinesX)
            fiberLine.setAttribute('y1', fiberLinesY)
            fiberLine.setAttribute('y2', fiberLinesY + largeSheetNetY)
            fiberLine.setAttribute('stroke', '#005580')
            fiberLine.setAttribute('stroke-opacity', 0.15)

            svg.appendChild(fiberLine)
            fiberLinesX += 47
        }

    }



    //Draw large sheet axis labels
    var labelX = document.createElementNS(svgNS, 'text');
    labelX.setAttribute('x', largeSheetX/2 + startingMargin - 20);
    labelX.setAttribute('y', startingMargin - 10);
    labelX.setAttribute('font-size', "1.5em")
    labelX.innerHTML = largeSheetX;
    svg.appendChild(labelX);

    var labelY = document.createElementNS(svgNS, 'text');
    labelY.setAttribute('x', 0 );
    labelY.setAttribute('y', largeSheetY/2 + startingMargin + 5);
    labelY.setAttribute('font-size', "1.5em")
    labelY.innerHTML = largeSheetY;
    svg.appendChild(labelY);

    // add svg to html
    document.getElementById("svg").appendChild(svg);

    //enable download button
    document.getElementById('results').hidden = false
//    document.getElementById('download-button-png').hidden = false

    // display results
    document.getElementById("numUnits").innerHTML = numUnits;
    document.getElementById("maxX").innerHTML = Math.floor(maxX);
    document.getElementById("maxY").innerHTML = Math.floor(maxY);
    document.getElementById("maxMarginX").innerHTML = Math.floor((maxMarginX+smallSheetMargin));
    document.getElementById("maxMarginY").innerHTML = Math.floor((maxMarginY+smallSheetMargin));


    rectString = s.serializeToString(svg)
    console.log(rectString)
    fetch("/save", {
          method: "POST",
          body: rectString
        })

});

