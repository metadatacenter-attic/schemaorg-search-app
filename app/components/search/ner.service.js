'use strict';

angular.module('search')

.service('NerService', function() {
  const FREQUENCY_THRESHOLD = 2;

  function getTextData(data) {
    var textData = [];
    data.forEach(item => {
      for (var i = 0; i < item.properties.length; i++) {
        let property = item.properties[i];
        if (property.type === "text") {
          if (typeof(property.value) === 'object') {
            textData.push(property.value.join());
          } else {
            textData.push(property.value);
          }
        }
      }
    });
    return textData;
  }

  function getTopConcepts(concepts, top) {
    let frequencyTable = getFrequencyTable(concepts);
    let filteredFrequencyTable = Object.filter(frequencyTable,
        frequency => frequency > FREQUENCY_THRESHOLD);
    return Object.keys(filteredFrequencyTable)
      .sort(function(a,b) {
        return filteredFrequencyTable[b] - filteredFrequencyTable[a]
      })
      .slice(0, top);
  }

  function getFrequencyTable(arr) {
    return arr.reduce(function(p,c) {
      if (c in p) {
        p[c]++;
      } else {
        p[c] = 1;
      }
      return p;
    }, {});
  }

  this.findConcepts = function(searchResults, exclude=[], top=5) {
    let concepts = [];
    let textData = getTextData(searchResults);
    for (let i = 0; i < textData.length; i++) {
      let text = textData[i];
      let nouns = nlp(text).toLowerCase().nouns().data();
      nouns.forEach(noun => {
        var value = noun.singular;
        if (!exclude.includes(value)) {
          concepts.push(value);
        }
      })
    }
    return getTopConcepts(concepts, top);
  }
});
