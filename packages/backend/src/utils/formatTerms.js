function formatTerms(terms) {
  return terms
    .map(element => ({
      ...element,
      spanish: element.spanish.trim(),
      english: element.english.trim()
    }))
    .map(element => {
      const { spanish, english } = element;

      if (
        (/^\s$/.test(spanish) || !spanish.length) &&
        (/^\s$/.test(english) || !english.length)
      ) {
        return null;
      } else if (/^\s$/.test(spanish) || spanish.length === 0) {
        return { ...element, spanish: '...' };
      } else if (/^\s$/.test(english) || english.length === 0) {
        return { ...element, english: '...' };
      } else {
        return element;
      }
    })
    .filter(element => element);
}

module.exports = formatTerms;
