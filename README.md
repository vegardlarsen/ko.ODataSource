#  ko.ODataSource
ko.ODataSource is a utility class for Knockout that allows you to easily load data from an OData source (with filtering and/or ordering, tested with ASP.NET MVC4 WebApi).

This utility is tiny (2kB before compression, 563 bytes after compression with YUI, 373 bytes after YUI+gzip).

## Dependencies

- jQuery
- Knockout

## How to use

Make sure you have jQuery and Knockout on your page, and reference `ko.odatasource.js`. Try this with any `observableArray`:

    var someArray = ko.observableArray([]),
        dataSource = new ko.ODataSource(
            "/api/path/to/data", 
            someArray,
            {
                perPage: 24 // how many to load each time,
                converter: function(fooDto) {
                    return new FooViewModel(fooDto);
                }
            };
            // someArray will be populated with 24 FooViewModels
            // if the server returns that many
            
            // later, we want to load more data:
            dataSource.next();
            
            // when the user wants to start filtering:
            dataSource.filter("Price gt 5");
            
            // when the user wants to sort differently
            // (note that filtering is still applied from above)
            dataSource.orderby("Price desc");
            
            // to cancel filtering and ordering (both are equivalent)
            dataSource.filter(null).orderby(null);
            dataSource.clear();

## Methods
The `ko.ODataSource`'s methods are chain-callable, meaning you can do `source.clear().filter('Price gt 5').next()`

### `new ko.ODataSource(url, observableArray[, options])`
The constructor accepts sets up the data source, and loads the first set of data from the server. The `url` and `observableArray` options are self-explanatory, `options` is described below.

### `next()`
Fetches the next set of results from the server, and adds them to the observable array.

### `clear()`
Calls `reset()`, then removes any filters and ordering.

### `orderby(order)`
Changes the ordering to `order`. `order` is a OData ordering argument as a string; e.g. `"Price desc"`.

### `filter(expression)`
Changes the filter to `expression`. `expression` is a OData filter (e.g. `"Price gt 25"`).

## Options

### `perPage`
The number of results per call to `next()`. Default `24`.

### `converter`
A converter function to run for each data transfer object returned from the server. Defaults to adding the data transfer object directly to the observable array (e.g. the equivalent of `function(item) { return item; }`

The converter function receives one argument (the data transfer object) and is expected to output whatever you want in your observable array, usually a view model.

## License

ko.ODataSource  is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/).

## The author

This utility was written by [Vegard Andreas Larsen](http://vega.rd.no) ([@vegardlarsen](http://twitter.com/vegardlarsen)) for [Digital Creations AS](http://www.digitalcreations.no).