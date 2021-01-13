var today = new Date();
var y = today.getFullYear();
var m = today.getMonth() + 1;
var d = today.getDate();
var h = today.getHours();
var mi = today.getMinutes();
var s = today.getSeconds();

const getFilenameDate = () => {
  return y + "_" + m + "_" + d + "_" + h + "-" + mi + "-" + s;
}

const getDate = () => {
  return y + "-" + m + "-" + d + " at " + h + ":" + mi + ":" + s;
}

const removeTags = (text) => text.replace(/<\/?[^>]+(>|$)/g, "")

const findTextBehindIndex = (html, index, text) => html.substring(0, index).lastIndexOf(text)

const findTextAfterIndex = (html, index, text) => html.substring(index).indexOf(text)

const findAbsoluteTextAfterIndex = (html, index, text) => html.substring(0, index).length + html.substring(index).indexOf(text)

const getNextWordIndex = (html, index, word) => {
  const subsetRight = html.substring(index)
  return html.substring(0, index).length + subsetRight.indexOf(word)
}

function indexes(text, word) {
  if (!text) {
    return [];
  }
  if (!word) {
    return text.split('').map(function (_, i) { return i; });
  }
  var result = [];
  for (i = 0; i < text.length; ++i) {
    if (text.substring(i, i + word.length) == word) {
      result.push(i);
    }
  }
  return result;
}

const removeURLParameters = (url) => {
  if (url.indexOf('?') > 0) {
    return url.substring(0, url.indexOf('?'))
  } else return url
}

const removeDuplicates = (a) => {
  var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];

  return a.filter(function (item) {
    var type = typeof item;
    if (type in prims)
      return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
    else
      return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}

const titleCase = (string) => {
  var sentence = string.toLowerCase().split(" ");
  for (var i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(" ");
}

module.exports = {
  getFilenameDate,
  getDate,
  removeTags,
  findTextBehindIndex,
  findTextAfterIndex,
  findAbsoluteTextAfterIndex,
  getNextWordIndex,
  indexes,
  removeURLParameters,
  removeDuplicates,
  titleCase
}