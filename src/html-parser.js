class HTMLParser {
  /**
   * Type HTML chars if contentType is 'html'
   * @private
   */
  typeHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substr(curStrPos).charAt(0);
    if (curChar === '<' || curChar === '&') {
      let endTag = curChar === '<' ? '>' : ';';
      while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
        curStrPos++;
        if (curStrPos + 1 > curString.length) break;
      }
      curStrPos++;
    }
    return curStrPos;
  }

  /**
   * Backspace HTML chars if contentType is 'html'
   * @private
   */
  backSpaceHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substr(curStrPos).charAt(0);
    if (curChar === '>' || curChar === ';') {
      let startTag = curChar === '>' ? '<' : '&';
      while (curString.substr(curStrPos - 1).charAt(0) !== startTag) {
        curStrPos--;
        if (curStrPos < 0) break;
      }
      curStrPos--;
    }
    return curStrPos;
  }
}

export let htmlParser = new HTMLParser();
