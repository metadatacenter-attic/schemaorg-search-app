angular.module("search-facets", []).constant('facets',
  { 'recipe': [ 'preptime', 'cooktime', 'totaltime', 'recipeyield', 'recipecategory', 'aggregateRating' ],
    'nutritioninformation': [ 'calories' ],
    'newsarticle': [ 'datepublished', 'datemodified' ],
    'videoobject': [ 'datepublished', 'duration', 'isfamilyfriendly', 'genre' ],
    'book': [ 'bookformattype', 'numberofpages', 'inlanguage' ],
    'dataset': [ 'license' ]
  }
);
