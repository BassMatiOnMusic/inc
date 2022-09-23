//
// header-2.js  usp 2022-01-23
//

( function ( ) {
	/// Creates the page header container with the embedded SVG graphics.
	let header = document.getElementById( "page-header" );
	if ( ! header ) {
		header = document.createElement( "HEADER" );
		header.id = "page-header" ;
		document.body.insertBefore( header, document.body.firstChild );
		}
	} ) ( ) ;

