'use strict';

angular.module('search')

.factory('CseDataService', [
  'DataCleaningService',
  'SchemaOrgVocab',

function(DataCleaningService, SchemaOrgVocab) {
  var structuredData = [];
  var nonStructuredData = [];

  function prepare(searchResult) {
    return {
      url: searchResult.url,
      title: searchResult.title,
      description: searchResult.description,
      image: searchResult.image,
      thumbnail: searchResult.thumbnail,
      topics: [],
      properties: []
    };
  }

  function createProperty(topicSchema, propertySchema, refinedValue, instanceIndex) {
    return {
      id: topicSchema.id + "." + propertySchema.id,
      topic: {
        id: topicSchema.id,
        label: topicSchema.label,
        instance: topicSchema.id + ":" + instanceIndex
      },
      label: propertySchema.label,
      value: refinedValue.value,
      unit: propertySchema.unit,
      type: propertySchema.type,
      hasWarning: refinedValue.hasWarning,
      originalValue: refinedValue.originalValue,
      filterable: propertySchema.filterable
    };
  }

  function parse(searchResult, topicSchemas) {
    let data = prepare(searchResult);
    let hasMarkup = false;
    if (searchResult.responseData.hasOwnProperty('pagemap')) {
      let pagemap = searchResult.responseData.pagemap;
      Object.keys(topicSchemas).forEach(topicId => {
        let topicDataArray = Object.getIgnoreCase(pagemap, topicId);
        if (topicDataArray != null) {
          let topicSchema = topicSchemas[topicId];
          storeTopic(data, topicSchema);
          storeProperties(data, topicSchema, topicDataArray);
          hasMarkup = true;
        }
      });
    }
    return {
      hasMarkup: hasMarkup,
      data: data
    };
  }

  function storeTopic(data, topicSchema) {
    data.topics.push(topicSchema.id);
  }

  function storeProperties(data, topicSchema, topicDataArray) {
    topicDataArray.forEach((topicData, index) => {
      topicSchema.properties.forEach(propertySchema => {
        let topicId = topicSchema.id;
        let propertyId = propertySchema.id;
        try {
          let propertyValue = Object.getIgnoreCase(topicData, propertyId);
          if (propertyValue != null) {
            let refinedValue = DataCleaningService.refine(propertyValue,
                propertySchema.type,
                propertySchema.unit);
            let property = createProperty(topicSchema, propertySchema, refinedValue, index);
            data.properties.push(property);
          }
        } catch (e) {
          console.warn("WARN: Unable to store property "
              + topicId + "." + propertyId
              + " (Reason: " + e.message + ")");
        }
      });
    });
  }

  function getTopicSchemas(topicIds) {
    let topicSchemas = {};
    if (topicIds.length != 0) {
      topicIds.forEach(topicId => {
        if (SchemaOrgVocab[topicId] != null) {
          topicSchemas[topicId] = SchemaOrgVocab[topicId];
        }
      });
    } else {
      topicSchemas = SchemaOrgVocab;
    }
    return topicSchemas;
  }

  function findIndex(arr, key, value) {
    for(var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) return i;
    }
    return -1;
  }

  var add = function(searchResult, topicIds=[]) {
    let topicSchemas = getTopicSchemas(topicIds);
    let parsedData = parse(searchResult, topicSchemas);
    if (parsedData.hasMarkup) {
      structuredData.push(parsedData.data);
    } else {
      nonStructuredData.push(parsedData.data);
    }
  }

  var get = function(url) {
    let data = [];
    let index = findIndex(structuredData, "url", url);
    if (index != -1) {
      data.push(structuredData[index]);
    }
    index = findIndex(nonStructuredData, "url", url);
    if (index != -1) {
      data.push(nonStructuredData[index]);
    }
    return data;
  }

  var remove = function(url) {
    let index = findIndex(structuredData, "url", url);
    if (index != -1) {
      structuredData.splice(index, 1);
    }
    index = findIndex(nonStructuredData, "url", url);
    if (index != -1) {
      nonStructuredData.splice(index, 1);
    }
  }

  var clear = function() {
    structuredData.splice(0, structuredData.length);
    nonStructuredData.splice(0, nonStructuredData.length);
  }

  return {
    structuredData: structuredData,
    nonStructuredData: nonStructuredData,
    add: add,
    get: get,
    remove: remove,
    clear: clear
  }
}]);
