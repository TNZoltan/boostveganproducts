const {
  findAbsoluteTextAfterIndex,
  indexes,
  removeURLParameters,
  removeDuplicates
} = require('../globalHelpers')

const isQualifying = () => true
const getPageLinks = (html) => {
  let i = 0
  const componentOpenIndex = html.indexOf('Related Pages')
  if (componentOpenIndex < 0) throw new Error('Component not found')
  const componentCloseIndex = findAbsoluteTextAfterIndex(html, componentOpenIndex, '</ul')
  const component = html.substring(componentOpenIndex, componentCloseIndex)
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