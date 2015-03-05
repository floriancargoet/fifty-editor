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
};

module.exports = Editor;