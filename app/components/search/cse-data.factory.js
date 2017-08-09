'use strict';

angular.module('search')

.factory('CseDataService', [
  'SchemaorgVocab',

function(schemaOrgVocab) {
  var propertyIds = [];
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

  function createProperty(topicSchema, propertySchema, refinedValue) {
    return {
      id: getId(topicSchema.name, propertySchema.name),
      domain: {
        name: topicSchema.name,
        label: topicSchema.label
      },
      range: propertySchema.type,
      name: propertySchema.name,
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
      Object.keys(topicSchemas).forEach(topicName => {
        let topicSchema = topicSchemas[topicName];
        if (pagemap.hasOwnProperty(topicName)) {
          let topicDataArray = pagemap[topicName];
          let topicData = getLastData(topicDataArray);
          storeTopic(data, topicSchema);
          storeProperties(data, topicSchema, topicData);
          hasMarkup = true;
        }
      });
    }
    return {
      hasMarkup: hasMarkup,
      data: data
    };
  }

  function getLastData(topicDataArray) {
    return topicDataArray[topicDataArray.length-1];
  }

  function storeTopic(data, topicSchema) {
    data.topics.push(topicSchema.name);
  }

  function storeProperties(data, topicSchema, topicData) {
    topicSchema.properties.forEach(propertySchema => {
      let topicName = topicSchema.name;
      let propertyName = propertySchema.name;
      try {
        let propertyValue = topicData[propertyName];
        if (propertyValue != null) {
          let refinedValue = refineValue(propertyValue,
              propertySchema.type,
              propertySchema.unit);
          let property = createProperty(topicSchema, propertySchema, refinedValue);
          data.properties.push(property);
        }
      } catch (e) {
        console.warn("WARN: Unable to store property "
            + topicName + "." + propertyName
            + " (Reason: " + e.message + ")");
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

  function getTopicSchemas(topicNames) {
    let topicSchemas = {};
    if (topicNames.length != 0) {
      topicNames.forEach(topicName => {
        if (schemaOrgVocab[topicName] != null) {
          topicSchemas[topicName] = schemaOrgVocab[topicName];
        }
      });
    } else {
      topicSchemas = schemaOrgVocab;
    }
    return topicSchemas;
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
    } else {
      return {
        value: value,
        originalValue: value,
        hasWarning: false
      };
    }
  }

  function refineNumericData(value, unit) {
    let hasWarning = false;
    let number = -1;
    if (unit != null) {
      try {
        number = Qty(value).to(unit).scalar;
      } catch (err) {
        number = autoFixNumericData(value);
        hasWarning = true;
      }
    } else {
      number = autoFixNumericData(value);
      hasWarning = (number != value);
    }
    return {
      value: round(number, 1),
      originalValue: value,
      hasWarning: hasWarning
    };
  }

  function refineDurationData(value, unit) {
    let hasWarning = false;
    let number = -1;
    let duration = moment.duration(value);
    if (duration._milliseconds != 0) {
      number = duration.as(unit);
    } else { // invalid ISO8601 value
      if (value.charAt(0) !== "P") {
        let newValue = "P" + value;
        return refineDurationData(newValue, unit);
      } else { // give up
        number = autoFixDurationData(value);
        hasWarning = true;
      }
    }
    return {
      value: round(number, 0),
      originalValue: value,
      hasWarning: hasWarning
    };
  }

  function refineUrlData(url) {
    let hasWarning = false;
    let component = parseUrl(url);
    let protocol = component.protocol;
    if (protocol !== "http:" && protocol !== "https:") {
      hasWarning = true;
      return "https://" + component.endpoint;
    }
    return {
      value: component.url,
      originalValue: url,
      hasWarning: hasWarning
    };
  }

  function refineImageUrlData(url, supported=["jpg", "jpeg", "png", "gif", "bmp"]) {
    let urlData = refineUrlData(url);
    let hasWarning = urlData.hasWarning;
    let component = parseUrl(urlData.value);
    let ext = getFileExtension(component.pathname);
    if (!include(supported, ext)) {
      throw new UnsupportedImageException(ext, supported);
    }
    return {
      value: component.protocol + "//" + component.host + component.pathname,
      originalValue: url,
      hasWarning: hasWarning
    };
  }

  function refineVideoUrlData(url, supported=["www.youtube.com", "www.dailymotion.com",
      "vimeo.com"]) {
    let urlData = refineUrlData(url);
    let hasWarning = urlData.hasWarning;
    let component = parseUrl(urlData.value);
    let hostname = component.hostname;
    if (!include(supported, hostname)) {
      throw new UnsupportedVieoProviderException(hostname, supported);
    }
    return {
      value: component.protocol + "//" + component.host + component.pathname,
      originalValue: url,
      hasWarning: hasWarning
    };
  }

  function refineEnumData(value) {
    return {
      value: String.toTitleCase(value),
      originalValue: value,
      hasWarning: false
    };
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

  function round(number, digits) {
    if (!isInt(number)) {
      if (digits == 0) {
        number = number.toFixed();
      } else {
        number = number.toFixed(digits);
      }
    }
    return +number;
  }

  function isInt(number) {
    return parseInt(number) === number;
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

  var isServiceFor = function(searchResult) {
    return searchResult.source === "Google Custom Search";
  }

  var add = function(searchResult, topicNames=[]) {
    let topicSchemas = getTopicSchemas(topicNames);
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
    isServiceFor: isServiceFor,
    add: add,
    get: get,
    remove: remove,
    clear: clear
  }
}]);
