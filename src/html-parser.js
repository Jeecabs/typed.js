/**
 * HTMLParser helps handle HTML tags or entities when contentType = 'html'
 */
class HTMLParser {
  /**
   * Move forward in `curString` to skip through an HTML tag or entity (e.g. <span> or &amp;).
   * @param {string} curString
   * @param {number} curStrPos
   * @param {Typed} self
   * @returns {number}
   */
  typeHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.charAt(curStrPos);
    if (curChar === '<' || curChar === '&') {
      let endTag = curChar === '<' ? '>' : ';';
      while (curString.charAt(curStrPos + 1) !== endTag) {
        curStrPos++;
        if (curStrPos + 1 > curString.length) break;
      }
      curStrPos++;
    }
    return curStrPos;
  }

  /**
   * Move backward in `curString` to skip through an HTML tag or entity if backspacing
   * @param {string} curString
   * @param {number} curStrPos
   * @param {Typed} self
   * @returns {number}
   */
  backSpaceHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.charAt(curStrPos);
    if (curChar === '>' || curChar === ';') {
      let startTag = curChar === '>' ? '<' : '&';
      while (curString.charAt(curStrPos - 1) !== startTag) {
        curStrPos--;
        if (curStrPos < 0) break;
      }
      curStrPos--;
    }
    return curStrPos;
  }
}

export const htmlParser = new HTMLParser();
