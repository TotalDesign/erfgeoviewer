# ErfGeoviewer

The ErfGeoviewer is a tool to create maps based on cultural heritage collections. This application is
designed to support two builds: one for creating maps, and another for viewing them. 

In active development. A stable release is not yet available. Documentation will follow.

All user-facing text inside the application is currently in Dutch. Comments are in English. 
Multilingual support will not likely be included (by me) this year, but I'd love to see it added to 
reach a wider audience.

## Requirements

- node
- npm
- grunt

## Installation

Copy `app/scripts/config/default.js` to `app/scripts/config/dev.js` 

```
npm install && bower install
grunt 
```
 
Support for Routes currently requires an account with [RouteYou](http://routeyou.com/).

## Switching between mapmaker and reader mode

While developing, there are a couple of small changes you have to make to switch between reader/mapmaker mode.

index.html

```
- <script data-main="scripts/erfgeoviewer.mapmaker" src="bower_components/requirejs/require.js"></script>
+ <script data-main="scripts/erfgeoviewer.reader" src="bower_components/requirejs/require.js"></script>
```

require-config.js

```
- deps: ["backbone.marionette", "jquery", "erfgeoviewer.mapmaker"],
+ deps: ["backbone.marionette", "jquery", "erfgeoviewer.reader"],
```
