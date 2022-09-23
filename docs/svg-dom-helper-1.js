///  svg-dom-helper.js   2021-10-22   usp 
///  Helper functions for the DOM, non-module version

if ( typeof Synesis === "undefined" ) Synesis = { } ;
Synesis.DomHelper = {
	swapAttributes : function ( e1, a1, a2, e2=e1) {
		/// Exchanges the values of two element attributes
		const s = e1.getAttribute( a1 );
		e1.setAttribute( a1, e2.getAttribute( a2 ));
		e2.setAttribute( a2, s );
		}
	} ;
