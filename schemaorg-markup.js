angular.module("schemaorg-markup", []).constant('schemaorgMarkup',
  { 'recipe': {
      'name': 'recipe',
      'label': 'Recipe',
      'canonicalUrl': 'http://schema.org/Recipe',
      'properties': [
        { 'name': 'preptime',
          'label': 'Prep Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/prepTime',
          'active': true
        },
        { 'name': 'cooktime',
          'label': 'Cook Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/cookTime',
          'active': true
        },
        { 'name': 'totaltime',
          'label': 'Cook Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/totalTime',
          'active': true
        },
        { 'name': 'recipeyield',
          'label': 'Serving Size',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/recipeYield',
          'active': true
        },
        { 'name': 'recipecategory',
          'label': 'Recipe Category',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/recipeCategory',
          'active': true
        },
        { 'name': 'aggregaterating',
          'label': 'Recipe Rating',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/aggregaterating',
          'active': true
        }
      ]
    },
    'nutritioninformation': {
      'name': 'nutritioninformation',
      'label': 'Nutrition Info',
      'canonicalUrl': 'http://schema.org/NutritionInformation',
      'properties': [
        { 'name': 'calories',
          'label': 'Calories',
          'type': 'numeric',
          'unit': 'kcal',
          'canonicalUrl': 'http://schema.org/calories',
          'active': true
        },
        { 'name': 'fatcontent',
          'label': 'Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/fatContent',
          'active': true
        },
        { 'name': 'carbohydratecontent',
          'label': 'Carbohydrate',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/carbohydrateContent',
          'active': true
        },
        { 'name': 'proteincontent',
          'label': 'Protein',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/proteinContent',
          'active': true
        },
        { 'name': 'cholesterolcontent',
          'label': 'Cholesterol',
          'type': 'numeric',
          'unit': 'mg',
          'canonicalUrl': 'http://schema.org/cholesterolContent',
          'active': true
        },
        { 'name': 'sodiumcontent',
          'label': 'Sodium',
          'type': 'numeric',
          'unit': 'mg',
          'canonicalUrl': 'http://schema.org/sodiumContent',
          'active': true
        },
        { 'name': 'fibercontent',
          'label': 'Fiber',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/fiberContent',
          'active': true
        },
        { 'name': 'saturatedfatcontent',
          'label': 'Saturated Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/saturatedFatContent',
          'active': true
        },
        { 'name': 'unsaturatedfatcontent',
          'label': 'Unsaturated Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/unsaturatedFatContent',
          'active': true
        },
        { 'name': 'transfatcontent',
          'label': 'Trans Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/transFatContent',
          'active': true
        },
        { 'name': 'sugarcontent',
          'label': 'Sugar',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/sugarContent',
          'active': true
        }
      ]
    },
    'newsarticle': {
      'name': 'newsarticle',
      'label': 'News Article',
      'canonicalUrl': 'http://schema.org/NewsArticle',
      'properties': [
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'active': true
        }
      ]
    },
    'videoobject': {
      'name': 'videoobject',
      'label': 'Video',
      'canonicalUrl': 'http://schema.org/VideoObject',
      'properties': [
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'active': true
        },
        { 'name': 'duration',
          'label': 'Duration',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/duration',
          'active': true
        },
        { 'name': 'isfamilyfriendly',
          'label': 'Family Friendly?',
          'type': 'boolean',
          'canonicalUrl': 'http://schema.org/isFamilyFriendly',
          'active': true
        },
        { 'name': 'genre',
          'label': 'Genre',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/genre',
          'active': true
        }
      ]
    },
    'book': {
      'name': 'book',
      'label': 'Book',
      'canonicalUrl': 'http://schema.org/Book',
      'properties': [
        { 'name': 'bookformat',
          'label': 'Book Format',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/bookFormat',
          'active': true
        },
        { 'name': 'numberofpages',
          'label': 'Number of Pages',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/numberOfPages',
          'active': true
        },
        { 'name': 'inlanguage',
          'label': 'Language',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/inLanguage',
          'active': true
        }
      ]
    },
    'dataset': {
      'name': 'dataset',
      'label': 'Dataset',
      'canonicalUrl': 'http://schema.org/Dataset',
      'properties': [
        { 'name': 'license',
          'label': 'License',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/license',
          'active': true
        }
      ]
    },
    'medicalstudy': {
      'name': 'MedicalStudy',
      'label': 'Medical Study',
      'canonicalUrl': 'http://schema.org/MedicalStudy',
      'properties': []
    }
  });
