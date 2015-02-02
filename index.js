'use strict';

var jss = require('jss');

function useSheet(rules, options) {
  var refs = 0,
      sheet;

  function attach() {
    if (!sheet)
      sheet = jss.createStyleSheet(rules, options);

    sheet.attach();
  }

  function detach() {
    sheet.detach();
  }

  function ref() {
    if (refs === 0)
      attach();

    refs++;
    return sheet;
  }

  function deref() {
    refs--;

    if (refs === 0)
      detach();
  }

  var Mixin = {
    componentWillMount: function () {
      this.sheet = ref();
    },

    componentWillUnmount: function () {
      deref();
      this.sheet = null;
    },

    classSet : function (classNames) {
      return Object.keys(classNames)
        .filter(function(className) {
          return classNames[className];
        })
        .map(function(className) {

          // Allow non-jss classes to be set
          if (this.sheet.classes[className] === undefined) {
            return className;
          }

          return this.sheet.classes[className];
        }.bind(this)).join(' ');
    }
  };

  // Support React Hot Loader
  if (module.hot) {
    Mixin.componentWillUpdate = function () {
      if (this.sheet !== sheet) {
        this.sheet.detach();
        this.sheet = ref();
      }
    };
  }

  return Mixin;
}

module.exports = useSheet;
