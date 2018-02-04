(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var template = '<div class="ozbox">\r\n    <div class="ozbox__background"></div>\r\n\r\n    <div class="ozbox__nav">\r\n        <div class="ozbox__button ozbox__button--close">\r\n            <button class="ozbox-button">\r\n                <span class="ozbox-button__icon"></span>\r\n                <span class="ozbox-button__text">Close</span>\r\n            </button>\r\n        </div>\r\n        <div class="ozbox__button ozbox__button--previous">\r\n            <button class="ozbox-button">\r\n                <span class="ozbox-button__icon"></span>\r\n                <span class="ozbox-button__text">Previous</span>\r\n            </button>\r\n        </div>\r\n        <div class="ozbox__button ozbox__button--next">\r\n            <button class="ozbox-button">\r\n                <span class="ozbox-button__icon"></span>\r\n                <span class="ozbox-button__text">Next</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <div class="ozbox__container">\r\n        <div class="ozbox__window">\r\n            <div class="ozbox__frame">\r\n                <div class="ozbox__image"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n';

var OzBox = exports.OzBox = function () {
    function OzBox() {
        _classCallCheck(this, OzBox);

        this.appendTemplate();
        this.registerDomListener();
    }

    _createClass(OzBox, [{
        key: 'appendTemplate',
        value: function appendTemplate() {
            document.body.insertAdjacentHTML('beforeend', template);
        }
    }, {
        key: 'registerDomListener',
        value: function registerDomListener() {
            var _this = this;

            var mutationObserver = new MutationObserver(function () {
                _this.getElements();
                _this.binds();
            });

            mutationObserver.observe(document, {
                attributes: true,
                childList: true,
                characterData: false,
                subtree: true
            });
        }
    }, {
        key: 'getElements',
        value: function getElements() {
            this.elements = document.querySelectorAll('[data-ozbox]');
        }
    }, {
        key: 'binds',
        value: function binds() {
            for (var i = 0; i < self.elements.length; i++) {
                // Skip if event already defined
                if (self.elements[i].eventRegistered) {
                    continue;
                }

                // Add click event
                self.elements.addEventListener('click', function (event) {
                    event.preventDefault();
                });

                // Save var to indicate click event is present
                self.elements.eventRegistered = true;
            }
        }
    }]);

    return OzBox;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _module = require('./module');

new _module.OzBox(document.querySelectorAll('[data-ozbox]'));

},{"./module":1}]},{},[2]);
