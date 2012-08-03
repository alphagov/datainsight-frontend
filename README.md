Data Insights Web
=================

This is the web front end for the data insights platform. It serves up graphs and data from the data insights platform.
Graphs are rendered with [d3.js](http://d3js.org/).

Release Process
---------------

To package and release in one step run the `release.sh` script with the `-p` flag. This will create a package file and
release it.

To package and release as separate steps first run the `package.sh` script with no arguments. This will generate a zip
file which is the package. To release this package copy the hash out of the file name (the last part before the .zip
extension) and pass it as the first argument to `release.sh`.

    $ ./release.sh aaaaa