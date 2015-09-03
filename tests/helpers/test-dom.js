/* jshint browser: true, node: true */
'use strict';

var jsdom = require('jsdom').jsdom;


module.exports = function (markup) {
  global.document = jsdom(markup || '');
  global.window = document.parentWindow;
};
