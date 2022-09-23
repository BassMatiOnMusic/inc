//
// footer-2.js  2021-08-03  usp
//

function getMetaData( name, defaultValue="?" ) {
	const e = document.querySelector( `meta[name='${name}']` );
	if ( ! e ) return ;
	let value = e.getAttribute( "content" );
	return value || defaultValue ;
	}

export function initPage ( ) {
	/// Creates a standard page footer.
	const creationDate = getMetaData( "creation-date" );
	const pageCreator = getMetaData( "author" );
	const changeDate = getMetaData( "change-date" );
	const pageEditor = getMetaData( "editor" );
	const pageVersion = getMetaData("version", "0");
	let footer = document.getElementById( "page-footer" );
	if ( ! footer ) { 
		const footers = document.getElementsByTagName( "FOOTER" );
		if ( footers ) footer = footers[ footers.length - 1 ];
		}
	if ( ! footer ) footer = document.createElement( "DIV" );
	footer.id = "page-footer" ;
	footer.innerHTML = `Created ${creationDate} by ${pageCreator} &bull;  Edited ${changeDate} by ${pageEditor} &bull; Version ${pageVersion}<br/><a href=\"/index.htm\">Home</a> | ` ;
	document.body.appendChild( footer );
	}

export function addNavigationLinks( navigation ) {
	let s = "" ; 
	if ( navigation ) {
		if ( navigation.parent !== "#" ) s += `<a href="${navigation.parent}">Up</a> | ` ;
		if ( navigation.first !== "#" ) s += `<a href="${navigation.first}">First</a> | ` ;
		if ( navigation.previous !== "#" ) s += `<a href="${navigation.previous}">Previous</a> | ` ;
		if ( navigation.next !== "#" ) s += `<a href="${navigation.next}">Next</a> | ` ;
		if ( navigation.last !== "#" ) s += `<a href="${navigation.last}">Last</a> | ` ;
		}
	s += '<a href="/legal.htm">Legal</a>' ;
	document.getElementById( "page-footer" ).innerHTML += s ;
	}