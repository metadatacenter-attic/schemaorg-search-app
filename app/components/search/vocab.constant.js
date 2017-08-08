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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'preptime',
          'label': 'Prep Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/prepTime',
          'filterable': true
        },
        { 'name': 'cooktime',
          'label': 'Cook Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/cookTime',
          'filterable': true
        },
        { 'name': 'totaltime',
          'label': 'Total Time',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/totalTime',
          'filterable': true
        },
        { 'name': 'recipeyield',
          'label': 'Serving Size',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/recipeYield',
          'filterable': true
        },
        { 'name': 'recipecategory',
          'label': 'Recipe Category',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/recipeCategory',
          'filterable': true
        },
        { 'name': 'aggregaterating',
          'label': 'Recipe Rating',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/aggregaterating',
          'filterable': true
        },
        { 'name': 'recipeinstructions',
          'label': 'Directions',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/recipeInstructions',
          'filterable': false
        },
        { 'name': 'ingredients',
          'label': 'Ingredients',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/ingredients',
          'filterable': false
        },
        { 'name': 'author',
          'label': 'Recipe by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/auhor',
          'filterable': false
        },
        { 'name': 'image',
          'label': 'Food Image',
          'type': 'url+image',
          'canonicalUrl': 'http://schema.org/image',
          'filterable': false
        },
        { 'name': 'recipecuisine',
          'label': 'Type of Cuisine',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/recipeCuisine',
          'filterable': true
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'calories',
          'label': 'Calories',
          'type': 'numeric',
          'unit': 'kcal',
          'canonicalUrl': 'http://schema.org/calories',
          'filterable': true
        },
        { 'name': 'fatcontent',
          'label': 'Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/fatContent',
          'filterable': true
        },
        { 'name': 'carbohydratecontent',
          'label': 'Carbohydrate',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/carbohydrateContent',
          'filterable': true
        },
        { 'name': 'proteincontent',
          'label': 'Protein',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/proteinContent',
          'filterable': true
        },
        { 'name': 'cholesterolcontent',
          'label': 'Cholesterol',
          'type': 'numeric',
          'unit': 'mg',
          'canonicalUrl': 'http://schema.org/cholesterolContent',
          'filterable': true
        },
        { 'name': 'sodiumcontent',
          'label': 'Sodium',
          'type': 'numeric',
          'unit': 'mg',
          'canonicalUrl': 'http://schema.org/sodiumContent',
          'filterable': true
        },
        { 'name': 'fibercontent',
          'label': 'Fiber',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/fiberContent',
          'filterable': true
        },
        { 'name': 'saturatedfatcontent',
          'label': 'Saturated Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/saturatedFatContent',
          'filterable': true
        },
        { 'name': 'unsaturatedfatcontent',
          'label': 'Unsaturated Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/unsaturatedFatContent',
          'filterable': true
        },
        { 'name': 'transfatcontent',
          'label': 'Trans Fat',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/transFatContent',
          'filterable': true
        },
        { 'name': 'sugarcontent',
          'label': 'Sugar',
          'type': 'numeric',
          'unit': 'g',
          'canonicalUrl': 'http://schema.org/sugarContent',
          'filterable': true
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'image',
          'label': 'Article Image',
          'type': 'url+image',
          'canonicalUrl': 'http://schema.org/image',
          'filterable': false
        },
        { 'name': 'headline',
          'label': 'Article Headline',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/headline',
          'filterable': false
        },
        { 'name': 'author',
          'label': 'Article by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/auhor',
          'filterable': false
        },
        { 'name': 'genre',
          'label': 'Article Genre',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/genre',
          'filterable': true
        },
        { 'name': 'articlesection',
          'label': 'Article Section',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/articleSection',
          'filterable': true
        },
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'filterable': true
        },
        { 'name': 'printedition',
          'label': 'Printed by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/printedEdition',
          'filterable': false
        },
        { 'name': 'copyrightyear',
          'label': 'Published Year',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/copyrightYear',
          'filterable': false
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'bookformat',
          'label': 'Book Format',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/bookFormat',
          'filterable': true
        },
        { 'name': 'numberofpages',
          'label': 'Number of Pages',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/numberOfPages',
          'filterable': true
        },
        { 'name': 'inlanguage',
          'label': 'Language',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/inLanguage',
          'filterable': true
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'contentrating',
          'label': 'Movie Rating',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/contentRating',
          'filterable': true
        },
        { 'name': 'duration',
          'label': 'Movie Duration',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/duration',
          'filterable': true
        },
        { 'name': 'genre',
          'label': 'Movie Genre',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/genre',
          'filterable': true
        },
        { 'name': 'datepublished',
          'label': 'Release Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'filterable': false
        },
        { 'name': 'trailer',
          'label': 'Movie Trailer',
          'type': 'url+video',
          'canonicalUrl': 'http://schema.org/trailer',
          'filterable': false
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'filterable': true
        },
        { 'name': 'duration',
          'label': 'Duration',
          'type': 'duration',
          'unit': 'minute',
          'canonicalUrl': 'http://schema.org/duration',
          'filterable': true
        },
        { 'name': 'isfamilyfriendly',
          'label': 'Family Friendly?',
          'type': 'boolean',
          'canonicalUrl': 'http://schema.org/isFamilyFriendly',
          'filterable': true
        },
        { 'name': 'genre',
          'label': 'Video Genre',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/genre',
          'filterable': true
        },
        { 'name': 'embedurl',
          'label': 'Video URL',
          'type': 'url+video',
          'canonicalUrl': 'http://schema.org/embedUrl',
          'filterable': false
        },
        { 'name': 'interactioncount',
          'label': 'Total Viewer',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/interactionCount',
          'filterable': false
        },
        { 'name': 'interactionstatistic',
          'label': 'Total Viewer',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/interactionStatistic',
          'filterable': false
        },
        { 'name': 'uploaddate',
          'label': 'Upload Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/uploadDate',
          'filterable': false
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'license',
          'label': 'License',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/license',
          'filterable': true
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'headline',
          'label': 'Article Headline',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/headline',
          'filterable': false
        },
        { 'name': 'author',
          'label': 'Article by',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/author',
          'filterable': false
        },
        { 'name': 'citation',
          'label': 'Citation',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/citation',
          'filterable': false
        },
        { 'name': 'datepublished',
          'label': 'Publication Date',
          'type': 'date',
          'canonicalUrl': 'http://schema.org/datePublished',
          'filterable': true
        },
        { 'name': 'sameas',
          'label': 'Source',
          'type': 'url',
          'canonicalUrl': 'http://schema.org/sameAs',
          'filterable': false
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
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'population',
          'label': 'Population',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/population',
          'filterable': false
        },
        { 'name': 'sameas',
          'label': 'Source',
          'type': 'url',
          'canonicalUrl': 'http://schema.org/sameAs',
          'filterable': false
        }
      ]
    },
    'Drug': {
      'name': 'Drug',
      'label': 'Drug',
      'canonicalUrl': 'http://schema.org/Drug',
      'properties': [
        { 'name': 'name',
          'label': 'Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/name',
          'filterable': false
        },
        { 'name': 'description',
          'label': 'Description',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/description',
          'filterable': false
        },
        { 'name': 'activeIngredient',
          'label': 'Active Ingredient',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/activeIngredient',
          'filterable': false
        },
        { 'name': 'administrationRoute',
          'label': 'Administration Route',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/administrationRoute',
          'filterable': false
        },
        { 'name': 'availableStrength',
          'label': 'Available Strength',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/availableStrength',
          'filterable': false
        },
        { 'name': 'cost',
          'label': 'Drug Price',
          'type': 'numeric',
          'canonicalUrl': 'http://schema.org/cost',
          'filterable': true
        },
        { 'name': 'dosageForm',
          'label': 'Dosage Form',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/dosageForm',
          'filterable': true
        },
        { 'name': 'dosageSchedule',
          'label': 'Dosage Schedule',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/dosageSchedule',
          'filterable': false
        },
        { 'name': 'dosageUnit',
          'label': 'Dosage Unit',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/dosageUnit',
          'filterable': false
        },
        { 'name': 'foodWarning',
          'label': 'Food Warning',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/foodWarning',
          'filterable': false
        },
        { 'name': 'interactingDrug',
          'label': 'Interacting Drug',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/interactingDrug',
          'filterable': false
        },
        { 'name': 'legalStatus',
          'label': 'Legal Status',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/legalStatus',
          'filterable': false
        },
        { 'name': 'manufacturer',
          'label': 'Manufacturer',
          'type': 'enum',
          'canonicalUrl': 'http://schema.org/manufacturer',
          'filterable': true
        },
        { 'name': 'mechanismOfAction',
          'label': 'Mechanism of Action',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/mechanismOfAction',
          'filterable': false
        },
        { 'name': 'nonProprietaryName',
          'label': 'Generic Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/nonProprietaryName',
          'filterable': false
        },
        { 'name': 'proprietaryName',
          'label': 'Brand Name',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/activeIngredient',
          'filterable': false
        },
        { 'name': 'alternateName',
          'label': 'Synonym',
          'type': 'text',
          'canonicalUrl': 'http://schema.org/alternateName',
          'filterable': false
        }
      ]
    }
  });
