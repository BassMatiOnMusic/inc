//
// toolbar-2.js  2021-08-22  usp
//

let toolbar ;

( function initPage ( ) {
	/// Creates the main toolbar.
	toolbar = document.getElementById( "main-toolbar" );
	if ( ! toolbar ) {
		toolbar = document.createElement( "DIV" );
		toolbar.id = "main-toolbar" ;
		document.body.insertBefore( toolbar, document.body.firstChild );
		}
	} ) ( ) ;

export function createButtons( navigation, collapsible ) {
	/// Creates the toolbar buttons.
	/// Parameters provide the necessary methods that are used by the buttons.
	let button;
	createButton( "svg", "navigate", "svg", steeringWheel, navigation.navigateButtonClickHandler ); 
	createButton( "a", "navigate-up", "svg", circledArrowUp, navigation.parent );
	createButton( "a", "navigate-first", "svg", circledArrowFirst, navigation.first );
	createButton( "a", "navigate-previous", "svg", circledArrowLeft, navigation.previous );
	createButton( "a", "navigate-next", "svg", circledArrowRight, navigation.next );
	createButton( "a", "navigate-last", "svg", circledArrowLast, navigation.last );
	if ( document.querySelector( "body > #page-content [cbc]" )) {
		button = createButton( "svg", "collapse-toggle", "svg", circledPlusMinus, collapsible.toggleAllBlocks );
		if ( document.getElementById( "page-content" ).getAttribute( "cbc-default" ) === "collapsed" ) button.toggleAttribute( "expand" );
		}
	}

function createButton( tag, name, imgtype, imgurl, option ) {
	/// Creates a button in the toolbar.
	/// tag : Element tag name, A, DIV, SVG or other element tag name
	/// name : Button name attribute as required by toolbar.css
	/// imgtype : "svg" or "url"
	/// imgurl : svg object reference, or image URL
	/// option : URL for A butttons, or event handler reference for other elements
	let button;
	tag = tag.toUpperCase( );
	// Create the button element
	button = tag === "SVG" ? createSVGElement( imgurl ) : document.createElement( tag );
	button.setAttribute( "class", "tool button" );
	button.setAttribute( "name", name ) ;
	// A buttons have an href element, the others have an event handler attached.
	if ( tag === "A" ) button.setAttribute( "href", option );
	else button.addEventListener( "click", option );
	// SVG buttons have no image, they are the image.
	switch ( tag ) {
	case "A" :
	case "DIV" : 
		switch ( imgtype ) {
		case "url" : button.appendChild( createImage( imgurl )); break;
		case "svg" : button.appendChild( createSVGElement( imgurl )); break;
		case "obj" : button.appendChild( imgurl ); break;
		} }
	toolbar.insertBefore( button, null );
	return button;
	}

function createImage( url ) {
	const image = document.createElement( "IMG" );
	image.setAttribute( "src", url );
	return image;
	}

function createSVGElement( drawingInstructions ) {
	const svgNameSpace = "http://www.w3.org/2000/svg" ;
	const e = document.createElementNS( svgNameSpace, "svg" );
	e.setAttribute( "version", "1.1" );
	e.setAttribute( "class", "tool button" );
	e.setAttribute( "viewBox", "-50 -50 100 100" );
	e.setAttribute( "width", "23" );
	e.setAttribute( "height", "23" );
	const g = document.createElementNS( svgNameSpace, "g" );
	g.setAttribute( "stroke", "darkorange" );
	g.setAttribute( "stroke-width", "6" );
	g.setAttribute( "stroke-linecap", "round" );
	g.setAttribute( "stroke-linejoin", "round" );
	g.setAttribute( "fill", "white" );
	e.appendChild( g );
	g.innerHTML = drawingInstructions;
	return e ;
	}

	// Toolbar icons SVG code
const steeringWheel = '<circle cx="0" cy="0" r="38" /><circle cx="0" cy="0" r="22"/><path d="M 0, -46 L 0, 46 M -46, 0 L 46, 0 M -32.53, -32.53 L 32.53, 32.53 M 32.53, -32.53 L -32.53, 32.53"/>' ;
const circledArrowUp = '<circle cx="0" cy="0" r="46"/><path d="M 0 25 L 0 -25 M -22 -4 L 0 -25 22 -4"/>' ;
const circledArrowFirst = '<circle cx="0" cy="0" r="46"/><path d="M -22 0 L 25 0 M 0 -22 L -21 0 0 22 M -25 -20 L -25 20"/>' ;
const circledArrowLeft = '<circle cx="0" cy="0" r="46"/><path d="M -25 0 L 25 0 M -4 -22 L -25 0 -4 22"/>' ;
const circledArrowRight = '<circle cx="0" cy="0" r="46"/><path d="M -25 0 L 25 0 M 4 -22 L 25 0 4 22"/>' ;
const circledArrowLast = '<circle cx="0" cy="0" r="46"/><path d="M -25 0 L 22 0 M 0 -22 L 21 0 0 22 M 25 -20 L 25 20"/>' ;
const circledPlusMinus = '<circle cx="0" cy="0" r="46"/><path d="M -25 0 L 25 0"/><path id="vertical" d="M 0 -25 L 0 25"/>' ;
