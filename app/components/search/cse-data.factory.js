'use strict';

angular.module('search')

.factory('CseDataService', [
  'SchemaorgVocab',

function(schemaorgVocab) {
  var propertyIds = [];
  var dataModel = [];

  function createNew(rawData) {
    var data = {
      url: rawData.url,
      title: rawData.title,
      description: rawData.description,
      hasStructuredData: false,
      topics: [],
      properties: [],
    };
    return data;
  }

  function createProperty(topicAttributes, propertyAttributes, propertyValue) {
    var property = {
      id: getId(topicAttributes.name, propertyAttributes.name),
      domain: topicAttributes,
      range: propertyAttributes.type,
      name: propertyAttributes.name,
      label: propertyAttributes.label,
      value: refineValue(propertyValue,
          propertyAttributes.type,
          propertyAttributes.unit),
      unit: propertyAttributes.unit,
      type: propertyAttributes.type,
      discoverable: propertyAttributes.discoverable
    };
    return property;
  }

  function enrich(data, rawData, topicNames) {
    var structuredData = parse(rawData, topicNames);
    if (!angular.equals(structuredData, {})) {
      storeTopics(data, structuredData);
      storeProperties(data, structuredData);
      data.hasStructuredData = true;
    }
    return data;
  }

  function parse(rawData, topicNames) {
    var structuredData = {};
    for (var i = 0; i < topicNames.length; i++) {
      var topicName = topicNames[i];
      if (!rawData.hasOwnProperty('pagemap')) {
        break;
      }
      var pagemap = rawData.pagemap;
      if (pagemap.hasOwnProperty(topicName)) {
        var topicDataArray = pagemap[topicName];
        structuredData[topicName] = findBestData(topicDataArray);
      }
    }
    return structuredData;
  }

  function findBestData(topicDataArray) {
    var bestData = {};
    var bestInfoSize = -1;
    for (var i = 0; i < topicDataArray.length; i++) {
      var topicData = topicDataArray[i];
      var infoSize = Object.keys(topicData).length;
      if (infoSize > bestInfoSize) {
        bestData = topicData;
        bestInfoSize = infoSize;
      }
    }
    return bestData;
  }

  function storeTopics(data, structuredData) {
    var topicNames = Object.keys(structuredData);
    topicNames.forEach(topicName => {
      data.topics.push(topicName);
    });
  }

  function storeProperties(data, structuredData) {
    var topicNames = Object.keys(structuredData);
    topicNames.forEach(topicName => {
      var topic = schemaorgVocab[topicName];
      if (topic != null) { // If the topic metadata is found
        var topicAttributes = {
          name: topic.name,
          label: topic.label
        }
        var propertyAttributesArray = topic.properties;
        for (var i = 0; i < propertyAttributesArray.length; i++) {
          var propertyAttributes = propertyAttributesArray[i];
          var propertyValue = structuredData[topicAttributes.name][propertyAttributes.name];
          if (propertyValue != null) {
            var property = createProperty(topicAttributes,
              propertyAttributes,
              propertyValue);
            data.properties.push(property);
          }
        }
      }
    });
  }

  function getId(topicName, propertyName) {
    const compoundName = topicName + propertyName;
    var id = propertyIds.indexOf(compoundName);
    if (id == -1) {
      propertyIds.push(compoundName);
      id = propertyIds.length - 1;
    }
    return id;
  }

  function refineValue(value, type, unit) {
    if (type === "numeric") {
      return refineNumericData(value, unit);
    } else if (type === "duration") {
      return refineDurationData(value, unit);
    } else if (type === "url" || type === "url-media") {
      return refineUrlData(value);
    }
    return value;
  }

  function refineNumericData(value, unit) {
    if (unit != null) {
      try {
        return Qty(value).to(unit).scalar;
      } catch (err) {
        return autoFixNumericData(value);
      }
    } else {
      return autoFixNumericData(value);
    }
  }

  function refineDurationData(value, unit) {
    var duration = moment.duration(value);
    if (duration._milliseconds != 0) {
      return duration.as(unit);
    } else {
      return autoFixDurationData(value);
    }
  }

  function refineUrlData(url) {
    var urlComponent = getUrlComponent(url);
    var protocol = urlComponent.protocol;
    if (protocol == null || protocol.length == 0
        || (protocol !== "http" && protocol !== "https")) {
      return "https://" + urlComponent.endpoint;
    }
    return urlComponent.url;
  }

  function autoFixNumericData(value) {
    var numericValue = getIntegerAndFraction(value)
    console.log("INFO: Applying an auto-fix for [numeric] data by converting " +
        "\"" + value + "\" to \"" + numericValue + "\"");
    return numericValue;
  }

  function autoFixDurationData(value) {
    var durationValue = getIntegerAndFraction(value);
    console.log("INFO: Applying an auto-fix for [duration] data by converting " +
        "\"" + value + "\" to \"" + durationValue + "\"");
    return durationValue;
  }

  function getIntegerAndFraction(text) {
    var RegExp = /(\d+[\/\d. ]*|\d)/;
    var match = RegExp.exec(text);
    return evalNumber(match[1].trim());
  }

  function getUrlComponent(url) {
    var RegExp = /^(.+):\/\/(.+)$/;
    var match = RegExp.exec(url);
    if (match != null) {
      return {
        url: match[0].trim(),
        protocol: match[1].trim(),
        endpoint: match[2].trim()
      }
    } else {
      return {
        url: url,
        protocol: "",
        endpoint: url.replace("//", "").trim()
      }
    }
  }

  function evalNumber(number) {
    var value = number;
    var y = number.split(' ');
    if (y.length > 1) {
      var z = y[1].split('/');
      value = +y[0] + (z[0] / z[1]);
    } else {
      var z = y[0].split('/');
      if (z.length > 1) {
        value = z[0] / z[1];
      }
    }
    return +value;
  }

  function findIndex(arr, key, value) {
    for(var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) return i;
    }
    return -1;
  }

  var isServiceFor = function(rawData) {
    return rawData.source === "Google Custom Search";
  }

  var add = function(rawData, userTopics=[]) {
    var topicNames = Object.keys(schemaorgVocab);
    if (userTopics.length != 0) {
      topicNames = userTopics;
    }
    var data = createNew(rawData);
    data = enrich(data, rawData.raw, topicNames);
    dataModel.push(data);
  }

  var get = function(url) {
    var index = findIndex(dataModel, "url", url);
    return dataModel[index];
  }

  var remove = function(url) {
    var index = findIndex(dataModel, "url", url);
    dataModel.splice(index, 1);
  }

  var clear = function() {
    dataModel.splice(0, dataModel.length);
  }

  return {
    dataModel: dataModel,
    isServiceFor: isServiceFor,
    add: add,
    get: get,
    remove: remove,
    clear: clear
  }
}]);
