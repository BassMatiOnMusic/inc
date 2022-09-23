//
// loader-4.js  2021-08-02  usp
// usage: loader.loadFragments( ).then(( ) => postProcess( ));
//

export function loadFragments ( container = document.body ) {
	const promises = [ ] ;
	const containers = container.querySelectorAll( "[load-src]" );
	for ( let i = 0 ; i < containers.length ; i ++ ) {
		let e = containers[ i ];
		let url = e.getAttribute( "load-src" );
		if ( recursionCheck( e, url )) {
			e.innerHTML = "Loader recursion error" ;
			console.error ( e.innerHTML );
			continue;
			}
		console.log( "Loading: ", url );
		promises.push( fetch( url )
			.then ( response => response.ok ? response.text( ) : "Not found: " + url )
			.then (( text ) => e.innerHTML = text )
			.then (( ) => { if ( e.id !== "navigation-panel" ) {
				// Remove auxiliary parent nodes for partial website projects
				const sroot = e.querySelector( "[section-root]" );
				if ( sroot ) e.replaceChildren( ...sroot.children );
				} } )
			.then (( ) => rebaseRelativeUrls( e, stripFilename( url )))
			.then (( ) => loadFragments( e ))
			.catch( reason => console.error( "Request failed: ", reason )));
		}  
	return Promise.allSettled( promises ).then(( ) => Promise.resolve( "OK" ));
	}
	
function recursionCheck( e, url ) {
	while (( e = e.parentNode ) && e !== document ) if ( e.getAttribute( "load-src" ) === url ) return true;
	}

function stripFilename( path ) {
	/// Return the substring up to (but not including) the last forward slash.
	let i = path.lastIndexOf( "/" );
	if ( i < 0 ) return "/" ;
	else return path.substr( 0, i + 1 );
	}

const reCleanup = new RegExp( "[^/]+/\\.\\./", "g" );
	/// matches excursions into irrelevant folders ("folder/../").

function rebaseRelativeUrls ( container, basePath ) {
	/// Makes all URLs in a fragment container absolute.
	function rebase ( attributeName ) {
		/// Collects link attributes and prefixes relative URLs
		container.querySelectorAll( `[${attributeName}]` ).forEach( e => { 
			let url = e.getAttribute( attributeName );
			if ( url[ 0 ] !== "/" && url.indexOf( "://" ) < 0 ) e.setAttribute( attributeName, (basePath + url).replace( reCleanup, "" ) );
			} ) ; }
	rebase( "href" );
	rebase( "src" );
	rebase( "load-src" );
	}

