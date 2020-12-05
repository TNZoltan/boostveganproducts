const {
  findTextBehindIndex,
  findTextAfterIndex,
  findAbsoluteTextAfterIndex,
  getNextWordIndex,
  indexes,
  removeURLParameters,
  removeDuplicates
} = require('../globalHelpers')

const isQualifying = () => true
const getPageLinks = (html) => {
  let i = 0
  const ulTagOpenIndex = html.indexOf('uiList')
  const ulTagCloseIndex = findTextAfterIndex(html, ulTagOpenIndex, '</ul')
  const component = html.substring(ulTagOpenIndex, ulTagCloseIndex)
  const linksOpenIndices = indexes(component, 'https:')
  return removeDuplicates(
    linksOpenIndices.map(openIndex =>
    component.substring(openIndex, findAbsoluteTextAfterIndex(component, openIndex, '"')+1)
  ).filter(str => !str.includes('scontent')).map(str => removeURLParameters(str))
  )
}

module.exports = {
  isQualifying,
  getPageLinks
}