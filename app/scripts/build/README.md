# About these build files

They need to stay in sync with the ./scripts/require-config.js. The only difference is the requirement of erfgeoviewer.mapmaker or erfgeoviewer.reader. Unfortunately there are limitations in the build process and I haven't found a good way to get around them.

**Note:** require.config() must be the first line of these two js files, otherwise the build breaks.