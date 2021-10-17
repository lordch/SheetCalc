const form = document.getElementById("form")


form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Clear old rectangle if exists
    var oldRect = document.getElementById("rectangle");
    if (oldRect != null){
        oldRect.parentNode.removeChild(oldRect);
    }


    //large Sheet attributes
    var largeSheetX = parseInt(form.elements.largeX.value);
    var largeSheetY = parseInt(form.elements.largeY.value);
    var largeSheetFiberDirection = form.elements.largeFiberDirection.value;
    var largeSheetMargin = parseInt(form.elements.largeMargin.value);
    var largeSheetNetX = largeSheetX - 2*largeSheetMargin;
    var largeSheetNetY = largeSheetY - 2*largeSheetMargin;

    console.log("largeSheetX: "+largeSheetX)
    console.log("largeSheetY: "+largeSheetY)
//    console.log("largeSheetFiberDirection: "+largeSheetFiberDirection)
    console.log("largeSheetMargin: "+largeSheetMargin)
//    console.log("largeSheetNetX: "+largeSheetNetX)
//    console.log("largeSheetNetY: "+largeSheetNetY)

    //small sheet attributes - get
    var smallSheetX = parseInt(form.elements.smallX.value);
    var smallSheetY = parseInt(form.elements.smallY.value);
    var smallSheetFiberDirection = form.elements.smallFiberDirection.value;
    var smallSheetMargin = parseInt(form.elements.smallMargin.value);
    var smallSheetGrossX = smallSheetX + 2*smallSheetMargin;
    var smallSheetGrossY = smallSheetY + 2*smallSheetMargin;

    console.log("smallSheetX: "+smallSheetX);
    console.log("smallSheetY: "+smallSheetY);
//    console.log("smallSheetFiberDirection: "+smallSheetFiberDirection)
    console.log("smallSheetMargin: "+smallSheetMargin);


    // align axis
    // count better alignment if fiber direction is not important

    console.log("smallSheetFiberDirection: " +smallSheetFiberDirection);
    console.log("largeSheetFiberDirection: " +largeSheetFiberDirection);
    if (smallSheetFiberDirection == "notImportant"){
        console.log("smallSheetFiberDirection not important");

        var xToX = Math.floor(largeSheetNetX/smallSheetGrossX) * Math.floor(largeSheetNetY/smallSheetGrossY);
        console.log("xToX: "+xToX);
        var xToY = Math.floor(largeSheetNetY/smallSheetGrossX) * Math.floor(largeSheetNetX/smallSheetGrossY);
        console.log("xToX: "+xToX);
        if (xToY > xToX){
          [smallSheetX, smallSheetY] = [smallSheetY, smallSheetX];
          console.log("y better than x, switching axis");
        }
    }
    else{
        console.log("Fiber direction important");
        if (largeSheetFiberDirection != smallSheetFiberDirection){
        console.log("Axis are not aligned");
        console.log("Switching axis");
        [smallSheetX, smallSheetY] = [smallSheetY, smallSheetX];
    }
    }

    // align to fiber direction


    console.log("After aligning axis: ")
    console.log("smallSheetX: "+smallSheetX)
    console.log("smallSheetY: "+smallSheetY)

    // calculate small sheet gross dimensions
    var smallSheetGrossX = smallSheetX + 2*smallSheetMargin;
    var smallSheetGrossY = smallSheetY + 2*smallSheetMargin;


    // calculate number of units on each axis and total number of units
    var unitsOnAxisX = Math.floor(largeSheetNetX/smallSheetGrossX);
    var unitsOnAxisY = Math.floor(largeSheetNetY/smallSheetGrossY);
    var numUnits = unitsOnAxisX * unitsOnAxisY;

//    console.log("unitsOnAxisX: "+unitsOnAxisX)
//    console.log("unitsOnAxisY: "+unitsOnAxisY)
//    console.log("numUnits: "+numUnits)

    // create largest possible sheet
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
//    console.log("startingMargin: "+startingMargin)

    var largeSheet = document.createElementNS(svgNS,'rect');
    largeSheet.setAttribute('x',startingMargin);
    largeSheet.setAttribute('y',startingMargin);
    largeSheet.setAttribute('width',largeSheetX);
    largeSheet.setAttribute('height',largeSheetY);
    largeSheet.setAttribute('fill','Gainsboro');
    largeSheet.setAttribute('stroke', 'black');
    largeSheet.setAttribute('stroke-width', 1)
    svg.appendChild(largeSheet);

//    console.log("largeSheetMargin+startingMargin: " +largeSheetMargin+startingMargin)
//    console.log("startingMargin: "+startingMargin)


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
//        console.log("Iterating over axis y, row number: " +l)
//        console.log("value of y " +y)
        var x = largeSheetMargin + startingMargin
//        console.log("starting value of x: " +x)
        for (let i = 0; i < unitsOnAxisX; i++) {
//            console.log("Iterating over axis x, column number: " +i)
//            console.log("Creating gross sheet, x value: " +x)

            var rectMax = document.createElementNS(svgNS,'rect');
            rectMax.setAttribute('x', x)   ;
            rectMax.setAttribute('y', y);
            rectMax.setAttribute('width',maxX);
            rectMax.setAttribute('height',maxY);
            rectMax.setAttribute('fill','#cceeff');
            rectMax.setAttribute('stroke', '#005580');
            svg.appendChild(rectMax);

            x += maxMarginX

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

            x += smallSheetGrossX;
            x += maxMarginX
        }
        y += maxY
//        y+= 2*smallSheetMargin + smallSheetY
    }
    // add svg to html
    document.getElementById("column-right").appendChild(svg);
    console.log("Number of units: " +numUnits)
    document.getElementById("numUnits").innerHTML = numUnits;
    document.getElementById("maxX").innerHTML = Math.floor(maxX);
// after=Math.floor(before*100)/100
    document.getElementById("maxY").innerHTML = Math.floor(maxY);
    document.getElementById("maxMarginX").innerHTML = Math.floor((maxMarginX+smallSheetMargin));
    document.getElementById("maxMarginY").innerHTML = Math.floor((maxMarginY+smallSheetMargin));
});

