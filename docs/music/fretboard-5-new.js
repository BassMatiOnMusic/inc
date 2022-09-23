//
//  fretboard-5.js  2021-09-21  usp
//

import { createElement, line, circle, rect, text } from "/inc/svg-1.js" ;

const noteNameRegex = "^[0-9]" ;

export const moduleOptions = {
	stringspacing : 20 , 
	fretspacing : 20 , 
	fretrange : [ 0, 5 ] ,
	romanNumerals : ",I,,III,,V,,VII,,IX,,,XII,,,XV,,XVII,,IXX,,XXI,,,XXIV".split( "," ) ,
	fretmarkers : "both" ,
	strings : [ "E4", "B3", "G3", "D3", "A2", "E2" ] ,
	stringheaders : [ ] ,
	showCellset : 0 ,
	showAttribute : 0 ,
	showAttributes : [ "intervalName" , "noteName" , "fingerNumber", "" ] ,
	} ;

let diagramOptions = { }, target, x, y, w, h, maxx, maxy;
	
function getOption ( name ) {
	/// Retrieves a value from diagram and module options. 
	return diagramOptions[ name ] || moduleOptions[ name ] ;
	}

( function calculateFontSizes ( options, c, h, m  ) {
	/// Calculates font size options based on the string spacing.
	/// c = cellfont factor
	/// h = headerfont factor
	/// m = markerfont factor
	const space = Math.min( getOption("stringspacing"), getOption("fretspacing") ) ;
	if ( ! options.cellfontsize ) options.cellfontsize = Math.max( c * space, 11 ); 
	if ( ! options.headerfontsize ) options.headerfontsize = Math.max( h * space, 9 );
	if ( ! options.markerfontsize ) options.markerfontsize = Math.max( m * space, 8 );
	} ) ( moduleOptions, 0.5, 0.4, 0.5 ) ;

export function setModuleOptions( o ) {
	///		Bulk setting of module options.
	for ( const [ key, value ] of Object.entries( o )) moduleOptions[ key ] = value ;
	}

export function createFretboard ( t , o, active ) {
	///		Generates the fretboad diagram
	///		t : Target object reference or ID string
	///		o : Configuration options object. 
	target = typeof t === "string" ? document.getElementById( t ) : t ;
	diagramOptions =  o ;
	// Rearrange the cellsets array if necessary
	if ( ! diagramOptions.cellsets ) diagramOptions.cellsets = [ ] ;
	if ( diagramOptions.cells ) { diagramOptions.cellsets.push ( diagramOptions.cells ) ; delete diagramOptions.cells } ;
	// Phase out!
	if ( diagramOptions.spacing ) { 
		diagramOptions.fretspacing = diagramOptions.spacing[ 0 ];
		diagramOptions.stringspacing = diagramOptions.spacing[ 1 ];
		}
	// Set display control options
	target.setAttribute( "active-attribute", getOption( "showAttribute" ) || 0 ) ;
	delete diagramOptions.showAttribue ;
	target.setAttribute( "active-cellset", getOption( "showCellset" ) || 0 ) ;
	delete diagramOptions.showCellset;
	target.setAttribute( "active-attribute-list", getOption( "showAttributes" ) ) ;

	// Create the diagram
	createStringLines( );
	createFretLines( );
	createStringHeaders( );
	createFretmarkers( );
	for ( let i = 0 ; i < diagramOptions.cellsets.length ; i ++ )  createCells ( i, diagramOptions.cellsets[ i ] ) ;
	showAttribute ( ) ;
	// Set viewbox and size
	maxx += 10;
	target.setAttribute( "viewbox", `0 0 ${maxx} ${maxy}` );
	target.setAttribute( "width" , maxx );
	target.setAttribute( "height" , maxy );
	}

export function activateCellSet( target, i = target.getAttribute( "active-cellset" )) {
	let cellset = target.querySelector( "g.cellset[active]" );
	if ( cellset ) cellset.removeAttribute( "active" );
	target.querySelector( `g.cellset[number="${i}"]` ).setAttribute( "active", "" );
	target.setAttribute( "active-cellset", i );
	}

export function activateDisplayAttribute ( target, i = target.getAttribute ( "active-display-attribute" )) {
	const attributeName = target.getAttribute( "display-attributes" ).split( "," )[ i ] ;
	const textcells = target.querySelectorAll ( "g.cellset[active] text" ) ;
	for ( let k = 0 ; k < textcells.length ; k ++ ) textcells[ k ].textContent = textcells[ k ].getAttribute( attributeName ) || "" ;
	target.setAttribute( "active-display-attribute" , i ) ;
	}

export function showAttribute ( i ) {
	// Find the index of the cell text attribute to show
	if ( i ) diagramOptions.showAttribute = i ;
	else i = getOption( "showAttribute" );
	// Find the related attribute name
	let attributeName = getOption( "showAttributes" )[ i ] ;
	// Copy the attribute to textContent of all cells
	const cells = target.querySelectorAll( "g.cellset text" );
	for ( let i = 0 ; i < cells.length ; i ++ ) {
		cells[ i ].textContent = cells[ i ].getAttribute( attributeName );
	}	}

function createStringLines ( ) {
	// Calculate diagram dimensions
	x = 0, y = getOption( "stringspacing" ) / 2 ;
	// Fretmarker row at the top requires additional space.
	switch ( getOption( "fretmarkers" )) { case "top": case "both" : y += getOption( "markerfontsize" ) ; }
	// Headers at the left side require additional space.
	// Add space for each header column.
	for ( let i = 0 ; i < getOption( "stringheaders" ).length ; i ++ ) {
		switch ( getOption( "stringheaders" )[ i ] ) {
		case "number" : x += 16 ; break
		case "note" : x += 16 ; break
		case "fullnote" : x += 24 ; break
		}	}
	// Add additional space between headers and grid lines
	if ( x > 0 ) x += 8 ;
	w = ( getOption( "fretrange" )[ 1 ] - getOption( "fretrange" )[ 0 ] + 1 ) * getOption( "fretspacing" ) ;
	h = ( getOption( "strings" ).length - 1 ) * getOption( "stringspacing" ) ;
	// Set diagram size.
	maxx = x + w ;
	maxy = y + h + getOption( "stringspacing" ) / 2;
	// Create string lines.
	let g = createElement( "g", { class : "grid strings" } );
	target.appendChild( g );
	for ( let i = 0 ; i < getOption( "strings" ).length ; i ++ ) {
		g.appendChild( line( x, y + i * getOption( "stringspacing" ), x + w, y + i * getOption( "stringspacing" ) ) ) ;	
		}	
	}
function createFretLines ( ) {
	// Create fret lines group element.
	const g = createElement( "g", { class: "grid frets" } );
	target.appendChild( g );
	for ( let i = getOption( "fretrange" )[ 0 ] ; i < getOption( "fretrange" )[ 1 ] + 2 ; i ++ ) {
		// Omit line #0 in front of the nut.
		if ( i === 0 ) continue ;
		const a = x + ( i - getOption( "fretrange" )[ 0 ] ) * getOption( "fretspacing" ) ;
		// Append a line element. Make it a nut if it is line #1
		g.appendChild ( line ( a, y,  a, y + h, { class: i === 1 ? "nut" : undefined } ) ) ;	
		}	
	}
function createStringHeaders ( ) {
	///		String header can have multiple items (string number, short 
	///		and long note name), each requires a certain horizontal space.
	///		Space calculation is absolute here, but should be based on the
	///		header font size.
	let x = 0, g ;
	for ( let i = 0 ; i < getOption( "stringheaders" ).length ; i ++ ) {
		switch ( getOption( "stringheaders" )[ i ] ) {
		case "number" :
			// Circle diameter is 14, width is 16.
			g = createElement( "g", { class: "stringnumbers", "font-size": getOption( "headerfontsize" ) } ) ;
			target.appendChild( g );
			x += 8;
			for ( let i = 0 ; i < getOption( "strings" ).length ; i ++ ) {
				g.appendChild ( circle ( x, y + i * getOption( "stringspacing" ), 7 ) ) ;
				g.appendChild ( text( x , y + 3.5 + i * getOption( "stringspacing" ), i ) ) ; 
				}
			x += 8 ;
			break;
		case "note" :
			// Circle diameter is 14, width is 16.
			g = createElement( "g", { class: "stringnames", "font-size": getOption( "headerfontsize" ) } ) ;
			target.appendChild( g );
			x += 8 ;
			for ( let i = 0 ; i < getOption( "strings" ).length ; i ++ ) {
				g.appendChild( circle ( x, y + i * getOption( "stringspacing" ), 7 ) ) ;
				g.appendChild( text ( x , y + 3.5 + i * getOption( "stringspacing" ), getOption( "strings" )[ i ].match( noteNameRegex ))); 
				}
			x += 8 ;
			break;
		case "fullnote" :
			// Rectangle width is 20, space width is 24.
			g = createElement( "g", { class: "stringnames", "font-size": getOption( "headerfontsize" ) } ) ;
			target.appendChild( g );
			x += 12 ;
			for ( let i = 0 ; i < getOption( "strings" ).length ; i ++ ) {
				g.appendChild ( rect ( x - 10, y + i * getOption( "stringspacing" ) - 7, 20, 14, 7, 7 ) ) ;
				g.appendChild ( text ( x , y + 3.5 + i * getOption( "stringspacing" ), getOption( "strings" )[ i ] ) ) ; 
				}
			x += 12 ;
			break;
	}	}	}
function createFretmarkers ( ) { 
	switch ( getOption( "fretmarkers" )) { 
		case "top" : 
		case "both" : 
			createFretmarkerRow( x, y - getOption( "stringspacing" ) / 2.5 ) 
		}
	switch ( getOption( "fretmarkers" ) ) { 
		case "bottom" : 
		case "both" : 
			createFretmarkerRow( x, y + h + getOption( "stringspacing" ) / 2 + getOption( "markerfontsize" ) ) 
	}	}
function createFretmarkerRow( x, y ) {
	x += getOption( "fretspacing" ) / 2 ;
	maxy = Math.max( maxy, y + 5 );
	const g = createElement( "g", { class: "fretmarkers", "font-size": getOption( "markerfontsize" ), "stroke-width": "0.9" } ) ;
	target.appendChild( g );
	for ( let i = getOption( "fretrange" )[ 0 ] ; i <= getOption( "fretrange" )[ 1 ] ; i ++ , x += getOption( "fretspacing" ) ) {
		g.appendChild( text( x, y, getOption( "romanNumerals" )[ i ] ) ) ;
	}	}
function createCells( setnumber, cells ) { 
	/// cellset : identifies the cellset in the cellsets array.
	let g = createElement( "g", { class: "cellset", "font-size": getOption( "cellfontsize" ), "stroke-width": "1", "number": setnumber } ) ;
	target.appendChild( g );
	const cw = Math.min( getOption( "stringspacing" ), 
		getOption( "fretspacing" ) ) - 3, 
		ch = cw, 
		cr = ch / 2 ;
	for ( let i = 0 ; i < cells.length ; i ++ ) {
		const cell = cells[ i ];
		const cx = x + getOption( "fretspacing" ) / 2 + (cell.f - getOption( "fretrange" )[ 0 ] ) * getOption( "fretspacing" ) ;
		const cy = y + ( cell.s - 1 ) * getOption( "stringspacing" ) ;
		g.appendChild ( setFlags ( rect ( cx-cw/2, cy-cw/2, cw, cw, cr, cr ), cell ) ) ;
		if ( cell.opt === 1 ) g.setAttribute( "optional", "" );
		const o = text ( cx, cy + getOption( "cellfontsize" ) / 3, "", { noteName: cell.nn, intervalName: cell.in, fingerNumber: cell.fn } ) ;
		setFlags( o, cell );
		g.appendChild( o );
	}	}
function setFlags ( e , cell ) {
	switch( cell.in ) {
		case "R" : e.setAttribute( "root" , "" ) ; break 
		case "O" : e.setAttribute( "octave" , "" ) ; break
		}
	if ( cell.opt === 1 ) e.setAttribute( "optional", "" ) ;
	return e ;
	}
