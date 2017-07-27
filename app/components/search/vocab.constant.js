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
          'type': 'url-media',
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
          'type': 'url-media',
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
    'medicalstudy': {
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
          'label': 'Source Article',
          'type': 'url',
          'canonicalUrl': 'http://schema.org/sameAs',
          'discoverable': false
        }
      ]
    }
  });
