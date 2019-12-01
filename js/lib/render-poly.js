const svgns = "http://www.w3.org/2000/svg";

export function renderPolygon(height, width, points, fill, stroke, strokeWidth){
    const svg = document.createElementNS(svgns, "svg");
    svg.setAttributeNS(null, "height", height);
    svg.setAttributeNS(null, "width", width);
    const polygon = document.createElementNS(svgns, "polygon");
    polygon.setAttributeNS(null, "points", points.map(p => p.join(",")).join(" "));
    polygon.setAttributeNS(null, "fill", fill);
    polygon.setAttributeNS(null, "stroke", stroke);
    polygon.setAttributeNS(null, "stroke-width", strokeWidth);
    svg.appendChild(polygon);
    return svg;
}
export function renderPath(height, width, points, fill, stroke, strokeWidth){
    const svg = document.createElementNS(svgns, "svg");
    svg.setAttributeNS(null, "height", height);
    svg.setAttributeNS(null, "width", width);
    const path = document.createElementNS(svgns, "path");
    path.setAttributeNS(null, "d", `M${points[0][0]},${points[0][1]} ` + points.slice(1).map(([x,y]) => `L${x},${y}`).join(" ") + "Z");
    path.setAttributeNS(null, "fill", fill);
    path.setAttributeNS(null, "stroke", stroke);
    path.setAttributeNS(null, "stroke-width", strokeWidth);
    svg.appendChild(path);
    return svg;
}