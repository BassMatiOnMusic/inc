
rem Run this after cloning the repo to a workstation.
rem Replaces include files from the repo with hard links to local (maintained) source files.
rem Now changes due do maintenance are automatically replicated to this repository.

rem Step 1: Make local files read-only, then delete the others.
cd docs
attrib +r colors.css
del *.*
attrib -r colors.css

rem Step 2: Create hard links for directories and files

mklink /j collapsible ..\..\..\bassmati-on-code\inc\docs\collapsible
mklink /j fnt ..\..\..\bassmati-on-code\inc\docs\fnt
mklink /j fretboard ..\..\..\bassmati-on-code\inc\docs\fretboard
mklink /j legal ..\..\..\bassmati-on-code\inc\docs\legal
mklink /j music ..\..\..\bassmati-on-code\inc\docs\music
mklink /j navigation ..\..\..\bassmati-on-code\inc\docs\navigation
mklink /j toolbar ..\..\..\bassmati-on-code\inc\docs\toolbar

mklink /h counter.css ..\..\..\bassmati-on-code\inc\docs\counter.css
mklink /h footer-2.css ..\..\..\bassmati-on-code\inc\docs\footer-2.css
mklink /h footer-2.js ..\..\..\bassmati-on-code\inc\docs\footer-2.js
mklink /h header-2.css ..\..\..\bassmati-on-code\inc\docs\header-2.css
mklink /h header-2.js ..\..\..\bassmati-on-code\inc\docs\header-2.js
mklink /h loader-4.js ..\..\..\bassmati-on-code\inc\docs\loader-4.js
mklink /h page.css ..\..\..\bassmati-on-code\inc\docs\page.css
mklink /h page.js ..\..\..\bassmati-on-code\inc\docs\page.js
mklink /h picture-1.css ..\..\..\bassmati-on-code\inc\docs\picture-1.css
mklink /h sticky-table-headers-1.css ..\..\..\bassmati-on-code\inc\docs\sticky-table-headers-1.css
mklink /h svg-1.js ..\..\..\bassmati-on-code\inc\docs\svg-1.js
mklink /h svg-dom-helper-1.js ..\..\..\bassmati-on-code\inc\docs\svg-dom-helper-1.js
