'use strict';

angular.module('search')

.service('DataCleaningService', [
  'SchemaOrgVocab',

function(SchemaOrgVocab) {
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

  function autoFixNumericData(value) {
    var numericValue = getIntegerAndFraction(value)
    console.log("INFO: Applying an auto-fix for [numeric] data by converting " +
        "\"" + value + "\" to \"" + numericValue + "\"");
    return numericValue;
  }

  function getIntegerAndFraction(text) {
    var RegExp = /(\d+[\/\d. ]*|\d)/;
    var match = RegExp.exec(text);
    return evalNumber(match[1].trim());
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

  function autoFixDurationData(value) {
    var durationValue = getIntegerAndFraction(value);
    console.log("INFO: Applying an auto-fix for [duration] data by converting " +
        "\"" + value + "\" to \"" + durationValue + "\"");
    return durationValue;
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

  function refineImageUrlData(url, supported=["jpg", "jpeg", "png", "gif", "bmp"]) {
    let urlData = refineUrlData(url);
    let hasWarning = urlData.hasWarning;
    let component = parseUrl(urlData.value);
    let ext = getFileExtension(component.pathname);
    if (!supported.includes(ext)) {
      throw new UnsupportedImageException(ext, supported);
    }
    return {
      value: component.protocol + "//" + component.host + component.pathname,
      originalValue: url,
      hasWarning: hasWarning
    };
  }

  function UnsupportedImageException(ext, supported) {
    this.name = "UnsupportedImageException";
    this.message = "Image extension '" + ext + "' is not supported, only [" + supported + "]";
  }

  function refineVideoUrlData(url, supported=["www.youtube.com", "www.dailymotion.com",
      "vimeo.com"]) {
    let urlData = refineUrlData(url);
    let hasWarning = urlData.hasWarning;
    let component = parseUrl(urlData.value);
    let hostname = component.hostname;
    if (!supported.includes(hostname)) {
      throw new UnsupportedVieoProviderException(hostname, supported);
    }
    return {
      value: component.protocol + "//" + component.host + component.pathname,
      originalValue: url,
      hasWarning: hasWarning
    };
  }

  function UnsupportedVieoProviderException(provider, supported) {
    this.name = "UnsupportedVieoProviderException";
    this.message = "Video provider '" + provider + "' is not supported, only [" + supported + "]";
  }

  function refineEnumData(value) {
    return {
      value: String.toTitleCase(value),
      originalValue: value,
      hasWarning: false
    };
  }

  function getFileExtension(pathname) {
    return pathname.split('.').pop();
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

  this.refine = function(value, type, unit) {
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
}]);
