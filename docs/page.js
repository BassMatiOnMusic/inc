// 
//	page.js  2021-10-21  usp
//

import * as toolbar from "/inc/toolbar/toolbar-2.js" ;
import * as header from "/inc/header-2.js" ;
import * as navigation from "/inc/navigation/navigation-3.js" ;
import * as pathbar from "/inc/navigation/path-bar-1.js" ;
import * as collapsible from "/inc/collapsible/collapsible-5.js" ;
import * as footer from "/inc/footer-2.js" ;
import * as loader from "/inc/loader-4.js" ;

( function initAbstract ( ) {
	const abstract = document.getElementById( "page-abstract" );
	if ( ! abstract ) return ;
	const description = document.querySelector( "meta[name='description']" );
	if ( ! description ) return ;
	// eslint-disable-next-line no-cond-assign
	if ( ( abstract.innerHTML = "" +  description.getAttribute( "content" )).length === 0 ) abstract.remove( ); 
	} )( ) ;

// toolbar.initPage( );
// header.initPage( );
footer.initPage( );
navigation.initPage( );
loader.loadFragments( ).then (( ) => {
	console.log( "Loading finished" );
	collapsible.initPage( );
	navigation.findCurrentDocument( );
	pathbar.initDocument( navigation.parents, document.getElementById( "page-content" ) );
	toolbar.createButtons( navigation, collapsible );
	footer.addNavigationLinks( navigation );
	} ) ;

