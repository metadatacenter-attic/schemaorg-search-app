Object.filter = (obj, predicate) =>
  Object.keys(obj)
  .filter(key => predicate(obj[key]))
  .reduce((res, key) => Object.assign(res, {
    [key]: obj[key]
  }), {});

Object.size = (obj) => {
  return Object.keys(obj).length;
};

Object.hasOwnPropertyIgnoreCase = (obj, prop) => {
  return Object.keys(obj)
    .filter(v => {
      return v.toLowerCase() === prop.toLowerCase();
    }).length > 0;
};

Object.getIgnoreCase = (obj, prop) => {
  let result = null;
  for (key in obj) {
    if (key.toLowerCase() === prop.toLowerCase()) {
      result = obj[key];
      break;
    }
  }
  return result;
}

/*
 * Credit to David Gouch: http://individed.com/code/to-title-case/
 */
String.toTitleCase = (str) => {
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
  return str.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }
    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }
    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

String.replaceAll = (str, regex, replacement) => {
  return str.replace(new RegExp(regex, 'g'), replacement);
};
