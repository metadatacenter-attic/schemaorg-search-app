'use strict';

angular.module('search')

.constant('SchemaorgVocab',
  { 'recipe': {
      'name': 'recipe',
      'label': 'Food Recipe',
      'canonicalUrl': 'http://schema.org/Recipe',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'preptime',
          'label': 'Prep Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/prepTime',
          'discoverable': true
        },
        { 'name': 'cooktime',
          'label': 'Cook Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/cookTime',
          'discoverable': true
        },
        { 'name': 'totaltime',
          'label': 'Total Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/totalTime',
          'discoverable': true
        },
        { 'name': 'recipeyield',
          'label': 'Serving Size',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/recipeYield',
          'discoverable': true
        },
        { 'name': 'recipecategory',
          'label': 'Recipe Category',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/recipeCategory',
          'discoverable': true
        },
        { 'name': 'aggregaterating',
          'label': 'Recipe Rating',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/aggregaterating',
          'discoverable': true
        },
        { 'name': 'recipeinstructions',
          'label': 'Directions',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/recipeInstructions',
          'discoverable': false
        },
        { 'name': 'ingredients',
          'label': 'Ingredients',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/ingredients',
          'discoverable': false
        },
        { 'name': 'author',
          'label': 'Recipe by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/auhor',
          'discoverable': false
        },
        { 'name': 'image',
          'label': 'Food Image',
          'type': 'url+image',
          'canonicalUrl': 'http://schema.org/image',
          'discoverable': false
        },
        { 'name': 'recipecuisine',
          'label': 'Type of Cuisine',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/recipeCuisine',
          'discoverable': true
        }
      ]
    },
    'nutritioninformation': {
      'name': 'nutritioninformation',
      'label': 'Nutrition Info',
      'canonicalUrl': 'http://schema.org/NutritionInformation',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'calories',
          'label': 'Calories',
          'type': 'numeric',
          'unit': 'kcal',
          'canonicalUrl': 'http://schema.org/calories',
          'discoverable': true
        },
        { 'name': 'fatcontent',
          'label': 'Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/fatContent',
          'discoverable': true
        },
        { 'name': 'carbohydratecontent',
          'label': 'Carbohydrate',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/carbohydrateContent',
          'discoverable': true
        },
        { 'name': 'proteincontent',
          'label': 'Protein',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/proteinContent',
          'discoverable': true
        },
        { 'name': 'cholesterolcontent',
          'label': 'Cholesterol',
          'type': 'numeric',
          'unit': 'mg',
          'canonicalUrl': 'http://schema.org/cholesterolContent',
          'discoverable': true
        },
        { 'name': 'sodiumcontent',
          'label': 'Sodium',
          'type': 'numeric',
          'unit': 'mg',
          'canonicalUrl': 'http://schema.org/sodiumContent',
          'discoverable': true
        },
        { 'name': 'fibercontent',
          'label': 'Fiber',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/fiberContent',
          'discoverable': true
        },
        { 'name': 'saturatedfatcontent',
          'label': 'Saturated Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/saturatedFatContent',
          'discoverable': true
        },
        { 'name': 'unsaturatedfatcontent',
          'label': 'Unsaturated Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/unsaturatedFatContent',
          'discoverable': true
        },
        { 'name': 'transfatcontent',
          'label': 'Trans Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/transFatContent',
          'discoverable': true
        },
        { 'name': 'sugarcontent',
          'label': 'Sugar',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/sugarContent',
          'discoverable': true
        }
      ]
    },
    'newsarticle': {
      'name': 'newsarticle',
      'label': 'News Article',
      'canonicalUrl': 'http://schema.org/NewsArticle',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'image',
          'label': 'Article Image',
          'type': 'url+image',
          'canonicalUrl': 'http://schema.org/image',
          'discoverable': false
        },
        { 'name': 'headline',
          'label': 'Article Headline',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/headline',
          'discoverable': false
        },
        { 'name': 'author',
          'label': 'Article by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/auhor',
          'discoverable': false
        },
        { 'name': 'genre',
          'label': 'Article Genre',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/genre',
          'discoverable': true
        },
        { 'name': 'articlesection',
          'label': 'Article Section',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/articleSection',
          'discoverable': true
        },
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'discoverable': true
        },
        { 'name': 'printedition',
          'label': 'Printed by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/printedEdition',
          'discoverable': false
        },
        { 'name': 'copyrightyear',
          'label': 'Published Year',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/copyrightYear',
          'discoverable': false
        }
      ]
    },
    'book': {
      'name': 'book',
      'label': 'Book',
      'canonicalUrl': 'http://schema.org/Book',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'bookformat',
          'label': 'Book Format',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/bookFormat',
          'discoverable': true
        },
        { 'name': 'numberofpages',
          'label': 'Number of Pages',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/numberOfPages',
          'discoverable': true
        },
        { 'name': 'inlanguage',
          'label': 'Language',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/inLanguage',
          'discoverable': true
        }
      ]
    },
    'movie': {
      'name': 'movie',
      'label': 'Movie',
      'canonicalUrl': 'http://schema.org/Movie',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'contentrating',
          'label': 'Movie Rating',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/contentRating',
          'discoverable': true
        },
        { 'name': 'duration',
          'label': 'Movie Duration',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/duration',
          'discoverable': true
        },
        { 'name': 'genre',
          'label': 'Movie Genre',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/genre',
          'discoverable': true
        },
        { 'name': 'datepublished',
          'label': 'Release Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'discoverable': false
        },
        { 'name': 'trailer',
          'label': 'Movie Trailer',
          'type': 'url+video',
          'canonicalUrl': 'http://schema.org/trailer',
          'discoverable': false
        }
      ]
    },
    'videoobject': {
      'name': 'videoobject',
      'label': 'Video',
      'canonicalUrl': 'http://schema.org/VideoObject',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'discoverable': true
        },
        { 'name': 'duration',
          'label': 'Duration',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/duration',
          'discoverable': true
        },
        { 'name': 'isfamilyfriendly',
          'label': 'Family Friendly?',
          'type': 'boolean',
          'canonicalUrl': 'http://schema.org/isFamilyFriendly',
          'discoverable': true
        },
        { 'name': 'genre',
          'label': 'Video Genre',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/genre',
          'discoverable': true
        },
        { 'name': 'embedurl',
          'label': 'Video URL',
          'type': 'url+video',
          'canonicalUrl': 'http://schema.org/embedUrl',
          'discoverable': false
        },
        { 'name': 'interactioncount',
          'label': 'Total Viewer',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/interactionCount',
          'discoverable': false
        },
        { 'name': 'interactionstatistic',
          'label': 'Total Viewer',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/interactionStatistic',
          'discoverable': false
        },
        { 'name': 'uploaddate',
          'label': 'Upload Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/uploadDate',
          'discoverable': false
        }
      ]
    },
    'dataset': {
      'name': 'dataset',
      'label': 'Dataset',
      'canonicalUrl': 'http://schema.org/Dataset',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'license',
          'label': 'License',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/license',
          'discoverable': true
        }
      ]
    },
    'medicalwebpage': {
      'name': 'medicalwebpage',
      'label': 'Medical Web Page',
      'canonicalUrl': 'http://schema.org/MedicalWebPage',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'headline',
          'label': 'Article Headline',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/headline',
          'discoverable': false
        },
        { 'name': 'author',
          'label': 'Article by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/author',
          'discoverable': false
        },
        { 'name': 'citation',
          'label': 'Citation',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/citation',
          'discoverable': false
        },
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'discoverable': true
        },
        { 'name': 'sameas',
          'label': 'Source',
          'type': 'url',
          'canonicalUrl': 'http://schema.org/sameAs',
          'discoverable': false
        }
      ]
    },
    'MedicalStudy': {
      'name': 'MedicalStudy',
      'label': 'Medical Study',
      'canonicalUrl': 'http://schema.org/MedicalStudy',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'discoverable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'discoverable': false
        },
        { 'name': 'population',
          'label': 'Population',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/population',
          'discoverable': false
        },
        { 'name': 'sameas',
          'label': 'Source',
          'type': 'url',
          'canonicalUrl': 'http://schema.org/sameAs',
          'discoverable': false
        }
      ]
    }
  });
