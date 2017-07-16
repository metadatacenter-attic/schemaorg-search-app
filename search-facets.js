angular.module("search-facets", []).constant('facets',
  { 'recipe': {
        'terms': [ 'preptime', 'cooktime', 'totaltime', 'recipeyield',
            'recipecategory', 'aggregaterating' ],
        'labels': [ 'Prep Time', 'Cook Time', 'Total Time', 'Serving Size',
            'Recipe Category', 'Recipe Ratings' ]
    },
    'nutritioninformation': {
        'terms': [ 'calories', 'fatcontent', 'carbohydratecontent',
            'proteincontent', 'cholesterolcontent', 'sodiumcontent' ],
        'labels': [ 'Calories', 'Fat', 'Carbohydrate', 'Protein',
            'Cholesterol', 'Sodium' ]
    },
    'newsarticle': {
        'terms': [ 'datepublished' ],
        'labels': [ 'Publication Date' ]
    },
    'videoobject': {
        'terms': [ 'datepublished', 'duration', 'isfamilyfriendly', 'genre' ],
        'labels': [ 'Publication Date', 'Duration', 'Family Friendly?', 'Genre' ]
    },
    'book': {
        'terms': [ 'bookformattype', 'numberofpages', 'inlanguage'],
        'labels': [ 'Book Format', 'Number of Pages', 'Language' ]
    },
    'dataset': {
        'terms': [ 'license' ],
        'labels': [ 'License' ]
    }
  });
