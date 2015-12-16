Title: Technical Documentation
Author: Jason David Yergeau
Base Header Level: 1

# ErfGeoviewer Technical Documentation

## Table of Contents

I. Introduction
II. Guiding Principles
III. Feature List
IV. Installation
V. Build Procedure
VI. Application Architecture
VII. Libraries
VIII. Plugin System



I. Introduction
---------------

The purpose of the ErfGeoviewer is to place cultural heritage collections on a map. It can be used to present a predefined set of items -- for example, all of the windmills in the Netherlands -- or it can be an entry point to explore vast collections across multiple databases by time period, location or semantically by keyword. This document describes the tool's features and its technical foundations, including a practical guide for installation and configuration.

The application contains two separate builds, one for creating maps, and another for reading them. The reader version is smaller and designed for embedding into a website. It is also better optimized for mobile devices.

II. Guiding Principles
----------------------

- The viewer must be easy to embed into any website. Large websites such as innl.nl will feature the tool prominently on their website, but it should be just as easy to embed these maps by casual bloggers or journalists who want to share their findings.
- The viewer must work for different kinds of collections. It is not possible to design for every variation, but a modular structure will help facilitate contributions to support additional layouts, filters and data types.
- The viewer will use only frontend, open source components. It is written in JavaScript. It will fetch data using an API.
- All code is open source, licensed under the [MIT License](https://opensource.org/licenses/MIT).



III. Feature List
-----------------

### F.01 - Core functionality

This feature includes the implementation of Leaflet.js, which contains the following key features:

- Zoom and drag controls
- Support for keyboard
- Support for touch devices
- Modular architecture
- Support for multiple layers
	- Base tile layer
	- Additional tile layers
	- GeoJSON features layer
	- Image overlays

### F.02 - Markers

Geocoded objects from a result set that contain a point (that is, records that contain a longitude and latitude value) can be added to a map in the form of a marker. 

Icons are taken from open source [Maki icon set](https://github.com/mapbox/maki), and implemented using extensions to Leaflet provided by [Mapbox.js](https://github.com/mapbox/mapbox.js/), also open source.

Markers are styled according to the [simplestyle specification, 1.1.0](https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0). This provides the means to modify a marker's size, symbol, color, text and description. 

The markers support the following features:

### F.03 - Polygons

Geocoded objects from a result set that contain geometries such as polygons and lines can also be drawn on the map. These shapes have less interactivity than markers, but can be styled using the [simplestyle specification, 1.1.0](https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0). This provides the means to modify a polygon's stroke (the color and thickness of the border) and its fill color.

### F.04 - Detail view

The detail view appears after clicking a stored object on the map, such as a marker. The fields from that object are then shown. 

The site implementing the ErfGeoviewer can customize this pane by altering the configuration file. By default, the following fields will be displayed if available:

- Title
- Image
- Description
- Link to external page

When the object is of type "kaart", additional controls are exposed to alter an overlaid image:

- Rotate/scale
- Distort 
- Transparency

### F.05 - Legend with customizable icons

A legend can be configured in mapmaker mode, and displayed in reader mode. It allows a user to show colored markers with an optional icon next to a editable label. If enabled, it appears in the lower left of the map in reader mode.

### F.06 - Configuration interface

A number of settings are available directly through the ErfGeoviewer interface.

- Title of map
- Toggle for search
- Toggle for social share widget
- Toggle legend
- Toggle list view ("Mijn kaart")
- Colors
- Base map
- Legend

### F.07 - Configuration spec

The following settings can be configured through a configuration file. A template for this file is stored in version control. A developer creating an instance of the ErfGeoviewer will create a per-site version of this file. 

- Primary and secondary colors
- Control to open a new map
- Control to create a new map
- Default text for "Lees meer" in detail screen
- Available colors for configuring the interface via forms
- Mapbox settings (optional)
- Array of base tiles
- Connection settings to Digitale Collectie via de Zoek en Vind API
- Fields to show on detail screen

### F.08 - Embedding

The "reader mode" provides a way to easily embed curated maps. 

- Loading JSON file
- Recreation of map features (markers, polygons)
- Reading configuration to enable/disable options such as the legend or map title

### F.09 - Integration with Data Atlas

- Users can clone an existing map into their own Data Atlas account
- This creates an exact copy, which can be modified to fit the user's requirements
- This feature is handled by the Data Atlas, not by the ErfGeoviewer itself.
- All maps contain a "clone" action which links to the Data Atlas.

*Note: This feature has not yet been implemented.* (14 December 2015)

### F.10 - Timeline filter

A slider will allow users to filter a layer based on a date range. The slider is made available by clicking a filter icon in the upperleft of the map.

*Note: This feature was developed, but has an unmet dependency on the Zoek en Vind API.* (14 December 2015)

### F.11 - Facets

Users can reduce search results through one or more facets, which are configurable through the configuration file. By default, the exposed filters are type, collection and subject.

By clicking a facet, the results are narrowed. This selection can be reset by clicking the "reset" link.

### F.12 - Search field

Users can search by keyword. Pressing enter begins the search. This can also be initiated by clicking a search icon. 

Results can be restricted to the map's current bounding box by selecting "zoek binnen kader".

### F.13 - Search results

The results of the search are listed in a pane overlay before being plotted on a map. Only objects with associated spatial data are returned. These are shown in an alternative color on the map, and in the case of markers, are smaller than stored objects.

### F.14 - Map layers

Markers and image overlays are placed in separate layer groups. Markers always appear above an overlaid image.

### F.15 - Layouts

The application will be designed using Marionette regions and underscore templates. This provides a flexible way to adjust the presentation of a map instance.

### F.16 - Filter markers

Added 2 september 2015. Once markers are added to a map, then can later be searched through the "mijn kaart" list view. This provides a way to quickly find one marker out of a larger, pre-selected dataset. 

### F.17 - Welcome screen

Added 2 september 2015. Provides a quick overview of the application, with quick-links to start a new map or open an existing one.

### F.18 - Drawing tools

Markers that are not associated with a search result can be created using the drawing tools.

### F.19 - Printing

The map has a printer-friendly version.

*Note: This feature has not been implemented.* (14 December 2015)

### F.20 - Long read view

Markers are linked to one another in sequential order. From the reader view, one can click on a detail view, and click "next" or "previous" to move to the detail screen of another object.

### F.21 - Address navigation

A user can search for a location on the map using an address such as "Pedro de Medinalaan 9, Amsterdam".

*Note: This feature has not yet been implemented.* (14 December 2015)

### F.22 - Webrichtlijnen

The ErfGeoviewer will make a best effort to comply with the Webrichtlijnen. 

IV. Installation
----------------

The ErfGeoviewer is a JavaScript, browser-based application. 

### Requirements

For visitors to a website who interact with the ErfGeoviewer to view a map, the basic requirement is a modern browser.

- Internet Explorer 10+, Firefox 41+, Chrome 43+, Safari 9+, Android 4.4+, or iOS Safari 8.4+.

For developers:

- Dependancies are managed through [Bower](http://bower.io/) and [npm](https://www.npmjs.com/). 
- Common tasks such as initializing the Express server for development and building the application are handled using [Grunt](http://gruntjs.com/).
- [Compass](http://compass-style.org/install/) is required.

### Set up for development

1. Copy `config/defaults.js`into `config/dev.js`. This is your configuration file. See comments in the file itself for more details.
2. If your system has npm, bower, grunt and compass already, then you can download all dependancies with one line:  `npm install && bower install`
3. To start the Express.js server, simply run `grunt`.
4. Visit [http://localhost:9009](http://localhost:9009) in your browser to see the ErfGeoviewer.

### Configuration options

The configuration file itself contains the best source of documentation on what each setting does. Here are some tips for common configurations.

#### Restrict search to one or more collection

Preselecting a facet is the best way to restrict a search to a particular collection. This can be done by setting the edm:dataProvider facet to a given value. This example filters results to only records from the Rijksmuseum and Zeeuwse Bibliotheek.

Set zoek_en_vind.facets to the following value:

```
"facets": {
  "type": 'OR',
  "values": [
    'edm:dataProvider exact "Rijksmuseum"',
    'edm:dataProvider exact "Zeeuwse Bibliotheek"'
  ]
}
```

#### Change the number of facets

The number of facets can be configured using the `zoek_en_vind.requestedFacets` parameter. For more details, see the [API documentation under Facets](http://data.digitalecollectie.nl/api). This example requests 20 items from the facet "dc:subject", followed by the detail number of items (10) from "dc:type", and "edm:dataProvider". The final facet, `dc:date.year:250`, is required by the ErfGeoviewer and should not be removed. 

```
"requestedFacets": [
  "dc:subject:20",
  "dc:type",
  "edm:dataProvider",
  "dc:date.year:250"
]
```

#### Alter the detail screen

The detail screen appears after clicking on a map marker or polygon. By default, the title, image, description and external URL are displayed, in that order. However, that can be modified using the fields property. Labels can also be added by modifying the objects within this array.

```
"fields": [
  {
    "key": "title",
    "label": ""
  },
  {
    "key": "description",
    "label": "Description"
  },
  {
    "key": "image",
    "label": "Photo"
  },
  {
    "key": "externalUrl",
    "label": "For more information"
  }
]
```

V. Creating a build
-------------------

Running `grunt build`from the root of the project folder will initialize a build.

A build contains two versions of the ErfGeoviewer: a "mapmaker" version, which includes all tools necessary to create maps; and a smaller "reader" version, which is used for embedding already created maps.




## VI. Application architecture

[RequireJS](http://requirejs.org/) dependency injection and the [Marionette Backbone framework](http://marionettejs.com/) are the biggest influencers on the structure of the application. A basic understanding of these libraries is recommended before doing any in-depth development on the ErfGeoviewer. This will help explain how views, models and layouts relate to each other, and provide context for event handling and the ErfGeoviewer's internal messaging system.

RequireJS and Marionette add structure to the application, and the core functionality is based upon [Leaflet](http://leafletjs.com/). This mapping library has been extended into [Mapbox.js](https://www.mapbox.com/mapbox.js/api/v2.2.3/). 

### Initialization

The application is initialized using RequireJS. For mapmaker mode, the `scripts/erfgeoviewer.mapmaker`module is loaded. For reader mode, `scripts/erfgeoviewer.reader`is used.

```
<script data-main="scripts/erfgeoviewer.mapmaker" src="bower_components/requirejs/require.js"></script>
```

### Further reading

Code comments are used as the primary source of code documentation.

## VII. Libraries

The ErfGeoviewer was built using front-end open source JavaScript libraries. A separated API will be used for querying and retrieving documents, and a Node.js server can be optionally used by contributors to facilitate faster development and manage dependencies. 

- Leaflet.js - a versatile, widely adopted mapping library. (Github stars: 10,492)
- D3.js - visualization library with substantial support for calculating geographic projections and rendering them. It can be used in combination with Leaflet to create highly customized maps. (Github stars: 37,424)
- Backbone.js - light MVP framework with few dependencies, used to structure code. (Github stars: 21,673)
- Marionette.js - extension to Backbone to facilitate common design patterns in the application structure. (Github stars: 6,139)
- Bower - package manager for managing application dependencies. Used only for development. (Github stars: 12,191)
- Grunt - task manager to streamline common tasks such as bundling software (Github stars: 9,453)

Other tools and libraries are also used. For a full listing, the bower.js includes a list of libraries and their required versions.

### How these components work together

Leaflet.js is the primary mapping tool of the ErfGeoviewer. It is used to render tiles, markers, geographic shapes (markers, polygons, lines), handling user interactions such as swiping the map, zooming, setting the center location, and displaying pop-ups. It supports mobile and touch devices, has a pluggable architecture and a lively open source community.

D3.js is a "lower level" tool for manipulating data, and includes libraries useful for drawing maps based on GeoJSON and provides functions for calculating spatial areas and distances. It is also a powerful tool for data visualization, and excels in making charts, animations and manipulating datasets. It is a natural partner to Leaflet when specialized behaviors or visuals are necessary. It can draw shapes on top of a map rendered by Leaflet, or render charts inside a popup that's triggered by a Leaflet event.

Backbone.js and Marionette.js assist in creating separation of concern within the application. Presentation logic is structurally isolated from code that draws data from the API, and also from the "business logic" that orchestrates the steps of rendering the map: initializing libraries, requesting data, processing a user search, and passing search results to the map for display. 

Bower and Grunt are used by developers only, and is not be bundled into the ErfGeoviewer that is embedded on websites. However, they are important to mention because they influence both the workflow of the project and its architecture.

Bower is a package manager. The ErfGeoviewer describes all of its dependencies such as Leaflet and D3 in a single file. This file is placed under version control, in git. When contributors of a project begin setting up their local environment, they often begin by looking at this file. It shows clearly which tools are in use, which versions, and how they depend on one another. This file is read by Bower to download all necessary libraries into a developer's local environment.

Grunt is a task manager. It runs common tasks such as starting a server or compiling SASS files into CSS when a file change is detected. It is also used for compiling the many JavaScript libraries used by the application into a single, minimized file with a reduced size. This improves performance and makes it easier to embed into a website.



VIII. Plugin system
-------------------

An ErfGeoviewer plugin provides a way to extend functionality. The core application depends on several plugins:

- `plugins/draw` - Extends the Leaflet.draw tool to add custom makers that are not based off a search result. 
- `plugins/feature_list`- Lists all features currently added to a map. List is searchable, and provides tools for bulk deletion.
- `plugins/geojson_features` - Manages GeoJSON features (polygons, points, etc)
- `plugins/map_settings`- Exposes in-app configuration and settings.
- `plugins/zev` - ZeV stands for "Zoek en Vind", and implements search functionality.

At minimum, a plugin must contain the following two files:

- `erfgeo-grunt-require.json`
- `plugin.js`

These will be registered during the build process and used to create separate JavaScript files, one per plugin. These files are lazy-loaded at runtime by RequireJS.