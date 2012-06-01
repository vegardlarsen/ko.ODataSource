(function ($, ko) {
    var ODataSource = ko.ODataSource = function (url, observableArray, options) {
        options = $.extend({}, ODataSource.defaults, options);
        var self = this,
            reachedEnd,
            resultsPerPage = options.perPage,
            converter = options.converter,
            foreach = ko.utils.arrayForEach,
            query,
            reset = function () {
                query.$skip = 0;
                reachedEnd = false;
                observableArray([]);
                return self;
            };

        self.next = function () {
            if (!reachedEnd) {
                $.get(url, query, function (data) {
                    var length = data.length;
                    reachedEnd = !length || length < resultsPerPage;
                    observableArray.valueWillMutate();
                    foreach(data, function (item) {
                        observableArray.push(converter ? converter(item) : item);
                    });
                    observableArray.valueHasMutated();
                });
            }
            query.$skip += resultsPerPage;
            return this;
        };
        self.clear = function () {
            query = { $top: resultsPerPage };
            return reset();
        };

        // auto-generate two very similar methods
        // both of these methods modify the query object to add an OData query parameter
        foreach(['orderby', 'filter'], function (func) {
            self[func] = function (x) {
                self.reset();
                delete query['$' + func];
                // only add it back in if the value is a non-empty string
                if (!!x) query['$' + func] = x;
                return self;
            };
        });

        self.clear().next();
    };

    ODataSource.defaults = {
        perPage: 24
    };
} (jQuery, ko));