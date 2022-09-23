//
//  svg-1.js    2022-08-02    usp
//

export const svgNameSpace = "http://www.w3.org/2000/svg" ;

export function createElement( name, attributes = { } ) {
	const e = document.createElementNS( svgNameSpace, name );
	for ( const [key, value] of Object.entries( attributes )) e.setAttribute( key, value.toString( ) );
	return e ;
	}

export function arc ( x1, y1, r, a, x2, y2 attributes = { } ) {
	attributes.d = `M ${x1} ${y1} A ${r} ${r} ${a} 0 0 ${x2} ${y2}` ;
	return createElement( "path", attributes );
	}

export function circle ( x, y, r, attributes = { } ) {
	attributes.cx = x ;
	attributes.cy = y ;
	attributes.r = r ;
	return createElement( "circle", attributes );
	}

export function line ( x1, y1, x2, y2, attributes = { } ) {
	attributes.x1 = x1 ;
	attributes.y1 = y1 ;
	attributes.x2 = x2 ;
	attributes.y2 = y2 ;
	return createElement( "line", attributes );
	}

export function oval ( r1, r2, r, angle, attributes = { } ) {
	attributes.d = `M ${-r} ${r1} A ${r} ${r} 180 0 0 ${+r} ${r1} V ${r2} A ${r} ${r} 180 0 0 ${-r} ${r2} V ${r1}` ;
	attributes.transform = `rotate( ${angle} )` ;
	return createElement( "path", attributes );
	}

export function rect ( x, y, w, h, rx=0, ry=0, attributes = { } ) {
	attributes.x = x ;
	attributes.y = y ;
    attributes.width = w ;
    attributes.height = h ;
    attributes.rx = rx ;
    attributes.ry = ry ;
	return createElement( "rect", attributes );
    }

export function text ( x, y, s, attributes = { } ) {
	attributes.x = x ;
	attributes.y = y ;
	const e = createElement( "text", attributes );
    e.textContent = s ;
    return e ;
	}

function lineIntersection ( m1, b1, m2, b2 ) {
    if ( m1 === m2 ) throw new Error("parallel slopes");
    const x = (b2 - b1) / (m1 - m2);
    return {x: x, y: m1 * x + b1};
}

function pStr ( point, offsetX=0, offsetY=0 ) {
  return `${point.y + offsetX},${-point.x + offsetY} `; // exchange of parameters rotates path 90 degree counter-clockwise
}

export function spiralPathString ( x0, y0, r0, deltaR, a0, count, deltaA, offsetX=0, offsetY=0 ) {
	/// Create a data string for an approximated spiral path.
    ///  Approximates an archimedian spiral with bezier curves.
    ///  Adaption from Zev Eisenberg and ccprog at https://stackoverflow.com/a/49099258
    ///  x0, y0 : Center coordinate
    ///  r0 : Initial radius at starting angle
    ///  deltaR : Radius increment per turn
    ///  a0, a2 : Start and end angles
	///	  count : number of ticks, usually more than 12
    ///  deltaA : Angle increment
	///  offsetX, offsetY : These values will be added to the x and y coordinates of the generated points.
    deltaR = deltaR / Math.PI / 2;   // normalize to radian
    const a2 = (a0 + count * deltaA) * Math.PI / 180;  // end angle
    // angles to radians
    let a1 = a0 = a0 * Math.PI / 180;
    deltaA = deltaA * Math.PI / 180;
    // radii
    r0 -= deltaR * a0;
    let oldR, newR = r0 + deltaR * a1;
    // start and end points
    const oldPoint = {x: 0, y: 0};
    const newPoint = {
        x: x0 + newR * Math.cos(a1), 
        y: y0 + newR * Math.sin(a1)
    };
    // tangent slopes
    let oldSlope, newSlope = (deltaR * Math.sin(a0) + (r0 + deltaR * a1) * Math.cos(a0)) / (deltaR * Math.cos(a0) - (r0 + deltaR * a1) * Math.sin(a0));
    let path = "M " + pStr( newPoint, offsetX, offsetY );
    
    while ( count -- ) {
        const a0 = a1; a1 += deltaA;

        oldR = newR;
        newR = r0 + deltaR * a1;

        oldPoint.x = newPoint.x;
        oldPoint.y = newPoint.y;
        newPoint.x = x0 + newR * Math.cos(a1);
        newPoint.y = y0 + newR * Math.sin(a1);

        // Slope calculation with the formula:
        // (deltaR * sinΘ + (r0 + deltaRΘ) * cosΘ) / (deltaR * cosΘ - (r0 + deltaRΘ) * sinΘ)
        const aPlusBTheta = r0 + deltaR * a1;

        oldSlope = newSlope;
        newSlope = (deltaR * Math.sin(a1) + aPlusBTheta * Math.cos(a1)) / (deltaR * Math.cos(a1) - aPlusBTheta * Math.sin(a1));

        const oldIntercept = -(oldSlope * oldR * Math.cos(a0) - oldR * Math.sin(a0));
        const newIntercept = -(newSlope * newR* Math.cos(a1) - newR * Math.sin(a1));

        const controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);

        // Offset the control point by the center offset.
        controlPoint.x += x0;
        controlPoint.y += y0;

        path += "Q " + pStr(controlPoint, offsetX, offsetY) + pStr(newPoint, offsetX, offsetY);
    }
    return path ;
	}

export function spiral (x0, y0, r0, deltaR, a0, count, deltaA, attributes = { }) {
	///  TODO: Use spiralPathString function
    ///  Adaption from Zev Eisenberg and ccprog at https://stackoverflow.com/a/49099258
    ///  Creates a path element that approximates an archimedian spiral with bezier curves.
    ///  x0, y0 : Center coordinate
    ///  r0 : Initial radius at starting angle
    ///  deltaR : Radius increment per turn
    ///  a0, a2 : Start and end angles
	///	  count : number of ticks, usually more than 12
    ///  deltaA : Angle increment
    ///  attributes : Additional attributes on the path element
    
    deltaR = deltaR / Math.PI / 2;   // normalize to radian
    const a2 = (a0 + count * deltaA) * Math.PI / 180;  // end angle
    // angles to radians
    let a1 = a0 = a0 * Math.PI / 180;
    deltaA = deltaA * Math.PI / 180;
    // radii
    r0 -= deltaR * a0;
    let oldR, newR = r0 + deltaR * a1;
    // start and end points
    const oldPoint = {x: 0, y: 0};
    const newPoint = {
        x: x0 + newR * Math.cos(a1), 
        y: y0 + newR * Math.sin(a1)
    };
    // tangent slopes
    let oldSlope, newSlope = (deltaR * Math.sin(a0) + (r0 + deltaR * a1) * Math.cos(a0)) / (deltaR * Math.cos(a0) - (r0 + deltaR * a1) * Math.sin(a0));
    let path = "M " + pStr( newPoint );
    
    while ( count -- ) {
        const a0 = a1; a1 += deltaA;

        oldR = newR;
        newR = r0 + deltaR * a1;

        oldPoint.x = newPoint.x;
        oldPoint.y = newPoint.y;
        newPoint.x = x0 + newR * Math.cos(a1);
        newPoint.y = y0 + newR * Math.sin(a1);

        // Slope calculation with the formula:
        // (deltaR * sinΘ + (r0 + deltaRΘ) * cosΘ) / (deltaR * cosΘ - (r0 + deltaRΘ) * sinΘ)
        const aPlusBTheta = r0 + deltaR * a1;

        oldSlope = newSlope;
        newSlope = (deltaR * Math.sin(a1) + aPlusBTheta * Math.cos(a1)) /
                   (deltaR * Math.cos(a1) - aPlusBTheta * Math.sin(a1));

        const oldIntercept = -(oldSlope * oldR * Math.cos(a0) - oldR * Math.sin(a0));
        const newIntercept = -(newSlope * newR* Math.cos(a1) - newR * Math.sin(a1));

        const controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);

        // Offset the control point by the center offset.
        controlPoint.x += x0;
        controlPoint.y += y0;

        path += "Q " + pStr(controlPoint) + pStr(newPoint);
    }
    
    attributes.d = path ;
    return createElement( "path", attributes );
}

