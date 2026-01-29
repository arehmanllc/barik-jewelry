!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).EventEmitter3=e()}}(function(){return function i(s,f,c){function u(t,e){if(!f[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(a)return a(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=f[t]={exports:{}};s[t][0].call(o.exports,function(e){return u(s[t][1][e]||e)},o,o.exports,i,s,f,c)}return f[t].exports}for(var a="function"==typeof require&&require,e=0;e<c.length;e++)u(c[e]);return u}({1:[function(e,t,n){"use strict";var r=Object.prototype.hasOwnProperty,v="~";function o(){}function f(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function i(e,t,n,r,o){if("function"!=typeof n)throw new TypeError("The listener must be a function");var i=new f(n,r||e,o),s=v?v+t:t;return e._events[s]?e._events[s].fn?e._events[s]=[e._events[s],i]:e._events[s].push(i):(e._events[s]=i,e._eventsCount++),e}function u(e,t){0==--e._eventsCount?e._events=new o:delete e._events[t]}function s(){this._events=new o,this._eventsCount=0}Object.create&&(o.prototype=Object.create(null),(new o).__proto__||(v=!1)),s.prototype.eventNames=function(){var e,t,n=[];if(0===this._eventsCount)return n;for(t in e=this._events)r.call(e,t)&&n.push(v?t.slice(1):t);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(e)):n},s.prototype.listeners=function(e){var t=v?v+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var r=0,o=n.length,i=new Array(o);r<o;r++)i[r]=n[r].fn;return i},s.prototype.listenerCount=function(e){var t=v?v+e:e,n=this._events[t];return n?n.fn?1:n.length:0},s.prototype.emit=function(e,t,n,r,o,i){var s=v?v+e:e;if(!this._events[s])return!1;var f,c,u=this._events[s],a=arguments.length;if(u.fn){switch(u.once&&this.removeListener(e,u.fn,void 0,!0),a){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,t),!0;case 3:return u.fn.call(u.context,t,n),!0;case 4:return u.fn.call(u.context,t,n,r),!0;case 5:return u.fn.call(u.context,t,n,r,o),!0;case 6:return u.fn.call(u.context,t,n,r,o,i),!0}for(c=1,f=new Array(a-1);c<a;c++)f[c-1]=arguments[c];u.fn.apply(u.context,f)}else{var l,p=u.length;for(c=0;c<p;c++)switch(u[c].once&&this.removeListener(e,u[c].fn,void 0,!0),a){case 1:u[c].fn.call(u[c].context);break;case 2:u[c].fn.call(u[c].context,t);break;case 3:u[c].fn.call(u[c].context,t,n);break;case 4:u[c].fn.call(u[c].context,t,n,r);break;default:if(!f)for(l=1,f=new Array(a-1);l<a;l++)f[l-1]=arguments[l];u[c].fn.apply(u[c].context,f)}}return!0},s.prototype.on=function(e,t,n){return i(this,e,t,n,!1)},s.prototype.once=function(e,t,n){return i(this,e,t,n,!0)},s.prototype.removeListener=function(e,t,n,r){var o=v?v+e:e;if(!this._events[o])return this;if(!t)return u(this,o),this;var i=this._events[o];if(i.fn)i.fn!==t||r&&!i.once||n&&i.context!==n||u(this,o);else{for(var s=0,f=[],c=i.length;s<c;s++)(i[s].fn!==t||r&&!i[s].once||n&&i[s].context!==n)&&f.push(i[s]);f.length?this._events[o]=1===f.length?f[0]:f:u(this,o)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=v?v+e:e,this._events[t]&&u(this,t)):(this._events=new o,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=v,s.EventEmitter=s,void 0!==t&&(t.exports=s)},{}]},{},[1])(1)});

window.theme = window.theme || {};
window.themeInfo = {name: "Forge"};

var Events = new EventEmitter3();
Events.trigger = Events.emit; // trigger alias

/*============================================================================
 Underground Functions
==============================================================================*/
window.WAU = window.WAU || {};

WAU.Popover = (() => {
  return {
    show: (name) => {
      if (!name) {
        console.log('Error. Must provide a name.');
        return false;
      }
      document.getElementById(name)?.showPopover();
    },
    hide: (name) => {
      if (!name) {
        console.log('Error. Must provide a name.');
        return false;
      }
      document.getElementById(name)?.hidePopover();
    }
  }
})();

WAU.Slideout = (() => {
  return {
    _openByName(id) {
      WAU.Popover.show(id);
    },
    _closeByName(id) {
      WAU.Popover.hide(id);
    }
  }
})();

WAU.Modal = (() => {
  return {
    _openByName(id) {
      WAU.Popover.show(id);
    },
    _closeByName(id) {
      WAU.Popover.hide(id);
    }
  }
})();

/* ---- WAU HELPERS - v1.0 ---- */
WAU.Helpers = (function() {

  function isTouch() {
    let touchDevice = false;
    touchDevice = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
    return touchDevice;
  }

  function isMobile() {
    let mobileDevice = false;
    mobileDevice = window.matchMedia('(max-width: 967px)').matches;
    return mobileDevice;
  }

  function isDevice() {
    let mobileDevice = false;
    mobileDevice = window.matchMedia('(max-width: 1023px)').matches;
    return mobileDevice;
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function makeSticky(amountToScroll, elementClass, elementHeight) {
    const clearElement = document.querySelector(".js-desktop-clear-element"),
          stickyElement = document.querySelector(elementClass);

    if ( clearElement.classList.contains('over-content--true') && window.matchMedia('(min-width: 968px)').matches ) {
      height = "0px";
    } else {
      height = elementHeight  + "px";
      clearElement.style.paddingTop = `${height}`;
    }

    if (window.pageYOffset > amountToScroll) {
      stickyElement.classList.add('sticky--active');
    } else {
      stickyElement.classList.remove('sticky--active');
      clearElement.style.paddingTop = `0`;
    }
  }

  function showHide(show, hide) {
    var show = document.getElementById(show);
    show.classList.remove("hide");
    show.classList.add("show");
    show.style.display = 'block';

    var hide = document.getElementById(hide);
    hide.classList.remove("show");
    hide.classList.add("hide");
    hide.style.display='none';
  }

  function Toggle(id) {
    var element = document.getElementById(id);
    if ( element.classList.contains('animate-hide') ) {
      element.classList.remove("animate-hide", "fadeOut");
      element.classList.add("animate-show", "fadeIn");
      element.style.visibility = "visible";
    } else {
    element.classList.remove("animate-show", "fadeIn");
      element.classList.add("animate-hide", "fadeOut");
      element.style.visibility = "hidden";
    }
  }

  function toggleClass(id, className) {
    var element = document.getElementById(id);
    if (!element) return false;
    if ( element.classList.contains(className) ) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }

  function Accordion(container, tlink, submenu) {

    let accorContent = container.querySelector(submenu);

    if ( !container.querySelector(tlink) ) return false;

    container.querySelector(tlink).addEventListener('click', function(event) {
      event.preventDefault();

      // Toggle class on label and update a11y
      if ( this.classList.contains('closed') ) {
        this.classList.remove('closed');
        this.parentElement.classList.remove('closed');
        this.setAttribute('aria-expanded', 'true');
      } else {
        this.classList.add('closed');
        this.parentElement.classList.add('closed');
        this.setAttribute('aria-expanded', 'false');
      }

      // Show content
      if ( accorContent.classList.contains('closed') ) {
        accorContent.classList.remove("closed");
        accorContent.style.display = "block";
      } else {
        accorContent.classList.add("closed");
        accorContent.style.display = "none";
      }

    });
  }

  function fadeToggle(el, display) {
    var style = display || "block";

    if (el.style.display === 'none') {
      el.style.opacity = 0;
      el.style.display = display || "block";

      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();

    } else if (el.style.display === style) {
      el.style.opacity = 1;

      (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }
  }

  function fadeOut(el){
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;

  }

  function smoothScrollTo(endX, endY, duration) {
     let startX = window.scrollX || window.pageXOffset,
     startY = window.scrollY || window.pageYOffset,
     distanceX = endX - startX,
     distanceY = endY - startY,
     startTime = new Date().getTime();
     // Easing function
     let easeInOutQuart = function(time, from, distance, duration) {
         if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
         return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
     };
     let timer = window.setInterval(function() {
         let time = new Date().getTime() - startTime,
         newX = easeInOutQuart(time, startX, distanceX, duration),
         newY = easeInOutQuart(time, startY, distanceY, duration);
         if (time >= duration) {
             window.clearInterval(timer);
         }
         window.scrollTo(newX, newY);
     }, 1000 / 60); // 60 fps
  }

  function wrapIframe(options) {
    options.iframes.forEach(function(iframe) {
      var wrapper = document.createElement('div');
      wrapper.classList.add(options.iframeWrapperClass);

      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);

      iframe.src = iframe.src;
    });
  }

  function wrapTable(options) {
   options.tables.forEach(function(table) {
     var wrapper = document.createElement('div');
     wrapper.classList.add(options.tableWrapperClass);

     table.parentNode.insertBefore(wrapper, table);
     wrapper.appendChild(table);
   });
  }

  function isOutOfBounds(elem) {
    if (!elem) {
      console.log('Error. Must provide element to check out of bounds');
      return false;
    }

    // Get element's bounding.
    var bounding = elem.getBoundingClientRect();

    // Check if it's out of the viewport on each side
    var out = {};
    out.left = bounding.left < 0;
    out.leftAmount = bounding.left;
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.rightAmount = bounding.right - (window.innerWidth || document.documentElement.clientWidth);

    return out;
  };

  function scriptLoader() {
      /**
       * Promise-based script loader
       * @param {string} url
       * @param {object=} attr
       * @returns {Promise}
       */
      const loader = (url, attr) => new Promise((resolve, reject) => {
        const script = window.document.createElement('script');
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';

        attr = attr || {};

        for (const attrName in attr) {
          script[attrName] = attr[attrName];
        }

        script.addEventListener('load', () => {
          resolve(script);
        }, false);

        script.addEventListener('error', () => {
          reject(script);
        }, false);

        function scriptExists(url) {
          return document.querySelectorAll(`script[src="${url}"]`).length > 0;
        }

        if ( !scriptExists(url) ) {
          window.document.head.appendChild(script);
        } else {
          resolve(script);
        }

      });

      /**
       * Loads scripts asynchronously
       * @param {string|string[]} urls
       * @param {object=} attr Other script tag attributes
       * @returns {Promise}
       */
      this.load = (urls, attr) => {
        if (!Array.isArray(urls)) {
          urls = [urls];
        }

        return Promise.all(urls.map(url => loader(url, attr)));
      }

      /**
       * Loads scripts asynchronously. It supports multiple url arguments, so each one will be loaded right after the
       * previous is loaded. This is a way of chaining dependency loading.
       *
       * @param {string|string[]} urls, ...
       * @returns {Promise}
       */
      this.loadChain = function (urls) {
        const args = Array.isArray(arguments) ? arguments : Array.prototype.slice.call(arguments);
        const p = this.require(args.shift());
        const self = this;
        return args.length ? p.then(() => {
          self.requireChain(...args);
        }) : p;
      }
  }

  function scriptExists(url) {
    return document.querySelectorAll(`script[src="${url}"]`).length > 0;
  }

  function isElementPastEdge(element) {
    const bounding = element.getBoundingClientRect(),
          l = bounding.left,
          w = bounding.width,
          docH = document.documentElement.clientHeight,
          docW = document.documentElement.clientWidth;

    return (l + w >= docW);
  }

  function formatMoney(cents, format) {
    const moneyFormat = jsFormat.money;

    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;

    function formatWithDelimiters(
      number,
      precision = 2,
      thousands = ',',
      decimal = '.'
    ) {
      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        `$1${thousands}`
      );
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  /*
   * @description Helper method for determining delay time, returns 0 when prefers reduced motions is enabled.
   */
  function reduceMotionDelay(delayTime = 100) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : delayTime;
  }

  return {
    isTouch,
    isMobile,
    isDevice,
    debounce,
    makeSticky,
    showHide,
    Toggle,
    toggleClass,
    Accordion,
    fadeToggle,
    fadeOut,
    fadeIn,
    getScrollbarWidth,
    smoothScrollTo,
    wrapIframe,
    wrapTable,
    isOutOfBounds,
    scriptLoader,
    scriptExists,
    isElementPastEdge,
    formatMoney,
    reduceMotionDelay
  };
})();

/* ---- WAU A11Y HELPERS - v1.0 ---- */
WAU.a11yHelpers = (function() {
  let alreadySetUpKeyEvents = false;

  /*
   * @description - Sets up the aria-expanded property to true and false on hover.
   */
  function setUpAriaExpansion() {
    const ariaExpandEls = document.querySelectorAll('.js-aria-expand');

    ariaExpandEls.forEach(function(ariaExpandEl) {
      ariaExpandEl.addEventListener('mouseover', function(event) {
        ariaExpandEl.setAttribute('aria-expanded', 'true');
      });

      ariaExpandEl.addEventListener('mouseout', function(event) {
        ariaExpandEl.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setUpAriaExpansionClick() {
    const ariaExpandEls = document.querySelectorAll('.js-aria-expand');
    ariaExpandEls.forEach(function(ariaExpandEl) {
      ariaExpandEl.addEventListener('click', function(event) {
        if (ariaExpandEl.getAttribute('aria-expanded') == 'true') {
          ariaExpandEl.setAttribute('aria-expanded', 'false');
        } else {
          ariaExpandEl.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /*
   * @description - Takes a parent element and focuses on the next focusable element inside of there.
   */
  function focusOnElement(parent) {
    var focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';

    const elementToFocusOn = parent.querySelector(focussableElements);

    if (elementToFocusOn) {
      elementToFocusOn.focus();
    }

  }

  function findFocusableElement(parent, element, direction) {
    const focusableElementSelectors = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    const focusableElements = parent.querySelectorAll(focusableElementSelectors);
    const numOfFocusableElements = focusableElements.length;

    var elementIndex = 0;

    for (let i = 0; i < focusableElements.length; i += 1) {
      let currentElement = focusableElements[i];

      if (currentElement === element) {
        elementIndex = i;
      }
    }

    if (direction === 'next') {
      if (elementIndex === (numOfFocusableElements - 1)) {
        return focusableElements[0];
      } else {
        return focusableElements[elementIndex + 1];
      }
    }

    if (direction === 'prev') {
      if (elementIndex === 0) {
        return focusableElements[numOfFocusableElements - 1];
      } else {
        return focusableElements[elementIndex - 1];
      }
    }
  }

  /*
   * @description - Takes a parent and a dom node and returns the next element that is focusable that is not the current element.
   * @param parent:DOMNode
   * @param element:DOMNode
   * @return DOMNode
   */
  function findNextFocusableElement(parent, element) {
    return findFocusableElement(parent, element, 'next');
  }

  function findPreviousFocusableElement(parent, element) {
    return findFocusableElement(parent, element, 'prev');
  }

  /*
   * @description - Enables accessible keyboard navigation throughout the navigation menus.
   */
  function setUpAccessibleNavigationMenus() {

    function closeDropdownMenus() {
      const activeMenuItems = document.querySelectorAll('.navigation__menuitem--active');
      activeMenuItems.forEach(function(activeMenuItem) {
        activeMenuItem.classList.remove('navigation__menuitem--active');
        activeMenuItem.setAttribute('aria-expanded', 'false');
      });
    }

    function closeNestedDropdownMenus() {
      //remove the class that makes the dropdown show... the active class
      const nestedDropdowns = document.querySelectorAll(".js-menuitem-with-nested-dropdown");

      nestedDropdowns.forEach(function(nestedDropdown) {
        nestedDropdown.classList.remove("dropdown__menuitem--active");
        nestedDropdown.setAttribute('aria-expanded', 'false');
      });

    }

    function addEdgeToDropdown(dropdown) {
      setTimeout(function() {
        if (WAU.Helpers.isElementPastEdge(dropdown)) {
          dropdown.classList.add("dropdown--edge");
        } else {
          dropdown.classList.remove("dropdown--edge");
        }
      }, 0);
    }

    if (!alreadySetUpKeyEvents) {
      document.addEventListener('keyup', function(event) {
        if (event.key === 'Escape') {
          const openNestedDropdownMenus = document.querySelectorAll(".dropdown__menuitem--active"),
            openDropdownMenus = document.querySelectorAll(".navigation__menuitem--active");

          event.preventDefault();

          if (openNestedDropdownMenus.length >= 1) {
            closeNestedDropdownMenus();
            return;
          }

          if (openDropdownMenus.length >= 1) {
            closeDropdownMenus();
            return;
          }

        }
      });
    }

    function closeActiveItemsWithSameClass(name) {

     // Bail if no class name passed in.
     if (!name) return false;

     // Get the open elements.
     let openMenuItem = document.querySelectorAll(`.${name}`);

      // Check that we have any "active" menu items with the same name.
      if (openMenuItem.length > 0) {

         // Loop through each menu item.
         openMenuItem.forEach((menuItem) => {

           // We use the parent node because the nested anchor element
           // is what is focused on, no the "li" element.
           if (menuItem !== document.activeElement.parentNode) {
             menuItem.classList.remove(name);
           }
         });
      }
    };

    if (!alreadySetUpKeyEvents) {
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {

          if (document.activeElement.classList.contains("js-open-dropdown-on-key") || document.activeElement.parentNode.classList.contains("js-menuitem-with-nested-dropdown")) {
            event.stopPropagation();
            event.preventDefault();
          }

          if (document.activeElement.parentNode.classList.contains("navigation__menuitem--active")) {
            closeDropdownMenus();
            return;
          }

          if (document.activeElement.parentNode.classList.contains("dropdown__menuitem--active")) {
            closeNestedDropdownMenus();
            return;
          }

          if (document.activeElement.parentNode.classList.contains("js-first-level")) {
            closeDropdownMenus();
          }

          if (document.activeElement.classList.contains("js-open-dropdown-on-key")) {
            document.activeElement.parentNode.classList.add("navigation__menuitem--active"); // Show the menu by adding the appropriate class.
            closeActiveItemsWithSameClass('navigation__menuitem--active');
            return;
          }

          if (document.activeElement.parentNode.classList.contains("js-menuitem-with-nested-dropdown")) {
            document.activeElement.parentNode.classList.add("dropdown__menuitem--active");
            closeActiveItemsWithSameClass('dropdown__menuitem--active');
            addEdgeToDropdown(document.activeElement.parentNode);
            return;
          }

        }
      });
    }

    alreadySetUpKeyEvents = true;

  }

  return {
    setUpAriaExpansion: setUpAriaExpansion,
    setUpAriaExpansionClick: setUpAriaExpansionClick,
    setUpAccessibleNavigationMenus: setUpAccessibleNavigationMenus,
    focusOnElement: focusOnElement
  }
}());

/* ---- WAU SECTIONS - v1.0 ---- */
WAU.Sections = (function() {
	document.querySelectorAll('[data-section-type]').forEach(function(container) {

    // Pre-load vendor before section script
    if (container.hasAttribute('data-preload-vendor')) {
      const loader = new WAU.Helpers.scriptLoader();
      loader.load([container.dataset.preloadVendor]).then(({length}) => {
        // console.log(container.dataset.sectionType + ' script loaded');
      });
    }

    // Load these containers instantly
    if (container.hasAttribute('data-asset-preload')) {
      loadAssets(container);
      if (container.hasAttribute('data-section-loaded') ) {
        container.setAttribute('data-section-loaded', 'true');
      }
    }

		let callback = (entries, observer) => {
			entries.forEach(entry => {
				if ( entry.isIntersecting ) {
					loadAssets(container);
					if (container.hasAttribute('data-section-loaded') ) {
						container.setAttribute('data-section-loaded', 'true');
					}
				}
			});
		};

		let observer = new IntersectionObserver(callback);
		observer.observe(container);

		function loadAssets (container) {
			// Load section assets
			if ( container.dataset.assetUrl ) {
				const loader = new WAU.Helpers.scriptLoader();
				loader.load([container.dataset.assetUrl]).then(({length}) => {
					// console.log(container.dataset.sectionType + ' script loaded');
				});
			}
		}

		document.addEventListener('shopify:section:select', function(event){
			if ( container.dataset.sectionId == event.detail.sectionId ) {
				if (container.hasAttribute('data-section-loaded') ) {
					event.target.classList.add('section--reloaded');
				}
			}
		});
		document.addEventListener('shopify:section:load', function(event){
      loadAssets(event.target.querySelector('[data-section-type]'));
			event.target.classList.add('section--reloaded');
		});

	});
})();

/* ---- WAU PRODUCT GRID VIDEO - v1.0 ---- */
WAU.ProductGridVideo = {
  init: function init() {
    document.querySelectorAll('.js-bg-video-wrapper').forEach(function(element) {
      WAU.ProductGridVideo.initVideo(element);
    });
  },
  initVideo: function initVideo(element) {
    var selectorId = element.dataset.productId,
      videoUrl = element.dataset.videoUrl,
      selector = '.js-bg-video-' + selectorId;

    var options = {
      mp4: videoUrl,
    }
    var instance = new vidbg(selector, options);

    var vid = selector + ' video',
      vid = document.querySelector(vid);
    vid.muted = true;

    document.addEventListener("shopify:section:unload", function(event) {
      WAU.ProductGridVideo.destroyVideo(instance);
    });
    document.addEventListener("shopify:section:select", function(event) {
      WAU.ProductGridVideo.reinitVideo(selector, options);
    });

  },
  destroyVideo: function destroyVideo(element) {
    element.destroy();
  },
  reinitVideo: function reinitVideo(selector, options) {
    var instance = new vidbg(selector, options);
    return instance;
  }
}

/* ---- WAU LOCALIZATION - v1.0 ---- */
WAU.LocalizationForm = function(container) {
  function init() {
    container.querySelector('button').addEventListener('click', openSelector);
    container.querySelector('button').addEventListener('focusout', closeSelector);
    container.addEventListener('keyup', onContainerKeyUp);
    container.querySelectorAll('a').forEach(item => item.addEventListener('click', onItemClick));
  }

  function hidePanel() {
    container.querySelector('button').setAttribute('aria-expanded', 'false');
    container.querySelector('.disclosure__list').setAttribute('hidden', true);
  }

  function onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    hidePanel();
    container.querySelector('button').focus();
  }

  function onItemClick(event) {
    event.preventDefault();
    const form = container.querySelector('form');
    container.querySelector('input[name="locale_code"], input[name="country_code"]').value = event.currentTarget.dataset.value;
    if (form) form.submit();
  }

  function openSelector() {
    container.querySelector('button').focus();
    container.querySelector('.disclosure__list').toggleAttribute('hidden');
    container.querySelector('button').setAttribute('aria-expanded', (container.querySelector('button').getAttribute('aria-expanded') === 'false').toString());
  }

  function closeSelector(event) {
    const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
    if (event.relatedTarget === null || shouldClose) {
      hidePanel();
    }
  }

  return init();
}

/*============================================================================
 Shopify Common
==============================================================================*/

if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

/*============================================================================
  Global Events & Helpers
==============================================================================*/
(function WAUInits() {

  document.querySelectorAll('[data-localization-form]').forEach(function(container){
    WAU.LocalizationForm(container);
  });

	document.addEventListener('DOMContentLoaded', function() {
		if ( document.querySelectorAll('.js-bg-video-wrapper') ) {
			WAU.ProductGridVideo.init();
		}
	});

	document.addEventListener('shopify:section:select', function(event){
		if ( document.querySelectorAll('.js-bg-video-wrapper') ) {
			WAU.ProductGridVideo.init();
		}
    if ( event.target.querySelector('[data-localization-form]') ) {
      WAU.LocalizationForm(event.target.querySelector('[data-localization-form]'));
    }
	});

  document.addEventListener('shopify:section:load', function(event){
    if ( event.target.querySelector('[data-localization-form]') ) {
      WAU.LocalizationForm(event.target.querySelector('[data-localization-form]'));
    }
	});

  if (window.Shopify && window.Shopify.theme && navigator.sendBeacon && window.Shopify.designMode) {
    if (!sessionStorage.getItem('beaconSent')) {
      try {
        const url = 'https://api.weareunderground.com/beacon';

        const themeName = Shopify.theme?.name || 'Unknown';
        const themeVersion = Shopify.theme?.schema_version || 'Unknown';

        console.log("Theme Name:", themeName, "Theme Version:", themeVersion);

        const params = new URLSearchParams({
          shop: window.Shopify.shop,
          themeName: `${themeName} v${themeVersion}`,
          role: window.Shopify.theme.role,
          route: window.location.pathname,
          themeId: window.Shopify.theme.id,
          themeStoreId: window.Shopify.theme.theme_store_id || 0,
          isThemeEditor: !!window.Shopify.designMode
        });

        if (!navigator.sendBeacon(url, params)) {
          fetch(url, { method: 'POST', body: params }).catch(() => {});
        }
        sessionStorage.setItem('beaconSent', 'true');
      } catch (error) {
        // errors will be silently ignored.
      }
    }
  }

})();

(function helperRteFormat() {
  WAU.Helpers.wrapIframe({
		iframes: document.querySelectorAll('.rte iframe[src*="youtube.com/embed"]'),
    iframeWrapperClass: 'video-wrapper'
  });

	WAU.Helpers.wrapIframe({
		iframes: document.querySelectorAll('.rte iframe[src*="player.vimeo"]'),
		iframeWrapperClass: 'video-wrapper'
	});

  WAU.Helpers.wrapTable({
		tables: document.querySelectorAll('.rte table'),
    tableWrapperClass: 'table-wrapper'
  });
})();

(function helperThemeVersion() {
  /* Log Theme Version */
  log = function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(console);
      return Function.prototype.bind.apply(console.log, args);
  }

  log("Forge Version 5.1.2 by Underground", {bar: 1})();
})();

(function formValidation() {
	/* Form Validation */
	var validateForm = function(submitEvent) {
	  if (!submitEvent.target.checkValidity()) {
	    submitEvent.preventDefault();
	    submitEvent.stopImmediatePropagation();
	    submitEvent.stopPropagation();

	    var form = submitEvent.target,
	        elements = form.elements;

	    for (var index = 0, len = elements.length; index < len; index++) {
	      var element = elements[index];
	      if (element.willValidate === true && element.validity.valid !== true) {
	        var message = element.validationMessage,
	            parent  = element.parentNode,
	            div     = document.createElement('small');

	      div.appendChild(document.createTextNode(message));
	       div.classList.add('validation-message');

	       parent.insertBefore(div, element.nextSibling);

	       element.focus();
	       break;
	     }
	    }
	  } else {
	    return true;
	  }
	};

	document.addEventListener('DOMContentLoaded', function() {
	  var forms = document.querySelectorAll('form:not(#mailing-popup-form)');

	  for (var index = forms.length - 1; index >= 0; index--) {
	    var form = forms[index];

	    form.noValidate = true;
	    form.addEventListener('submit', validateForm);
	  }
	});
})();

/**
 * @description: Overrides anchor elements when clicked so that a slideout or modal is opened instead of redirecting to the cart page. This way when JavaScript is disabled we can still go to the cart page.
 */
class WAUPopoverOpener extends HTMLElement {
  constructor() {
    super();
    const link  = this.querySelector('a');
    if (!link) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const popover = document.querySelector(this.getAttribute('data-popover'));
      if (popover) popover.showPopover();
    });
  }
}

customElements.define('wau-popover-opener', WAUPopoverOpener);

/**
 * WAU Popover Polyfill
 * @description This script checks if the Popover API is supported in the browser. If not, it loads a polyfill script dynamically.
 */
class WAUPopoverLoader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.path = this.getAttribute('data-asset-url');
    this.cssClass = this.getAttribute('data-css-class');

    if (!this.path) {
      console.error('No asset URL provided for the popover polyfill.');
      return;
    }

    if (!this.cssClass) {
      console.error('No class name provided for the popover polyfill.');
      return;
    }

    this.loadPopoverPolyfill(this.path, this.cssClass);
  }

  loadPopoverPolyfill(path, cssClass = 'popover') {
    if (!('popover' in HTMLElement.prototype)) {
      const polyfillScript = document.createElement('script');
      polyfillScript.src = path;
      document.head.appendChild(polyfillScript);

      polyfillScript.onload = () => {
        console.log('Popover API polyfill loaded.');
      };

      polyfillScript.onerror = () => {
        console.error('Failed to load Popover API polyfill.');
      };
      document.documentElement.classList.add(`no-${cssClass}`);
    } else {
      console.log('Popover API is natively supported.');
      document.documentElement.classList.add(`${cssClass}`);
    }
  }
}

customElements.define('wau-popover-loader', WAUPopoverLoader);

theme.Accordion = function(container) {

  document.addEventListener('shopify:block:select', function({target}){
    if (target.tagName !== 'DETAILS') return;
    target.open = true;
  });

  document.addEventListener('shopify:block:deselect', function({target}){

    const { defaultOpenAccordion } = target.dataset;
    const openByDefault = defaultOpenAccordion === 'true';

    if (target.tagName !== 'DETAILS' || openByDefault) return;

    target.open = false;
  });
}

theme.Accordion();

if (!customElements.get("wau-shipping-calculator")) {
  customElements.define(
    "wau-shipping-calculator",
    class extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        const allInstances = document.querySelectorAll("wau-shipping-calculator");
        const instanceIndex = Array.from(allInstances).indexOf(this);
        this._instance = instanceIndex;
        this.update()
      }

      update() {

        const provinceContainer = this.querySelector(
          "#address_province_container"
        );

        if (provinceContainer) {
          this.setIdWithInstanceNumber(provinceContainer);
        }

        const addressCountry = this.querySelector("#address_country");

        if (addressCountry) {
          this.setIdWithInstanceNumber(addressCountry);
        }

        const address_province = this.querySelector("#address_province");

        if (address_province) {
          this.setIdWithInstanceNumber(address_province);
        }

        this.init();
      }

      setIdWithInstanceNumber(element) {
        element.setAttribute(
          "id",
          `${element.id}-${this._instance}`
        );
      }

      init() {
        var config = document.getElementById("cart-config");
        if (!config) return false;
        var config = JSON.parse(config.innerHTML || "{}");

        var selectors = {
          container: ".js-shipping-calc-wrapper",
          submitButton: ".js-shipping-calc-submit",
          addressZip: ".js-shipping-calc-address-zip",
          addressCountry: ".js-shipping-calc-address-country",
          addressProvince: ".js-shipping-calc-address-province",
          addressProvinceLabel: ".js-shipping-calc-address-province-label",
          response: ".js-shipping-calc-response",
        };

        let container = this.querySelector(selectors.container);

        // Initialize observer on shipping address.
        new Shopify.CountryProvinceSelector(
          `address_country-${this._instance}`,
          `address_province-${this._instance}`,
          {
            hideElement: `address_province_container-${this._instance}`,
          }
        );

        // Updating province label.
        var countriesSelect = container.querySelector(selectors.addressCountry);
        var addressProvinceLabelEl = container.querySelector(
          selectors.addressProvinceLabel
        );

        if (typeof Countries !== "undefined") {
          Countries.updateProvinceLabel(
            countriesSelect.val(),
            addressProvinceLabelEl
          );
          countriesSelect.change(function () {
            Countries.updateProvinceLabel(
              countriesSelect.val(),
              addressProvinceLabelEl
            );
          });
        }

        // When any of the calculator buttons is clicked, get rates.
        let button = container.querySelector(selectors.submitButton);

        button.addEventListener(
          "click",
          function (e) {
            e.preventDefault();

            // Disabling all buttons.
            this.disableButtons(config, container);

            // Hiding response.
            container.querySelector(selectors.response).style.display = "none";

            // Reading shipping address for submission.
            let shippingAddress = {};
            shippingAddress.zip =
              container.querySelector(selectors.addressZip).value || "";
            shippingAddress.country =
              container.querySelector(selectors.addressCountry).value || "";
            shippingAddress.province =
              container.querySelector(selectors.addressProvince).value || "";

            this.getRates(config, shippingAddress, container);
          }.bind(this)
        );
      }
      enableButtons(config, container) {
        var selectors = {
          submitButton: ".js-shipping-calc-submit",
        };
        container
          .querySelector(selectors.submitButton)
          .removeAttribute("disabled");
        container
          .querySelector(selectors.submitButton)
          .classList.remove("disabled");
        container.querySelector(selectors.submitButton).value =
          config.calculator_submit;
      }
      disableButtons(config, container) {
        var selectors = {
          submitButton: ".js-shipping-calc-submit",
        };
        container
          .querySelector(selectors.submitButton)
          .setAttribute("disabled", "disabled");
        container
          .querySelector(selectors.submitButton)
          .classList.add("disabled");
        container.querySelector(selectors.submitButton).value =
          config.calculator_calculating;
      }
      getRates(config, shipping_address, container) {
        let url =
          "/cart/shipping_rates.json?shipping_address%5Bzip%5D=" +
          shipping_address.zip +
          "&shipping_address%5Bcountry%5D=" +
          shipping_address.country +
          "&shipping_address%5Bprovince%5D=" +
          shipping_address.province;

        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (!response.shipping_rates) {
              this.onError(response, config, container);
            } else {
              let rates = response.shipping_rates;
              this.onRatesUpdate(rates, shipping_address, config, container);
            }
          })
          .catch((error) => {
            this.onError(error, config, container);
          });
      }
      onError(error, config, container) {

        // Re-enable calculate shipping buttons.
        this.enableButtons(config, container);

        let feedback =
          config.calculator_error +
          " " +
          Object.keys(error)[0] +
          " " +
          Object.values(error)[0];

        // Update calculator.
        this.render(
          { rates: [], errorFeedback: feedback, success: false },
          container,
          config
        );

        container.querySelector(".js-shipping-calc-rates").style.display =
          "none";
        container.querySelector(".js-shipping-calc-response").style.display =
          "block";
      }
      onRatesUpdate(rates, shipping_address, config, container) {

        // Re-enable calculate shipping buttons.
        this.enableButtons(config, container);

        // Formatting shipping address.
        var readable_address = "";
        if (shipping_address.zip)
          readable_address += shipping_address.zip + ", ";
        if (shipping_address.province)
          readable_address += shipping_address.province + ", ";
        readable_address += shipping_address.country;

        if (!rates) return false;

        // Format rates for moneyFormat
        rates.forEach((rate, i) => {
          rate.price = this.formatRate(rate.price, config);
        });

        // Show rates and feedback.
        this.render(
          { rates: rates, address: readable_address, success: true },
          container,
          config
        );
      }
      formatRate(ratePrice, config) {
        let formatDollarsToCents = function (value) {
          value = (value + "").replace(/[^\d.-]/g, "");
          if (value && value.includes(".")) {
            value = value.substring(0, value.indexOf(".") + 3);
          }
          return value ? Math.round(parseFloat(value) * 100) : 0;
        };
        let cents = formatDollarsToCents(ratePrice);

        return WAU.Helpers.formatMoney(cents, config.money_format);
      }
      render(response, container, config) {

        let rateFeedback = container.querySelector(
            ".js-shipping-calc-rates-feedback"
          ),
          rateList = container.querySelector(".js-shipping-calc-rates");

        // Empty feedback
        rateFeedback.innerHTML = "";

        // Update feedback
        if (response.rates.length > 1) {
          rateFeedback.innerHTML =
            config.shipping_multi_rate_one +
            response.rates.length +
            config.shipping_multi_rate_two +
            response.address +
            config.shipping_multi_rate_three +
            response.rates[0].price;
        } else if (response.rates.length === 1) {
          rateFeedback.innerHTML =
            config.shipping_single_rate + response.address;
        } else {
          rateFeedback.innerHTML = config.shipping_no_destination;
        }

        // Empty rates
        rateList.innerHTML = "";

        // Update rates
        response.rates.forEach((rate, i) => {
          const rateLI = document.createElement("li");
          rateLI.classList.add("shipping-calc__rate");
          rateLI.innerHTML = rate.name + " at " + rate.price;
          rateList.appendChild(rateLI);
        });

        container.querySelector(".js-shipping-calc-rates").style.display =
          "block";
        container.querySelector(".js-shipping-calc-response").style.display =
          "block";
      }
    }
  );
}
