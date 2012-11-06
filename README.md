Data Insights Web
=================

This is the web front end for the data insights platform. It serves up graphs and data from the data insights platform.
Graphs are rendered with [d3.js](http://d3js.org/).

Start the app with stub data
============================

First start static and then.

```
USE_STUB_DATA=1 bundle exec rake unicorn -p 3027
```