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
      image: rawData.image,
      thumbnail: rawData.thumbnail,
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
        structuredData[topicName] = getLastData(topicDataArray);
      }
    }
    return structuredData;
  }

  function getLastData(topicDataArray) {
    return topicDataArray[topicDataArray.length-1];
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
          try {
            var propertyAttributes = propertyAttributesArray[i];
            var propertyValue = structuredData[topicAttributes.name][propertyAttributes.name];
            if (propertyValue != null) {
              var property = createProperty(topicAttributes,
                propertyAttributes,
                propertyValue);
              data.properties.push(property);
            }
          } catch (e) {
            console.warn("WARN: Unable to store property "
                + topicAttributes.name + "." + propertyAttributes.name
                + " (Reason: " + e.message + ")");
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
    } else if (type === "url") {
      return refineUrlData(value);
    } else if (type === "url+image") {
      return refineImageUrlData(value);
    } else if (type === "url+video") {
      return refineVideoUrlData(value);
    } else if (type === "enum") {
      return refineEnumData(value);
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
    var component = parseUrl(url);
    var protocol = component.protocol;
    if (protocol !== "http:" && protocol !== "https:") {
      return "https://" + component.endpoint;
    }
    return component.url;
  }

  function refineImageUrlData(url, supported=["jpg", "jpeg", "png", "gif", "bmp"]) {
    url = refineUrlData(url);
    var component = parseUrl(url);
    var ext = getFileExtension(component.pathname);
    if (!include(supported, ext)) {
      throw new UnsupportedImageException(ext, supported);
    }
    return component.protocol + "//" + component.host + component.pathname;
  }

  function refineVideoUrlData(url, supported=["www.youtube.com", "www.dailymotion.com",
      "vimeo.com"]) {
    url = refineUrlData(url);
    var component = parseUrl(url);
    var hostname = component.hostname;
    if (!include(supported, hostname)) {
      throw new UnsupportedVieoProviderException(hostname, supported);
    }
    return component.protocol + "//" + component.host + component.pathname;
  }

  function refineEnumData(value) {
    return toTitleCase(value);
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

  function parseUrl(url) {
    var a = document.createElement("a");
    a.href = url;
    return {
      protocol: a.protocol,
      hostname: a.hostname,
      host: a.host,
      username: a.username,
      password: a.password,
      port: a.port,
      pathname: a.pathname,
      search: a.search,
      hash: a.hash,
      url: a.href,
      endpoint: url.replace(a.protocol+"//", "").trim()
    }
  }

  function getFileExtension(pathname) {
    return pathname.split('.').pop();
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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

  function include(arr, value) {
    return (arr.indexOf(value) != -1);
  }

  function UnsupportedImageException(ext, supported) {
    this.name = "UnsupportedImageException";
    this.message = "Image extension '" + ext + "' is not supported, only [" + supported + "]";
  }

  function UnsupportedVieoProviderException(provider, supported) {
    this.name = "UnsupportedVieoProviderException";
    this.message = "Video provider '" + provider + "' is not supported, only [" + supported + "]";
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
