/*
 *    Navigation Path Bar
 *    2022-07-15 usp
 *    Related: pathbar-1.css
 */

export function initDocument ( parents, createBefore ) {
	///		Makes the path bars visible and creates the parent node list.
	///		parents : list of links to the parent documents.
	///		createBefore : If no path-bar container was found, insert one 
	///		before the referenced element.
	if ( ! parents || ! parents.length ) return ;
	// Data
	const buttonWidth = 40 ;
	const scrollIncrement = 50 ;
	function initPathBar ( pathbar ) {
		// Make the pathbar visible.
		pathbar.style.display = "block" ;
		// Create the content container.
		let content = document.createElement( "DIV" );
		content.className = "content" ;
		pathbar.appendChild( content );
		// Create the link list in the content container.
		for ( let i = 0 ; i < parents.length ; i ++ ) {
			if ( i > 0 ) content.innerHTML += " > " ;
			content.innerHTML += `<a href="${parents[ i ].href}">${parents[ i ].innerHTML}</a>` ;
			}
		// Create the buttons.
		let buttons = [ document.createElement( "DIV" ), document.createElement( "DIV" ) ];
		buttons[ 0 ].className = "scroll right" ;
		buttons[ 1 ].className = "scroll left" ;
		pathbar.appendChild( buttons[ 0 ] );
		pathbar.appendChild( buttons[ 1 ] );
		// They are hidden initially.
		let buttonsHidden = true ;
		// left button event handler
		pathbar.getElementsByClassName( "right" )[ 0 ].addEventListener( "click", function( ) { 
			window.event.stopPropagation( );
			window.event.preventDefault( );
			content.style.left = Math.max( content.offsetLeft - scrollIncrement, pathbar.offsetWidth - content.offsetWidth - buttonWidth ) + "px" ;
			} ) ;
		// Right button event handler
		pathbar.getElementsByClassName( "left" )[ 0 ].addEventListener( "click", function( ) { 
			window.event.stopPropagation( );
			window.event.preventDefault( );
			content.style.left = Math.min( content.offsetLeft + scrollIncrement, buttonWidth ) + "px" ;
			} ) ;
		// Container size monitoring
		window.addEventListener( "resize", function( ) {
			// Show or hide scroll buttons
			if ( buttonsHidden && content.scrollWidth > pathbar.offsetWidth ) {
				buttons[ 0 ].style.display = buttons[ 1 ].style.display = "inline-block" ;
				buttonsHidden = false ;
				}	
			else if ( ! buttonsHidden && content.scrollWidth < pathbar.offsetWidth ) {
				buttons[ 0 ].style.display = buttons[ 1 ].style.display = "none" ;
				buttonsHidden = true ;
				content.style.left = "20px" ;
			}	} ) ;
		// Show buttons if necessary
		if ( content.scrollWidth > pathbar.offsetWidth ) {
			buttons[ 0 ].style.display = buttons[ 1 ].style.display = "inline-block" ;
			buttonsHidden = false ;
		}	}
	let pathBars = document.getElementsByClassName( "path-bar" );
	if ( ! pathBars.length ) {
		if ( ! createBefore ) return ;
		// Create a path bar element, insert before reference node
		pathBars = [ document.createElement(	"DIV" ) ];
		pathBars[ 0 ].className = "path-bar" ;
		createBefore.parentNode.insertBefore( pathBars[ 0 ], createBefore );
		}
	// Code
	for ( let i = 0 ; i < pathBars.length ; i ++ ) initPathBar( pathBars[ i ] );
	}
