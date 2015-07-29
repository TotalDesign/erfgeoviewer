# About this folder

This contains css assets taken from bower libraries which had to be renamed to be treated as SCSS files. 

The @import directive works differently in plain CSS than in SCSS. See issue [Importing CSS as Sass files](https://github.com/sass/sass/issues/556).

The build process breaks if css files are @import'ed. 
