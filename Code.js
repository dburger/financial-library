// Note that several of these functions perform HTML table extractions that are
// roughly equivalent to a composition of sheet functions like so:
//
// =VALUE(SUBSTITUTE(SUBSTITUTE(INDEX(IMPORTHTML("http://finviz.com/quote.ashx?t="&A3, "table", 8), 12, 6), "*", ""), "%", ""))
//
// That is they load HTML, target a specific table, and then index into the table.

/**
 * Returns a ticker's numeric data from finviz.com. If the (row, col)
 * contains a "-", 0.0 is returned.
 *
 * @param {string} ticker - The security's ticker.
 * @param {number} row - The row to return data from.
 * @param {number} col - The column to return data from.
 * @returns {number} - The parsed out numeric data.
 */
function finviz(ticker, row, col) {
  let html = FetchService.getContentText(`http://finviz.com/quote.ashx?t=${ticker}`);
  // Pull out just the table html.
  // class="snapshot-table2 screener_snapshot-table-body"
  html = FetchService.extractString(html, /<table[^>]*class="snapshot-table2[^>]*>/, "</table>");
  // Clean it up, so that it will parse.
  html = FetchService.removeAttributes(html);
  html = FetchService.deleteAll(html, "S&P", "<br>");
  // Finally, parse into XML doc and pull out the (row, col).
  const doc = XmlService.parse(html);
  const table = doc.getRootElement();
  const val = table.getChildren()[row].getChildren()[col].getValue();
  return val === "-" ? 0.0 : parseFloat(val);
}

/**
 * Returns a ticker's expense ratio from finance.yahoo.com.
 *
 * @param {string} ticker - The security's ticker.
 * @returns {number} - The corresponding expense ratio.
 */
function yahooExpenseRatio(ticker) {
  let html = FetchService.getContentText(`https://finance.yahoo.com/quote/${ticker}`);
  html = FetchService.extractString(html, /<td[^>]*data-test="EXPENSE_RATIO-value">/, '</td>');
  const doc = XmlService.parse(html);
  const td = doc.getRootElement();
  return parseFloat(td.getValue()) / 100.0;
}

/**
 * Returns a ticker's volume from finance.yahoo.com.
 *
 * @param {string} ticker - The security's ticker.
 * @returns {number} - The corresponding volume.
 */
function yahooVolume(ticker) {
  let html = FetchService.getContentText(`https://finance.yahoo.com/quote/${ticker}`);
  /*
  <fin-streamer data-symbol="GOOG" data-field="regularMarketVolume" data-trend="none" data-pricehint="2" data-dfield="longFmt" value="6,423,446" active=""><span class="e3b14781 f5a023e1">6,442,590</span></fin-streamer>
  */
  html = FetchService.extractString(html, `<fin-streamer data-symbol="${ticker}" data-field="regularMarketVolume"[^>]*>`, '</fin-streamer>');
  const doc = XmlService.parse(html);
  const finStreamer = doc.getRootElement();
  const attr = finStreamer.getAttribute("value");
  const value = attr.getValue();
  return parseInt(value.replaceAll(",", ""));
}

/**
 * Returns a ticker's average volume from finance.yahoo.com.
 *
 * @param {string} ticker - The security's ticker.
 * @returns {number} - The corresponding volume.
 */
function yahooAverageVolume(ticker) {
  let html = FetchService.getContentText(`https://finance.yahoo.com/quote/${ticker}`);
  // <td class="Ta(end) Fw(600) Lh(14px)" data-test="AVERAGE_VOLUME_3MONTH-value">22,120,288</td>
  html = FetchService.extractString(html, /<td[^>]*data-test="AVERAGE_VOLUME_3MONTH-value"[^>]*>/, '</td>');
  const doc = XmlService.parse(html);
  const td = doc.getRootElement();
  const value = td.getValue();
  return parseInt(value.replaceAll(",", ""));
}
