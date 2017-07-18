angular.module("search-facets", []).constant('facets',
  { 'recipe': {
        'terms': [ 'preptime', 'cooktime', 'totaltime', 'recipeyield',
            'recipecategory', 'aggregaterating' ],
        'labels': [ 'Prep Time', 'Cook Time', 'Total Time', 'Serving Size',
            'Recipe Category', 'Recipe Ratings' ],
        'dtype': [ 'duration', 'duration', 'duration', 'numeric', 'text', 'numeric']
    },
    'nutritioninformation': {
        'terms': [ 'calories', 'fatcontent', 'carbohydratecontent',
            'proteincontent', 'cholesterolcontent', 'sodiumcontent' ],
        'labels': [ 'Calories', 'Fat', 'Carbohydrate', 'Protein',
            'Cholesterol', 'Sodium' ],
        'dtype': [ 'numeric', 'numeric', 'numeric', 'numeric', 'numeric', 'numeric' ]
    },
    'newsarticle': {
        'terms': [ 'datepublished' ],
        'labels': [ 'Publication Date' ],
        'dtype': [ 'date' ]
    },
    'videoobject': {
        'terms': [ 'datepublished', 'duration', 'isfamilyfriendly', 'genre' ],
        'labels': [ 'Publication Date', 'Duration', 'Family Friendly?', 'Genre' ],
        'dtype': [ 'date', 'duration', 'boolean', 'text' ]
    },
    'book': {
        'terms': [ 'bookformattype', 'numberofpages', 'inlanguage'],
        'labels': [ 'Book Format', 'Number of Pages', 'Language' ],
        'dtype': [ 'text', 'numeric', 'text' ]
    },
    'dataset': {
        'terms': [ 'license' ],
        'labels': [ 'License' ],
        'dtype': [ 'text' ]
    },
    'MedicalStudy': {
        'terms': [],
        'labels': [],
        'dtype': []
    }
  });
