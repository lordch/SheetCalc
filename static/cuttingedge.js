const form = document.getElementById("form");
const startingMargin = 50;
s = new XMLSerializer();
const transformation = 0.7071067812/2


form.addEventListener('submit', (event) => {
    event.preventDefault();

    var oldRect = document.getElementById("rectangle");
    if (oldRect != null){
        oldRect.parentNode.removeChild(oldRect);
    }

    // rotation
    // rotX = form.elements.horizontalRotation.value
    // rotY = form.elements.verticalRotation.value
    // console.log("rotx: "+rotX)
    // console.log('rotY: '+rotY)

    // set material thickness
    var materialThickness = parseFloat(form.elements.materialThickness.value);

    //set bottom inside attributes
    var bottomInsideLength = parseInt(form.elements.bottomLength.value);
    var bottomInsideWidth = parseInt(form.elements.bottomWidth.value);
    var bottomInsideHeight = parseInt(form.elements.bottomHeight.value);

    //set bottom outside attributes
    var bottomOutLength = bottomInsideLength + 2*materialThickness
    var bottomOutWidth = bottomInsideWidth + 2*materialThickness
    var bottomOutHeight = bottomInsideHeight + materialThickness

    //set top outside attributes
    var topOutHeight = parseInt(form.elements.topHeight.value);
    var topOutLength = bottomOutLength + 2*materialThickness
    var topOutWidth = bottomOutWidth + 2*materialThickness

    //calculate flat dimensions
    var bottomFlatWidth = bottomOutLength + 2*bottomOutHeight
    var bottomFlatHeight = bottomOutWidth + 2*bottomOutHeight

    var topFlatWidth = topOutLength + 2*topOutHeight
    var topFlatHeight = topOutWidth + 2*topOutHeight

    //calculate starting coordinates

    var dist3dWidth = startingMargin + topOutLength + topOutWidth * transformation
    var dist3dHeight =  topOutHeight + topOutWidth * transformation

    var top3dX = startingMargin
    var top3dY = startingMargin*2 + topFlatHeight - dist3dHeight - 30

    var bottom3dX = startingMargin
    var bottom3dY = top3dY + dist3dHeight + 20

    var flatX = top3dX + dist3dWidth + 100

    var topX = flatX + (bottomFlatWidth - topFlatWidth)/2
    var topY = startingMargin

    var bottomX = flatX
    var bottomY = startingMargin*2 + topFlatHeight

    

   

    //create top and bottom elements
    var top = [topX, topY, topOutLength, topOutWidth, topOutHeight]
    var bottom = [bottomX, bottomY, bottomOutLength, bottomOutWidth, bottomOutHeight]
    
    var top3D = [top3dX, top3dY, topOutLength, topOutWidth, topOutHeight, "top"]
    var bottom3D = [bottom3dX, bottom3dY, bottomOutLength, bottomOutWidth, bottomOutHeight, "bottom"]


    // CREATE SVG
    var svg   = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var svgNS = svg.namespaceURI;
    svg.setAttribute('width', "100%");
    svg.setAttribute('height', "100%");
    svg.setAttribute('id', "rectangle");
    svg.setAttribute('viewBox', "-10 -10 1500 1500")
    

    function drawRectangle(x, y, width, height){
        var rect = document.createElementNS(svgNS,'rect');
        rect.setAttribute('x', x) ;
        rect.setAttribute('y', y);
        rect.setAttribute('width',width);
        rect.setAttribute('height',height);
        rect.setAttribute('class', "cutting-edge-rect")
        svg.appendChild(rect);

    }
    function drawCuttingEdge(x, y, length, width, height){

        var x1 = x
        var y1 = y
        var length = length 
        var width = width
        var height = height

        
        var x2 = x1 + height
        var x3 = x2 + length
        var x4 = x3 + height

        var y2 = y1 + height
        var y3 = y2 + width
        var x4 = x3 + height

        rectangles = [
            [x1, y2, height, width],
            [x2, y1, length, height],
            [x2, y2, length, width],
            [x2, y3, length, height],
            [x3, y2, height, width]
        ]

        rectangles.forEach(rectangle => drawRectangle(...rectangle))    
    }

    function drawPolygon(points){
        var poly = document.createElementNS(svgNS, 'polygon')
        poly.setAttribute('points', points)
        // poly.setAttribute('stroke', 'black')
        // poly.setAttribute('fill', "coral")
        // poly.setAttribute('fill-opacity', 0.95)
        svg.appendChild(poly)
    }

    function drawCuttingEdge3D(x, y, length, width, height, type){
        var x = x   
        var y = y
        var length = length 
        var width = width
        var height = height
        var widthTrans = width * transformation

        console.log("punkty")
        let x1 = [x, y]
        let x2 = [x+length, y]
        let x3 = [x+length, y+height]
        let x4  = [x, y+height]
        let x5 = [x + widthTrans, y + widthTrans]
        let x6 = [x+length + widthTrans, y + widthTrans]
        let x7 = [x+length + widthTrans, y+height + widthTrans]
        let x8 = [x + widthTrans, y+height + widthTrans]

        let points = [x1, x2, x3, x4, x5, x6, x7, x8]
        points.forEach(point => console.log(point))

        
        let sides = [
            [x1, x2, x3, x4, x1],
            [x1, x5, x8, x4, x1],
            [x2, x6, x7, x3, x2],
            [x5, x6, x7, x8, x5],
            [x1, x2, x6, x5, x1],
        ]    

        if(type=="bottom"){
            sides.pop()
            sides.unshift([x4, x8, x7, x3, x4])
        }

        sides.forEach(side => drawPolygon(side.join(" ")))

    }



    drawCuttingEdge(...top)
    drawCuttingEdge(...bottom)
    drawCuttingEdge3D(...top3D)
    drawCuttingEdge3D(...bottom3D)
    document.getElementById("svg").appendChild(svg);
    
    document.getElementById("topFlatWidth").innerHTML = Math.floor((topFlatWidth));
    document.getElementById("topFlatHeight").innerHTML = Math.floor((topFlatHeight));
    document.getElementById("bottomFlatWidth").innerHTML = Math.floor((bottomFlatWidth));
    document.getElementById("bottomFlatHeight").innerHTML = Math.floor((bottomFlatHeight));


    
    
});

