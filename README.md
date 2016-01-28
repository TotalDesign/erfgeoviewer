# ErfGeoviewer

The ErfGeoviewer is a tool to create maps based on cultural heritage collections. This application is
designed to support two builds: one for creating maps, and another for viewing them. 

All user-facing text inside the application is currently in Dutch. Comments are in English.
Multilingual support will not likely be included (by me) this year, but I'd love to see it added to 
reach a wider audience.

## Requirements

- node
- npm
- grunt

## Installation

1. Copy `app/scripts/config/default.js` to `app/scripts/config/dev.js`
2. Add [mapbox.js tokens](https://www.mapbox.com/help/create-api-access-token/) to dev.js
3. Install dependencies with npm and bower

```
npm install && bower install
grunt 
```
