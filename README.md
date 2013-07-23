# Data Insights Web

This is the web front end for the data insights platform. It serves up graphs and data from the data insights platform.
Graphs are rendered with [d3.js](http://d3js.org/).


## Run the app

To run datainsight and the supporting exposers run the following from the `development` project.

```
bowl datainsight
```

To run the `datainsight-frontend` project on it's own run the following from the `datainsight-frontend` project.

```
bundle exec rackup -p 3027
```

To run the `datainsight-frontend` project on it's own with stub data.

```
USE_STUB_DATA=1 bundle exec rackup -p 3027
```

