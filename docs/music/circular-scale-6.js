//
//	circular-scale-6.js
//

import * as svg from "/inc/svg-1.js" ;
import { replaceAccidentals } from "/inc/music/music-5.js" ;

export const moduleOptions = {
	/// Provides standard values for diagram parameters. Used in the diagram constructor to pre-initialize diagram-specific parameters.
	circleRadius : 12 ,
	fillColor : "white" ,
	originX : 0 ,
	originY : 0 ,
	pathRadius : 60 ,
	pathRadiusIncrement : 40 ,   // for circles (=0) and spirals (>0)
	"scale-pattern" : "R,,M2,,M3,p4,,p5,,M6,,m7".split( "," ) ,
	startTick : 0 ,
	strokeColor : "black" ,
	textColor : "black" ,
	tickAngle : 30 ,   // angle between ticks
	ticksPerTurn : 12 ,
	ticksInnerRadius : 50 ,
	ticksOuterRadius : 70 ,
	tickInnerRadiusIncrement : 0 ,
	tickOuterRadiusIncrement : 0 ,
	ticksTotal : 12 ,
	} ;

let options,
	k ;  // sine values table

export class CircularScale  {
	sineTable = [ ] ;  // used to calculate tick positions in cartesian space
	constructor ( diagram, options = { } ) {
		/// Creates an SVG circular scale diagram.
		/// Initializes diagram options from module options and options parameter.
		/// Creates a sine table for each tick per turn.
			// Diagram reference
		if ( typeof diagram === "string" ) diagram = document.getElementById( diagram );
		this.diagram = diagram;
			// Init diagram options from module options.
		this.options = { } ;
		for ( const [key, value] of Object.entries( moduleOptions )) this.options[ key ] = value ;
			// Integrate parameter options into diagram options.
		for ( const [key, value] of Object.entries( options )) this.options[ key ] = value ;
			// Init sine table for ticks per turn
		for ( let i = 0, a = 0, da = 2 * Math.PI / this.options.ticksPerTurn ; i < this.options.ticksPerTurn ; i ++ , a += da ) {
			this.sineTable[ i ] = Math.sin( a );
		}	
		}
	getSine ( tick ) {
		/// Returns the sine value for the tick number. 
		tick %= this.options.ticksPerTurn ;
		return this.sineTable[ tick ];
		}
	getCosine( tick ) {
		///	 Determines the cosine value for the tick number from the sine table.
		/// Takes negative y axis for SVG diagrams into account.
		tick = ( tick + 3 / 4 * this.options.ticksPerTurn ) % this.options.ticksPerTurn ;
		return this.sineTable[ tick ];
		}
	setSalePattern( pattern ) {
		/// pattern: A string with comma-separated elements. An ASCII zero or an empty string defines an unused positions in the scale. Every other value, such a an ASCII one or an interval name, indicates a used scale position. The length of the list must match the ticks per turn.
		this.options.scalePattern = pattern.split( "," );
		return this ;
		}
	setElementAttributes( e, attributes = { } ) {
		/// Helpfer function, currently not used?
		for ( const [key, value] of Object.entries( attributes )) this.options[ key ] = value ;
		return this ;
		}
	addCircularPath( options = { } ) {
		/// Creates a path group element and with a circle child element.
		options.x = options.x || this.options.originX ;
		options.y = options.y || this.options.originY ;
		options.r = options.r || this.options.pathRadius ;
		this.options.pathRadiusIncrement = 0 ;  // not a spiral
		options.attributes = options.attributes || { } ;
		options.attributes.id = options.attributes.id || "path" ;
		this.pathGroup = this.pathGroup || this.diagram.appendChild( svg.createElement( "g", { id : "path-group" } ) ) ;
		this.pathGroup.append( svg.circle ( options.x, options.y, options.r, options.attributes ));
		return this ;
		}
	addSpiralPath( options = { } ) {
		/// Creates a path group element with a spiral path child element. 
		/// Sets the increment values for tickmarks in the diagram options.
		this.options.pathType = "spiral" ;
		options.x = options.x || this.options.originX ;
		options.y = options.y || this.options.originY ;
		options.r = options.r || this.options.pathRadius ;
		options.attributes = options.attributes || { } ;
		options.attributes.id = options.attributes.id || "path" ;
		this.options.tickInnerRadiusIncrement = this.options.tickOuterRadiusIncrement = options.deltaR = options.deltaR || this.options.pathRadiusIncrement ;
		let a0 = (options.startTick || this.options.startTick) * this.options.tickAngle ;
		options.ticks = options.ticks || this.options.ticksTotal ;
		options.startTick = options.startTick || this.options.startTick ;
		options.deltaA = options.deltaA || this.options.tickAngle ;
		this.pathGroup = this.pathGroup || this.diagram.appendChild( svg.createElement( "g", { id : "path-group" } ) ) ;
		this.pathGroup.append( svg.spiral (options.x, options.y, options.r, options.deltaR, a0, options.ticks - 1, options.deltaA, options.attributes ));
		return this ;
		}
	addTickmarks ( options = { } ,groupAttributes = { id: "tickmarks" }, elementAttributes = { } ) {
		/// Adds tickmarks to the diagram.
		/// Should be called after creating the path. The addSpiralPath function sets radius increment values.
			// Complete options from diagram options.
		options.innerRadius = options.innerRadius || this.options.ticksInnerRadius ; 
		options.outerRadius = options.outerRadius || this.options.ticksOuterRadius ; 
		options.startTick = options.startTick === 0 || options.startTick || this.options.startTick ;
		options.ticks = options.ticks || this.options.ticksTotal ;
		if ( options.innerRadiusIncrement === undefined ) options.innerRadiusIncrement = this.options.tickInnerRadiusIncrement ;
		if ( options.outerRadiusIncrement === undefined ) options.outerRadiusIncrement = this.options.tickOuterRadiusIncrement ;
		options.innerRadiusIncrement /= this.options.ticksPerTurn ;
		options.outerRadiusIncrement /= this.options.ticksPerTurn ;
			// Create group element
		this.tickMarksGroup = this.diagram.appendChild( svg.createElement( "g", groupAttributes ) ) ;
			// Add tickmarks to the group
		for ( let i = options.startTick ; i < options.ticks ; i ++ , options.innerRadius+=options.innerRadiusIncrement , options.outerRadius+=options.outerRadiusIncrement  ) 
			this.tickMarksGroup.appendChild ( svg.line (  
			options.innerRadius * this.getSine( i ) , 
			options.innerRadius * this.getCosine( i ) , 
			options.outerRadius * this.getSine( i ) , 
			options.outerRadius * this.getCosine( i ) , 
			elementAttributes ) ) ;
		return this;
		}	
	addGroup ( attributes ) {
		/// returns the added group element
		// Find parent element
		if ( ! attributes.parent ) attributes.parent = this.diagram;
		else if ( typeof attributes.parent === "string" ) attributes.parent = this.diagram.querySelector( attributes.parent );
		return parent.appendChild( svg.createElement( "g", attributes )) ;
		}
	addPatternGroup ( options={ }, groupAttributes={ }, elementAttributes=[ ] ) {
		/// Adds a pattern group for scales and chords plus pattern element nodes.
		//
		// Init group ID
		if ( ! groupAttributes.id ) groupAttributes.id = "pattern-0" ;
		let group = this.diagram.appendChild( svg.createElement( "g", groupAttributes ));
		let pattern = groupAttributes["scale-pattern"] ;
		if ( typeof pattern  === "string" ) pattern = pattern.split( "," ) ;
		// Add group elements, one for each tick.
		for ( let i = 0 ; i < this.options.ticksTotal; i ++ ) group.appendChild( svg.createElement( "g", elementAttributes[ i ] ));
		return this ;
		}
	setSalePattern( pattern ) {
		/// pattern: A string with comma-separated elements. An ASCII zero or an empty string defines an unused positions in the scale. Every other value, such a an ASCII one or an interval name, indicates a used scale position. The length of the list must match the ticks per turn.
		this.options.scalePattern = pattern.split( "," );
		return this ;
		}
	addCircularBubbles ( options={ }, elementAttributes=[ ] ) {
		/// options : Parameter object
		/// elementAttributes : 
		let patternGroup = this.diagram.querySelector( options.patternGroup || "#pattern-0" ); 
		if ( options.ScalePattern ) this.options.scalePattern = options.scalePattern ;
		let startTick = options.startTick || this.options.startTick ;
		let ticks = options.ticksTotal || this.options.ticksTotal ;
		let ticksPerTurn = options.ticksPerTurn || this.options.ticksPerTurn ;
		let r1 = options.pathRadius || this.options.pathRadius ;
		let r2 = options.circleRadius || this.options.circleRadius ;
		let dr = ( options.pathRadiusIncrement || this.options.pathRadiusIncrement ) / ticksPerTurn ;
		for ( let i = 0, r = r1 + dr * startTick  ; i < ticks ; i ++,  r1 += dr ) {
			if ( ! this.options.scalePattern[ i % ticksPerTurn ] ) continue ;
			let a = elementAttributes[ i ] || { } ;
			a.cx = r1 * this.getSine( i );
			a.cy = r1 * this.getCosine( i );
			a.r = r2 ;
			a.fill = options.fillColor || this.options.fillColor ;
			a.stroke = options.strokeColor || this.options.strokeColor ;
			patternGroup.childNodes[ i ].appendChild( svg.createElement( "circle", a ));
			}
		return this ;
		}
	addOvals( options={}, elementAttributes ) {
		let patternGroup = this.diagram.querySelector( options.patternGroup || "#pattern-0" ); 
		if ( options.ScalePattern ) this.options.scalePattern = options.scalePattern ;
		let startTick = options.startTick || this.options.startTick ;
		let ticks = options.ticksTotal || this.options.ticksTotal ;
		let ticksPerTurn = options.ticksPerTurn || this.options.ticksPerTurn ;
		let r1 = options.pathRadius || this.options.pathRadius ;
		let r2 = options.circleRadius || this.options.circleRadius ;
		let dr = ( options.pathRadiusIncrement || this.options.pathRadiusIncrement ) / ticksPerTurn ;
		for ( let i = 0, r = r1 + dr * startTick  ; i < ticks ; i ++,  r1 += dr ) {
			if ( ! this.options.scalePattern[ i % ticksPerTurn ] ) continue ;
			let a = elementAttributes[ i ] || { } ;
			a.cx = r1 * this.getSine( i );
			a.cy = r1 * this.getCosine( i );
			a.r = r2 ;
			a.fill = options.fillColor || this.options.fillColor ;
			a.stroke = options.strokeColor || this.options.strokeColor ;
			patternGroup.childNodes[ i ].appendChild( svg.createElement( "circle", a ));
			}
		return this ;
		}
	addTextCircles( parent="#pattern-0" , options={ }, attributes=[ ] ) {
		if ( typeof parent === "string" ) parent = this.diagram.querySelector( parent );
		if ( options.ScalePattern ) this.options.scalePattern = options.scalePattern ;
		let ticks = options.ticksTotal || this.options.ticksTotal ;
		let startTick = options.startTick || this.options.startTick ;
		let ticksPerTurn = options.ticksPerTurn || this.options.ticksPerTurn ;
		let dr = ( options.pathRadiusIncrement || this.options.pathRadiusIncrement ) / ticksPerTurn ;
			// Compute vertical text offset depending on the font size
		const fontsize = parseInt ( window.getComputedStyle( parent ).getPropertyValue( "font-size" )) ;
		const vo = fontsize / 3 ; 
		for ( let i = 0, r = (options.pathRadius || this.options.pathRadius) + dr * startTick  ; i < ticks ; i ++,  r += dr ) {
			if ( ! this.options.scalePattern[ i % ticksPerTurn ] ) continue ;
			let a = attributes[ i ] || { } ;
			a.fill = a.fillColor || options.textColor || this.options.textColor ;
			parent.childNodes[ i ].appendChild( svg.text( r * this.getSine( i ), r * this.getCosine( i ) + vo, this.options.scalePattern[ i % ticksPerTurn ], a ) ) ;
			}	
		return this ;
		}
	rotateCircular ( direction="left", length=1, pattern="#pattern-0" ) {
		/// moves the pattern along a the path
		let group = this.diagram.querySelector( pattern );
		let count = group.childNodes.length ;
		let ticksTotal = this.options.ticksTotal;
		let ticksPerTurn = this.options.ticksPerTurn;
		let animators = group.querySelector( "animatePosition" ) || [ ] ;
		if ( animators.length === 0 ) for ( let i = startTick ; i < ticksTotal ; i ++ )
			group.childNodes[ i ].appendChild( animators[ i ] = svg.createElement( "animateMotion" , { dur : "2s" , fill : "freeze" , onend : "console.log( 'animation end' )" } ) ) ;
		// Setup spiral path parameters
		let r0 = this.options.pathRadius ;
		let deltaR = this.options.pathRadiusIncrement ;
		let deltaA = this.options.tickAngle ;
		for ( let i = startTick ; i < ticksTotal ; i ++ , r0 += deltaR/ticksPerTurn ) {
			animators[ i ].setAttribute( "path" , svg.spiralPathString ( 0, 0, r0, deltaR, i * deltaA, length, deltaA, -r0 * this.getSine( i ), -r0 * this.getCosine( i ) ) ) ;
		}	}
	rotate ( direction="left", length=1, pattern="#pattern-0" ) {
		/// moves the pattern along a the path
		let group = this.diagram.querySelector( pattern );
		let ticks = this.options.ticksTotal;
		let startTick = this.options.startTick;
		let ticksTotal = this.options.ticksTotal;
		let ticksPerTurn = this.options.ticksPerTurn;
		let animators = group.querySelector( "animatePosition" ) || [ ] ;
		if ( animators.length === 0 ) for ( let i = startTick ; i < ticksTotal ; i ++ )
			group.childNodes[ i ].appendChild( animators[ i ] = svg.createElement( "animateMotion" , { dur : "2s" , fill : "freeze" , onend : "console.log( 'animation end' )" } ) ) ;
		// Setup spiral path parameters
		let r0 = this.options.pathRadius ;
		let deltaR = this.options.pathRadiusIncrement ;
		let deltaA = this.options.tickAngle ;
		let f = deltaR === 0 ? svg.arc.bind ( null, 0, 0, r0 ) : svg.spiralString 
		for ( let i = startTick ; i < ticksTotal ; i ++ , r0 += deltaR/ticksPerTurn ) {
			animators[ i ].setAttribute( "path" , svg.spiralPathString ( 0, 0, r0, deltaR, i * deltaA, length, deltaA, -r0 * this.getSine( i ), -r0 * this.getCosine( i ) ) ) ;
	}	}	}