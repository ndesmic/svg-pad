const SvgToCanvas2 = (function() {

    const defaults = {
        canvas: null //required
    };

    function create(options) {
        let svgToCanvas = {};
        svgToCanvas.options = Object.assign({}, defaults, options);
        bind(svgToCanvas);
        svgToCanvas.init();
        return svgToCanvas;
    }

    function bind(svgToCanvas) {
        svgToCanvas.render = render.bind(svgToCanvas);
        svgToCanvas.init = init.bind(svgToCanvas);
    }

    function init() {
        const canvas = this.options.canvas || document.createElement("canvas");
        this.canvasRenderer = CanvasRenderer.create({
            canvas
        });
    }

    function render(svgText) {
        const svgDoc = parseXml(svgText);
        const svgElement = svgDoc.childNodes[0];
        const context = this.canvasRenderer.context;
        const canvas = context.canvas;
        canvas.setAttribute("height", getAttr(svgElement, "height"));
        canvas.setAttribute("width", getAttr(svgElement, "width"));

        drawElement(svgElement, {
            document: svgDoc,
            context: context,
            defs: {
              clipPaths : {}
            }
        });

        return canvas;
    }

    function drawElement(element, scope) {
        switch (element.nodeName) {
            case "defs":
            case "svg":
            case "g":
                drawAtomic(drawContainer, element, scope);
                break;
            case "#text":
                break;
            case "text":
                drawAtomic(drawText, element, scope);
                break;
            case "line":
                drawAtomic(drawLine, element, scope);
                break;
            case "polygon":
                drawAtomic(drawPolygon, element, scope)
                break;
            case "path":
                drawAtomic(drawPath, element, scope);
                break;
            case "rect":
                drawAtomic(drawRectangle, element, scope);
                break;
            case "circle":
                drawAtomic(drawCircle, element, scope);
                break;
            case "ellipse":
                drawAtomic(drawEllipse, element, scope);
                break;
            case "clipPath":
                const clipPath = getAsClipPath(element);
                scope.defs.clipPaths[clipPath.id] = clipPath.elements;
                break;
            default:
                console.error("No implementation for element: " + element.nodeName)
        }
    }

    function drawAtomic(drawFunc) {
        const scope = arguments[2];//maybe flip the params or use this
        scope.context.save();
        drawFunc.apply(this, Array.prototype.slice.call(arguments, 1));
        scope.context.restore();
    }

    function getAsClipPath(element) {
        return {
            id: element.id,
            elements: element.childNodes
        };
    }

    function getAttrs(element, attributeNames = []) {
        let attrs = {
            stroke: getAttr(element, "stroke"),
            strokeWidth: getAttr(element, "stroke-width"),
            fill: getAttr(element, "fill"),
            clipPath: getUrlAttr(element, "clip-path")
        };
        for(let attrName of attributeNames){
          attrs[attrName] = getAttr(element, attrName);
        }
        return attrs;
    }

    function getAttr(element, name) {
        var attr = element.attributes[name]
        if (attr) {
            return attr.value;
        }
        if (element.style && element.style[name]) {
            return element.style[name];
        }
        return null;
    }

    function getUrlAttr(element, name){
      var attr = getAttr(element, name);
      if(attr){
        attr = attr.replace(/url\(/, "");
        attr = attr.replace(")", "");
        attr =  attr.replace(/^#/, "");
      }
      return attr;
    }

    function setContext(context, attrs){
      context.lineWidth = attrs.strokeWidth;
      context.strokeStyle = attrs.stroke;
      context.fillStyle = attrs.fill;
    }

    function parseXml(xmlString) {
        let parser = new DOMParser();
        return parser.parseFromString(xmlString, "text/xml");
    }

    function parsePoints(pointsString){
      var rawList = pointsString.split(" ");
      var pointsList = [];

      for(var i = 0; i < rawList.length; i++){
        var point = rawList[i].split(",");
        pointsList.push(point);
      }

      return pointsList;
    }

    function clip(clipPath, scope){
        scope.context.beginPath();
        for(let element of clipPath){
          drawElement(element, scope);
        }
        scope.context.clip();
    }

    function drawContainer(element, scope){
      const attrs = getAttrs(element);
      if (attrs.clipPath) {
          clip(scope.defs.clipPaths[attrs.clipPath], scope);
      }
      for(var i = 0; i < element.childNodes.length; i++){
        var el = element.childNodes[i];
        drawElement(el, scope);
      }
    }

    function drawRectangle(element, scope) {
        const attrs = getAttrs(element, ["x", "y", "height", "width"]);
        setContext(scope.context, attrs);

        if (attrs.clipPath) {
            clip(scope.defs.clipPaths[attrs.clipPath], scope);
        }

        scope.context.rect(attrs.x, attrs.y, attrs.width, attrs.height);
        strokeAndFill(attrs,scope);
    }

    function drawPolygon(element, scope){
      const attrs = getAttrs(element, ["points"]);
      const points = parsePoints(attrs.points);
      setContext(scope.context, attrs);

      if (attrs.clipPath) {
          clip(scope.defs.clipPaths[attrs.clipPath], scope);
      }

      scope.context.beginPath();
      scope.context.moveTo(points[0][0], points[0][1]);

      for(let i = 1; i < points.length; i++){
        scope.context.lineTo(points[i][0], points[i][1]);
      }

      scope.context.closePath();
      strokeAndFill(attrs, scope);
    }

    function strokeAndFill(attrs, scope){
      if(attrs.fill){
        scope.context.fill();
      }
      if(attrs.stroke){
        scope.context.stroke();
      }
    }

    return {
      create
    };

})();