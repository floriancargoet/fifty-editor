(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FiftyEditor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint browser: true */
var countWords = require('word-counter-fr');

function injectSpan(text, start, end) {
  return text.slice(0, start) + '<span class="word">' + text.slice(start, end + 1) + '</span>' + text.slice(end + 1);
}

function annotate(text, words) {
  // inject <span>s in text, corresponding to detected words
  var shift = 0;
  var increment = '<span class="word"></span>'.length;
  words.forEach(function (word) {
    text = injectSpan(text, shift + word.start, shift + word.end);
    shift += increment;
  });
  return text;
}

function on(el, event, fn) {
  if(window.addEventListener){
    el.addEventListener(event, fn, false);
  } else if(window.attachEvent) {
    el.attachEvent('on' + event, fn);
  } else {
    el['on' + event] = fn;
  }
}

function Editor(id) {
  this.id = id;
  this.editor = document.getElementById(id);
  this.editor.className += ' editor-root';
}

Editor.prototype.render = function() {
  this.createElements();
  this.bindEvents();
  this.load();
  this.updateCount();
};

Editor.prototype.createElements = function () {
  this.textarea = document.createElement('textarea');
  this.editor.appendChild(this.textarea);

  this.countEl = document.createElement('div');
  this.countEl.className = 'count';
  this.editor.appendChild(this.countEl);

  this.details = document.createElement('div');
  this.details.className = 'details';
  this.details.style.display = 'none';
  this.editor.appendChild(this.details);
};

Editor.prototype.bindEvents = function () {
  var self = this;
  on(this.textarea, 'keyup', function () {
    self.save();
    self.updateCount();
  });
  on(this.countEl, 'mouseover', function () {
    self.showDetails();
  });
  on(this.countEl, 'mouseout', function () {
    self.hideDetails();
  });
};

Editor.prototype.focus =function () {
  this.textarea.focus();
};

Editor.prototype.load = function () {
  var stored;
  if (window.localStorage) {
    stored = window.localStorage.getItem('editor-content_' + this.id);
  }
  this.textarea.value = stored || 'Votre fifty ici.';
};

Editor.prototype.save = function () {
  if (window.localStorage) {
    window.localStorage.setItem('editor-content_' + this.id, this.textarea.value);
  }
};

Editor.prototype.updateCount = function () {
  var result = countWords(this.textarea.value);

  var count = result.count;
  var text = String(count) + ' mot' + (count > 1 ? 's': '') + '.';
  if (count === 50) {
    text += ' Et c\'est un fifty !';
  }
  else if (45 < count && count < 55) {
    text += ' Presque...';
  }
  this.countEl.innerHTML = text;
};

Editor.prototype.showDetails = function () {
  var result = countWords(this.textarea.value);
  var annotated = annotate(this.textarea.value, result.words);
  this.details.innerHTML = annotated;
  this.details.style.display = 'block';
  this.textarea.style.visibility = 'hidden';
};

Editor.prototype.hideDetails = function () {
  this.details.style.display = 'none';
  this.textarea.style.visibility = 'visible';
  this.textarea.focus();
};

module.exports = Editor;
},{"word-counter-fr":2}],2:[function(require,module,exports){
var Token = require('./lib/Token');

function countWords (str) {
  /*
   * steps:
   *  1. split str into list of word-like tokens
   *  2. convert each token to a list of its words (mostly, only one word)
   */
  var tokens = Token.fromString(str);
  var words = [];
  tokens.forEach(function (token) {
    words.push.apply(words, token.toWords());
  });

  return {
    count : words.length,
    words : words
  };
}

module.exports = countWords;
},{"./lib/Token":3}],3:[function(require,module,exports){
var rules = require('./rules');

function Token(){
  this.type  = 'word';
  this.value = '';
  this.start = 0;
  this.end   = 0;
}

Token.prototype.toWords = function () {

  var self = this;
  var words = [];

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    var result = rule(self, words);
    if (result === rules.STOP) {
      return words;
    }
  }
  return words;

};

Token.prototype.open = function (index) {
  this.start = index;
};

Token.prototype.close = function (index) {
  this.end = index;
  this.clean();
};

Token.prototype.clean = function () {
  // TODO: fix indices
  var value = this.value;

  value = value.toLowerCase();
  // remove some symbols
  value = value.replace(/["«»\[\](){}|*+]/g, '');

  // replace similar symbols by a common one
  value = value.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
               .replace(/[’']/g, '’');

  // trim hyphens and apostrophes
  value = value.replace(/^[-’]+/, '')
               .replace(/[-’]+$/, '');

  this.value = value;
};

Token.prototype.makeWord = function (text, start, end) {
  if (start == null) start = this.start;
  if (end   == null) end   = this.end;
  return {
    value : text,
    start : start,
    end   : end
  };
};

var separatorRegex = /[\s.,;:!?\n]/;
Token.fromString = function (string) {
  var tokens = [];
  var currentToken;
  var i = 0, c;
  while (i < string.length) {
    c = string.charAt(i);
    if (separatorRegex.test(c)) {
      if (currentToken) {
        currentToken.close(i - 1);
        tokens.push(currentToken);
        currentToken = null;
      }
    } else {
      if (!currentToken) {
        currentToken = new Token();
        currentToken.open(i);
      }
      currentToken.value += c;
    }
    i++;
  }
  // close current token
  if (currentToken) {
      currentToken.close(i - 1);
      tokens.push(currentToken);
  }
  return tokens;
};

module.exports = Token;
},{"./rules":4}],4:[function(require,module,exports){
var STOP = {};

function split(string, separatorRe, callback) {
  var current, lastSeparator, c;
  var i = 0, l = string.length;
  while (i < l) {
    c = string.charAt(i);
    if(!separatorRe.test(c)) {
      if (!current) {
        current = '';
      }
      current += c;
      i++;
    } else {
      if (current) {
        callback(current, lastSeparator);
        current = null;
        lastSeparator = '';
      }
      lastSeparator += c;
      i++;
    }
  }
  if (current) {
    callback(current, lastSeparator);
  }
}

module.exports = [
  function empty(token) {
    if (!token.value) {
      return STOP;
    }
  },

  function euphonic_l(token, words) {
    if ('l’on' === token.value) {
      words.push(token.makeWord('on', token.start + 2));
      return STOP;
    }
  },

  function euphonic_t(token) {
    // the t is replace by an hyphen, creating a triple hyphen
    // so that the indices are kept
    token.value = token.value.replace(/-t-/g, '---');
  },

  function special_apostophes(token, words) {
    // apostrophes count as 2 words except special cases
    if ('aujourd’hui' === token.value) {
      words.push(token.makeWord(token.value));
      return STOP;
    }
  },

  function apostrophes_hyphens(token, words) {
    var shift = 0;
    split(token.value, /[’-]/, function (w, separatorBefore) {
      if (separatorBefore) {
        shift += separatorBefore.length;
      }
      var start = token.start + shift;
      var end = start + w.length - 1;
      shift += w.length;
      words.push(token.makeWord(w, start, end));
    });
    // TODO: special case like "socio-économique" (1 word) ("e-mail" == ?)
  }
];

module.exports.STOP = STOP;

},{}]},{},[1])(1)
});