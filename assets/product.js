
function getProductFetchUrl({sectionUrl, sectionId, params}) {
  return {
    urls: {
      quickshop: `${window.location.origin}${sectionUrl}?view=quick${params}`,
      section: `${window.location.origin}${sectionUrl}?section_id=${sectionId}${params}`,
      set: `${sectionUrl}?view=variants${params}`
    }
  };
}

async function refreshVariantSelectors({
  context,
  sectionId,
  Product,
  events,
  callback,
  wrapperSelector,
  selectedValueSelector,
  getSelectedValues,
  config
}) {

  const swatchWrapper = context.querySelector(wrapperSelector);
  if (!swatchWrapper) return;

  const sectionUrl = swatchWrapper.dataset.url || window.location.pathname;
  const selectedOptionValues = getSelectedValues(context, swatchWrapper);

  const params = selectedOptionValues.length > 0
    ? `&option_values=${selectedOptionValues.join(',')}`
    : '';

  swatchWrapper.classList.add('is-loading');

  const hashKey = `${selectedOptionValues.join(',')}-${sectionId}`;

  function getVariant(html) {
    if (!html) return false;
    const variant = html.querySelector('[data-selected-variant]')?.innerHTML;
    return !variant ? undefined : JSON.parse(variant);
  }

  async function fetchData(url, hashKey) {
    if (!cachedVariantHtml.has(hashKey)) {
      const response = await fetch(url) ;
      const responseText = await response.text();
      // Add the cached version in case the click it again.
      cachedVariantHtml.set(hashKey, responseText);
      return responseText;
    } else {
      return cachedVariantHtml.get(hashKey);
    }
  }

  const { quickview: isQuickview, product_set: isProductSet } = config;

  if (isQuickview) {

    const responseText = await fetchData(getProductFetchUrl({sectionUrl, params}).urls.quickshop, hashKey);

    const html = new DOMParser().parseFromString(responseText, 'text/html');

    const template = html.querySelector('template#quickshop');

    if (!template) return;

    const content = template.content.cloneNode(true);

    if (!content) return;

    const newWrapper = content.querySelector(`${wrapperSelector}`);

    if (!newWrapper) return;

    swatchWrapper.innerHTML = newWrapper.innerHTML;
    swatchWrapper.classList.remove('is-loading');

    const newVariant = getVariant(content);

    ProductForm(context, sectionId, events, Product);

    const config = JSON.parse(context.querySelector(`#product-form-${Product.id}-${sectionId}`).dataset.productForm || "{}");

    if (callback && typeof callback === "function") {
      callback(context, newVariant, config);
    }

  } else {
    const responseText = isProductSet ? await fetchData(getProductFetchUrl({sectionUrl, params}).urls.set, hashKey) : await fetchData(getProductFetchUrl({sectionUrl, sectionId, params}).urls.section, hashKey);

    const html = new DOMParser().parseFromString(responseText, 'text/html');
    const newWrapper = html.querySelector(`${wrapperSelector}`);

    if (!newWrapper) return;

    swatchWrapper.innerHTML = newWrapper.innerHTML;
    swatchWrapper.classList.remove('is-loading');

    const newVariant = getVariant(html);

    ProductForm(context, sectionId, events, Product);

    const config = JSON.parse(context.querySelector(`#product-form-${Product.id}-${sectionId}`).dataset.productForm || "{}");

    if (callback && typeof callback === "function") {
      callback(context, newVariant, config);
    }
  }
}

// Swatches
RefreshSwatches = function(context, sectionId, Product, events, config, callback) {
  refreshVariantSelectors({
    context,
    sectionId,
    Product,
    events,
    callback,
    wrapperSelector: '.product__variants-swatches',
    selectedValueSelector: 'input[type="radio"]:checked',
    getSelectedValues: (ctx, wrapper) =>
      Array.from(wrapper.querySelectorAll('input[type="radio"]:checked')).map(({ dataset }) => dataset.optionValueId),
    config
  });
};

// Dropdowns
RefreshDropdowns = function(context, sectionId, Product, events, config, callback) {
  refreshVariantSelectors({
    context,
    sectionId,
    Product,
    events,
    callback,
    wrapperSelector: '.product__variants-select',
    selectedValueSelector: 'select.js-variant-selector',
    getSelectedValues: (ctx, wrapper) =>
      Array.from(wrapper.querySelectorAll('select.js-variant-selector')).map(select => select.selectedOptions[0]?.dataset.optionValueId),
    config
  });
};

const cachedVariantHtml = new Map();

const prefetchVariants = function(context, {elements}, sectionId, config) {

  const selectors = {
    "swatches": ".product__variants-swatches",
    "dropdowns": ".product__variants-select"
  };

  const hasSwatches = context.querySelector(selectors.swatches) ? true : false;

  function getOptionValuesFromSwatches(input) {
    const optionValues = [input, ...Array.from(elements).filter(item => item.matches(`input[type="radio"]:not([name="${input.name}"]):checked`))].sort((a,b) => parseInt(a.getAttribute('data-position')) - parseInt(b.getAttribute('data-position'))).map((input2) => input2.getAttribute('data-option-value-id'));
    return optionValues
  };

  function getOptionValuesFromDropdowns(input, allOptions) {
    const optionValues = [input, ...Array.from(allOptions).filter(option => option.matches(`option[data-option-value-id]:not([name="${input.getAttribute('name')}"]):checked`))].sort((a,b) => parseInt(a.getAttribute('data-position')) - parseInt(b.getAttribute('data-position'))).map(input => input.getAttribute('data-option-value-id'));
    return optionValues;
  };

  async function cacheHtmlPromise(optionValues) {

    const { url: sectionUrl } = hasSwatches ? context.querySelector(selectors.swatches).dataset : context.querySelector(selectors.dropdowns).dataset;

    const params = optionValues.length > 0
    ? `&option_values=${optionValues.join(',')}`
    : '';

    const hashKey = `${optionValues.join(',')}-${sectionId}`;

    if (!cachedVariantHtml.has(hashKey)) {
      const { quickview: isQuickview, product_set: isProductSet } = config;
      const response = isQuickview ? await fetch(getProductFetchUrl({sectionUrl, params}).urls.quickshop) : isProductSet ? await fetch(getProductFetchUrl({sectionUrl, params}).urls.set) : await fetch(getProductFetchUrl({sectionUrl, sectionId, params}).urls.section);
      const responseText = await response.text();
      cachedVariantHtml.set(hashKey, responseText);
    }
  };

  function handleSwatches(elements) {
    Array.from(elements).filter(item => item.matches('input[type="radio"]:not(:checked)')).forEach(item => {
      const optionValues = getOptionValuesFromSwatches(item);
      cacheHtmlPromise(optionValues);
    });
  };

  function handleDropdowns(context) {
    const allOptions = context.querySelectorAll('option[data-option-value-id]');
    Array.from(context.querySelectorAll('option[data-option-value-id]:not(:checked)')).forEach(item => {
      const optionValues = getOptionValuesFromDropdowns(item, allOptions);
      cacheHtmlPromise(optionValues);
    });
  };

  if (hasSwatches) {
    handleSwatches(elements);
  } else {
    // We cannot pass elements to this function because the <option> element is not included.
    // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements#value
    handleDropdowns(context);
  }
};

function ProductQuantity(context, events) {
  var elements = context.querySelectorAll(".product-qty, .formQty");

  if (!elements) return false;

  if (elements.length > 0) {
    elements.forEach((element) => {

  events.on("quantitycontrol:click", change);

  function change(value) {
    var quantity = parseInt(element.value) + value;

    if ( quantity < 1 ) return false;

    element.value = quantity;
      }
    });  // end forEach
  } // end if
};

function ProductQuantityControls(context, events) {
  Control(".js-qty-up", 1);
  Control(".js-qty-down", -1);

  function Control(selector, value) {
    var element = context.querySelector(selector);

    if ( !element ) return false;

    element.addEventListener("click", function (event) {
      event.preventDefault();
      events.trigger("quantitycontrol:click", value);
    });
    element.addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        events.trigger("quantitycontrol:click", value);
      }
    });
  }
};

ProductForm = function (context, sectionId, events, Product) {
  var prodForm = context.querySelector(`#product-form-${Product.id}-${sectionId}`);
  var config = JSON.parse(prodForm.dataset.productForm || '{}');
  var selector, varSelectors, options, variant;

  /**
   * Helper method to check inputs that are already checked.
   * @see https://stackoverflow.com/a/51750471
   */
  (function checkItems() {
    let checkedInputs = context.querySelectorAll('[checked="checked"]');
    if (checkedInputs.length > 0) {
      checkedInputs.forEach((input) => {
        input.checked = true;
      });
    }
  })();

  if (context.querySelector('#formVariantId')) {
    context.querySelector('#formVariantId').setAttribute('name', 'id');
  }

  // variant only js below
  if ( Product.has_only_default_variant ) return false;

  (function lazyLoadPrefetch() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(context);
        prefetchVariants(context, prodForm, sectionId, config);
      },
      {
        rootMargin: '0px 0px 200px 0px',
      });
      observer.observe(context);
    } else {
      prefetchVariants(context, prodForm, sectionId, config);
    }
  })();

  varSelectors = context.querySelectorAll('.js-variant-selector');

  varSelectors.forEach((item, i) => {
    item.addEventListener("change", function (event) {
      event.preventDefault();

      // Optional: skip if config.swatches is not active
      if (config.swatches === 'swatches') {
        RefreshSwatches(context, sectionId, Product, events, config, variantEvents);
        return;
      }

      if (config.swatches === 'dropdowns') {
        RefreshDropdowns(context, sectionId, Product, events, config, variantEvents);
        return;
      }

      // fallback for dropdowns or legacy ??
      options = Array.from(context.querySelectorAll('select.js-variant-selector'), (select) => select.value);

      variant = Product.variants.find((variant) => {
        return !variant.options.map((option, index) => {
          return options[index] === option;
        }).includes(false);
      });
      variantEvents(context, variant, config);
    });
  });

  (function sku() {
    var element = context.querySelector(".js-variant-sku");

    if ( !element ) return false;

    events.on("variantchange", function (variant, config) {
			if (!variant.sku) {
				element.parentNode.style.display = 'none';
			} else {
				element.innerHTML = variant.sku;
				element.parentNode.style.display = 'inline-block';
			}
    });
    events.on("variantunavailable", function (config) {
			element.innerHTML = config.unavailable;
    });
  })();

	(function price() {
		var element = context.querySelector(".price__regular .price-item--regular");

    if ( !element ) return false;

		events.on("variantchange", function (variant) {
			var price = money(variant.price);
			element.innerHTML = price;

			events.on("variantunavailable", function (variant) {
				price = '';
				element.innerHTML = price;
			});
		});
	})();

	(function price_classes() {
		var element = context.querySelector("[data-price]");

    if ( !element ) return false;

		events.on("variantchange", function (variant) {
			if ( variant.available && variant.compare_at_price > variant.price ) {
				element.classList.add('price--on-sale');
				element.classList.remove('price--sold-out');
			} else if ( !variant.available && variant.compare_at_price > variant.price ) {
				element.classList.add('price--sold-out');
				element.classList.add('price--on-sale');
			} else if ( !variant.available ) {
				element.classList.add('price--sold-out');
				element.classList.remove('price--on-sale');
			} else {
				element.classList.remove('price--on-sale');
				element.classList.remove('price--sold-out');
			}

			if (variant.unit_price_measurement) {
				element.classList.add('price--unit-available');
			} else {
				element.classList.remove('price--unit-available');
			}
		});
	})();

	(function unit_price() {
		var element = context.querySelector("[data-unit-price]");
		var wrapper = context.querySelector(".price__unit");

		if ( !element ) return false;

		events.on("variantchange", function (variant) {
			var unitPrice = "";

			if (variant.unit_price) {
          unitPrice = '(' + WAU.Helpers.formatMoney(variant.unit_price, config.money_format) +  ' / ' + getBaseUnit(variant) + '&nbsp;)';

          element.style.display = "inline-block";
			} else {
				wrapper.style.display = "none";
			}

			element.innerHTML = unitPrice;
		});
	})();

	(function compare_price() {
		var saleEl = context.querySelector(".price__sale .price-item--sale");
		var regEl = context.querySelector(".price__sale .price-item--regular");

		if ( !saleEl ) return false;

		events.on("variantchange", function (variant) {
			var salePrice = "",
					regPrice = "";

			if ( variant.compare_at_price > variant.price ) {
				regPrice = money(variant.compare_at_price);
				salePrice = money(variant.price);
			}

			saleEl.innerHTML = salePrice;
			regEl.innerHTML = regPrice;
		});
	})();

	(function add_to_cart() {
    var element = context.querySelector(".js-ajax-submit");

    if ( !element ) return false;

    events.on("variantchange", function (variant) {
      var text = config.button;
      var disabled = false;

      if ( !variant.available ) {
        text = config.sold_out;
        disabled = true;
      }

			element.setAttribute("data-variant-id", variant.id);
      element.innerHTML = text;
      element.disabled = disabled;
    });

    events.on("variantunavailable", function () {
      element.innerHTML = config.unavailable;
      element.disabled = true;
    });
  })();

  (function shop_pay() {
    const element = context.querySelector('#product-form-installment');

    if (!element) return false;

    const input = element.querySelector('input[name="id"]');

    events.on("variantchange", function (variant) {
      input.value = variant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  })();

  (function smart_payment_buttons() {
    var element = context.querySelector(".shopify-payment-button");

    if ( !element ) return false;

    events.on("variantchange", function (variant) {

      if ( !variant.available ) {
         element.style.display = 'none';
       } else {
         element.style.display = 'block';
       }

    });
  })();

  (function selling_plans() {
    var element = context.querySelector('[name="selling_plan"]');

    if ( !element ) return false;

    // Add selling plan input to submit form
    var submitForm = context.querySelector('.js-prod-form-submit');
    var input = document.createElement("input");
      input.name = "selling_plan";
      input.type = "hidden";
      input.className = "js-selling-plan";
      submitForm.appendChild(input);

    //Update selling plan input on select change
    element.addEventListener('change', function(event) {
      input.value = event.target.value;
    });
  })();

	function money(cents) {
		return WAU.Helpers.formatMoney(cents, config.money_format);
	}

	function getBaseUnit(variant) {
   return variant.unit_price_measurement.reference_value != 1
     ? variant.unit_price_measurement.reference_value
     : variant.unit_price_measurement.reference_unit;
  }

  function variantEvents(context, variant, config) {
    if ( !variant ) {
      events.trigger("variantunavailable", config);
      events.trigger("storeavailability:unavailable");
      return;
    }

    if ( Product.variants.length == 1 ) {
      if ( !variant.available ) {
        var element = context.querySelector(".product-price");
        element.innerHTML = config.sold_out;
      }
      return;
    }

    events.trigger("variantchange", variant, config);
    events.trigger("variantchange:option1:" + variant.option1);
    events.trigger("variantchange:option2:" + variant.option2);
    events.trigger("variantchange:option3:" + variant.option3);

    if ( context.querySelector('[data-store-availability-container]') ) {
      events.trigger("storeavailability:variant", variant.id, Product.title);
    }

    if ( variant.featured_media ) {
      Events.trigger("variantchange:image", variant.featured_media.id, context);
    }

    if ( config.enable_history ) historyState(variant, context);

    updateVariantInput(variant, context);
  }

  function historyState(variant, context) {
    if ( !variant ) return;
    window.history.replaceState({ }, '', `${context.dataset.url}?variant=${variant.id}`);
  }

  function updateVariantInput(variant, context) {
    const input = context.querySelector('#formVariantId');
    if (!input) {
      return false;
    }
    input.setAttribute('name', 'id');
    input.value = variant.id;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    Events.trigger("variantinputchange", variant);
    if ( variant.featured_media ) Events.trigger("variantinputchange:image", variant.featured_media.id, context);
  }
}

ProductDetails = function (context, events, Product) {
  (function sku() {
    var element = context.querySelector(".js-variant-sku");

    if ( !element ) return false;

    events.on("variantchange", function (variant, config) {
			if (!variant.sku) {
				element.parentNode.style.display = 'none';
			} else {
				element.innerHTML = variant.sku;
				element.parentNode.style.display = 'grid';
			}
    });
    events.on("variantunavailable", function (config) {
			element.innerHTML = config.unavailable;
    });

  })();

  ;(function inventory() {
    const element = context.querySelector('.variant_inventory');
    if (!element) return false;
  
    function updateDisplay(variant, config) {
      const {
        inventory_quantity,
        inventory_management,
        inventory_policy
      } = variant;

      // 1) Shopify-managed + “continue” → show config.in_stock if sold out, qty otherwise
      if (inventory_management === 'shopify' && inventory_policy === 'continue') {
        element.innerHTML = inventory_quantity <= 0
          ? config.in_stock
          : inventory_quantity;
        return;
      }

      // 2) Not tracked → always “in stock”
      if (!inventory_management) {
        element.innerHTML = config.in_stock;
        return;
      }

      // 3) All other cases (tracked + strict policy) → legacy behavior
      element.innerHTML = inventory_quantity <= 0
        ? 0
        : inventory_quantity;
    }

    events.on('variantchange', updateDisplay);
    events.on('variantunavailable', function(config) {
      element.innerHTML = config.unavailable;
    });
  })();

  (function weight() {
    var element = context.querySelector(".js-variant-weight");

    if ( !element ) return false;

    events.on("variantchange", function (variant, config) {
      var variantWeight = variant.weight_in_unit;
      var variantWeightUnit = variant.weight_unit;
      if ( variantWeight > 0 ) {
        element.innerHTML = variantWeight + '&nbsp;' + variantWeightUnit;
      } else {
        element.innerHTML = config.unavailable;
      }
    });
    events.on("variantunavailable", function (config) {
      element.innerHTML = config.unavailable;
    });

  })();
}



ProductGallery = (function () {
  function init(context, sectionId, events, Product) {
    let config = JSON.parse(context.querySelector('.js-product-gallery')?.dataset.galleryConfig || '{}'),
        main = context.querySelector('.js-carousel-main'),
        carouselNav = context.querySelector('.js-thumb-carousel-nav');

    if (!main) return false;

    this.mainSlider(main, carouselNav, config, context);
    if ( config.thumbPosition == 'bottom' && config.thumbSlider == true ) this.thumbSlider(carouselNav, main, context);

    if ( config.clickToEnlarge ) ProductGallery.enlargePhoto(context);
  }

  function mainSlider(main, carouselNav, config, context) {
    let initialEl = main.querySelector("[data-image-id='" + context.dataset.initialVariant + "']"),
        initialIndex;

    if ( initialEl ) {
      initialIndex = initialEl.dataset.slideIndex;
    } else {
      initialIndex = 0;
    }

    var flkty = new Flickity( main, {
      // options
      fade: true,
      wrapAround: true,
      cellAlign: 'left',
      draggable: true,
      contain: true,
      pageDots: true,
      prevNextButtons: true,
      selectedAttraction: 0.2,
      friction: 0.8,
      autoPlay: false,
      selectedAttraction: 0.01,
      dragThreshold: 5,
      adaptiveHeight: true,
      imagesLoaded: true,
      initialIndex: initialIndex,
			arrowShape: 'M71.9,95L25.1,52.2c-0.6-0.6-0.9-1.3-0.9-2.2s0.3-1.6,0.9-2.2L71.9,5l3.9,4.3L31.4,50l44.4,40.7L71.9,95z',
      on: {
        ready: function() {
          let id = this.selectedElement.dataset.imageId;

          /* Fade in */
          context.querySelector('.js-product-gallery').style.visibility = "visible";

          ProductGallery.setThumbByColor(context);
        },
        change: function() {
          /* Set focus control on change */
          ProductGallery.removeFocus(context);
          ProductGallery.addFocus(this.selectedElement, context);

          /* Set media */
          ProductGallery.setActiveThumbnail(this.selectedElement.dataset.imageId, this.selectedElement, context);
          ProductGallery.switchMedia(this.selectedElement.dataset.imageId, context);

          /* Allow model drag */
          if ( this.selectedElement.classList.contains('model-slide') ) {
            if ( this.isDraggable ) {
              /* Turn off drag for model usage */
              this.options.draggable = !this.options.draggable;
              this.updateDraggable();
            }
          }
        },
        dragStart: function () {
          document.ontouchmove = e => e.preventDefault();
        },
        dragEnd: function () {
          document.ontouchmove = () => true
        }
      }
    });

    ProductGallery.galleryEvents(flkty, context, carouselNav);

    if ( carouselNav ) ProductGallery.thumbnails(flkty, carouselNav, config, context);
  }

  function thumbSlider(wrapper, main, context) {
    var flktyThumbs = new Flickity( wrapper, {
      // options
      asNavFor: main,
      wrapAround: false,
      groupCells: true,
      cellAlign: 'left',
      draggable: false,
      contain: true,
      imagesLoaded: true,
      pageDots: false,
      autoPlay: false,
      selectedAttraction: 0.01,
      dragThreshold: 5,
      accessibility: false,
      arrowShape: 'M71.9,95L25.1,52.2c-0.6-0.6-0.9-1.3-0.9-2.2s0.3-1.6,0.9-2.2L71.9,5l3.9,4.3L31.4,50l44.4,40.7L71.9,95z'
    });
  }

  function thumbnails(flkty, carouselNav, config, context) {
    if ( !carouselNav ) return false;

    let thumbs = carouselNav.querySelectorAll('.js-thumb-item');

    if ( !thumbs ) return false;

    /* on thumbnail click and key enter */
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', function(event){
        event.preventDefault();

        let index = this.dataset.slideIndex,
            el = carouselNav.querySelectorAll('.js-thumb-item')[index],
            mediaId = this.dataset.imageId;

        /* Update classes & aria */
        ProductGallery.setActiveThumbnail(mediaId, el, context);
        ProductGallery.switchMedia(mediaId, context);

        /* move thumb slider to position */
        ProductGallery.setThumbPos(this, carouselNav);

        /* change slide */
        flkty.select( index );

      });

      thumb.addEventListener('keypress', function(event){
        event.preventDefault();

        if(event.which == 13){ //Enter key pressed

          let index = this.dataset.slideIndex,
              el = carouselNav.querySelectorAll('.js-thumb-item')[index],
              mediaId = this.dataset.imageId;

          /* Update classes & aria */
          ProductGallery.setActiveThumbnail(mediaId, el, context);
          ProductGallery.switchMedia(mediaId, context);

          /* move thumb slider to position */
          ProductGallery.setThumbPos(this, carouselNav);

          /* change slide */
          flkty.select( index );

        }
      });
    });
  }

  function setThumbPos(selected, carouselNav) {

    carouselNav.scrollTo({
      top: selected.offsetTop - 20,
      left: 0,
      behavior: 'smooth'
    });
  }

  function galleryEvents(flkty, context, carouselNav) {

    /* On Variant Change and Initial Load */
    Events.on('variantchange:image', function(id, context){

      if ( id === null ) return false;

      /* Select new image in flickity */
      var main, el, index, curFlkty;

      main = context.querySelector('.js-carousel-main');

      if ( !main ) return false;

	  carouselNav = context.querySelector('.js-thumb-carousel-nav');
		

      el = main.querySelector("[data-image-id='" + id + "']");
      if (!el) return false;
      index = el.dataset.slideIndex;

      ProductGallery.setActiveThumbnail(id, el, context);
      ProductGallery.switchMedia(id, context);
      ProductGallery.setThumbByColor(context);

      curFlkty = Flickity.data( main );
      curFlkty.select( index );

      if ( carouselNav ) {
        let activeThumb = carouselNav.querySelector('.js-thumb-item.is-nav-selected');
        ProductGallery.setThumbPos(activeThumb, carouselNav);
      }

    });
  }

  function removeFocus(context) {
    let main;

    if ( context ) {
      main = context;
    } else {
      main = context.querySelector('.js-carousel-main');
    }

    /* Set all elements to no tab */
    context.querySelectorAll('.js-carousel-main *').forEach((item, i) => {
      item.setAttribute('tabIndex', '-1');
      item.blur();
    });

    let buttonContents = context.querySelectorAll('.flickity-button *');
    buttonContents.forEach((item, i) => {
      item.setAttribute('tabIndex', '-1');
      item.classList.add('js-hide-focus')
    });

    if (main.classList.contains('.flickity-enabled')) {
      main.setAttribute('tabIndex', '-1');
      main.classList.add('js-hide-focus');
    }
  }

  function addFocus(current, context) {
    /* Set current element to tab */
    if ( current.classList.contains('image-slide') ) {
      current.querySelector('img').setAttribute("tabIndex", "0");
    } else if ( current.classList.contains('video-slide') ) {
      current.querySelectorAll('.plyr__controls *').forEach((item, i) => {
        item.setAttribute("tabIndex", "0");
      });
    } else if ( current.classList.contains('external_video-slide') ) {
      current.querySelector('iframe').setAttribute("tabIndex", "0");
    } else if ( current.classList.contains('model-slide') ) {
      current.querySelectorAll('.shopify-model-viewer-ui__controls-area *').forEach((item, i) => {
        item.setAttribute("tabIndex", "0");
      });
    }
  }

  function enlargePhoto(context) {

    let buttons = context.querySelectorAll('.js-zoom-btn');

    if ( !buttons ) return false;

    buttons.forEach((button, i) => {
      button.addEventListener('click', function (event) {
      	event.preventDefault();

        var btn = event.target,
            index = btn.getAttribute('data-index'),
            index = parseInt(index,10);

        const loader = new WAU.Helpers.scriptLoader();
        loader.load([jsAssets.zoom]).then(() => {
          openPhotoSwipe(index);
        });

      });
    });

    var openPhotoSwipe = function(index) {
      var pswpElement = document.querySelectorAll('.pswp')[0];

      let images = context.querySelectorAll('#main-slider .image-slide');

      if ( images.length < 2 ) {
        var arrows = false;
      } else {
        var arrows = true;
      }

      let items = [];
      images.forEach((image, i) => {
        let imageTag = image.querySelector('.product__image');

        let item = {
          src: imageTag.getAttribute('data-zoom-src'),
          w: imageTag.getAttribute('width'),
          h: imageTag.getAttribute('height')
        }
        items.push(item);
      });

      var options = {
        index: index,
        arrowEl: arrows,
        captionEl: false,
        closeOnScroll: false,
        counterEl: false,
        history: false,
        fullscreenEl: false,
        preloaderEl: false,
        shareEl: false,
        tapToClose: false,
        zoomEl: true,
        getThumbBoundsFn: function(index) {
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          var thumbnail = context.querySelector('.product__image');
          var rect = thumbnail.getBoundingClientRect();
          return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }
      };

      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();

      gallery.listen('afterChange', function() {
        var flkty = Flickity.data('.js-carousel-main')
        var newIndex = gallery.getCurrentIndex();
        flkty.select (newIndex);
      });

    };
  }

  function switchMedia(mediaId, context) {
    let main = context.querySelector('.js-carousel-main'),
        currentMedia = main.querySelector('[data-product-single-media-wrapper]:not(.inactive)'),
        newMedia = main.querySelector('[data-product-single-media-wrapper]' + "[data-thumbnail-id='product-template-" + mediaId +"']"),
        otherMedia = main.querySelectorAll('[data-product-single-media-wrapper]' + ":not([data-thumbnail-id='product-template-" + mediaId + "'])");

    if (currentMedia) {
      currentMedia.dispatchEvent(
        new CustomEvent('mediaHidden', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (newMedia) {
      newMedia.classList.add('active-slide');
      newMedia.classList.remove('inactive');
      newMedia.dispatchEvent(
        new CustomEvent('mediaVisible', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (otherMedia) {
      otherMedia.forEach(
        function(el) {
          el.classList.add('inactive');
          el.classList.remove('active-slide');
        }.bind(this)
      );
    }
  }

  function setActiveThumbnail(mediaId, el, context) {

     let main = context.querySelector('.js-carousel-main'),
         carouselNav = context.querySelector('.js-thumb-carousel-nav');

     if (typeof mediaId === 'undefined') {
       mediaId = main.querySelector('[data-product-single-media-wrapper]:not(.hide)').dataset.mediaId;
     }

     if ( carouselNav ) {
       /* remove selected class from all */
       carouselNav.querySelectorAll('.js-thumb-item').forEach((item, i) => {
         item.classList.remove('is-nav-selected');
         item.classList.remove('active-slide');
         item.removeAttribute('aria-current');
       });
     }

     /* add selected class */
     let thumbActive = context.querySelector(".js-thumb-item[data-image-id='" + mediaId + "']");
     if ( thumbActive ) {
       thumbActive.classList.add('is-nav-selected');
       thumbActive.classList.add('active-slide');
       thumbActive.setAttribute('aria-current', true);
     }
   }

  function setThumbByColor(context) {
    let selectColors = context.querySelectorAll('.swatches__form--input:checked');

    selectColors.forEach((el) => {
      if (el.name === 'metal' || el.name === 'gold' || el.name === 'color' || el.name === 'colors' || el.name === 'colour' || el.name === 'colours' || el.name === 'colore') {
        var selectColor = el.value;
        let thumbnails = context.querySelectorAll('.js-thumb-item');

        thumbnails.forEach((item, i) => {
          let color = item.dataset.group;

          if ( !color ) return false;
          let currentColor = selectColor.replace(/\s+/g, '-').toLowerCase();
          if (color == currentColor) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      }
    });
  }

  return {
    init: init,
    mainSlider: mainSlider,
    thumbSlider: thumbSlider,
    thumbnails: thumbnails,
    setThumbPos: setThumbPos,
    galleryEvents: galleryEvents,
    removeFocus: removeFocus,
    addFocus: addFocus,
    enlargePhoto: enlargePhoto,
    switchMedia: switchMedia,
    setActiveThumbnail: setActiveThumbnail,
    setThumbByColor: setThumbByColor
  };
})();

ProductScrollGallery = (function(container) {
  function init(context, sectionId, events, Product) {
    let config = JSON.parse(context.querySelector('[data-gallery-config]').dataset.galleryConfig || '{}'),
        main = context.querySelector('.js-scroll-gallery');

    if ( !main ) return false;

    if ( config.clickToEnlarge ) ProductScrollGallery.enlargePhoto(context);


    if ( WAU.Helpers.isDevice() ) {
      this.mobileCarouselInit(main, config, context);
    } else {
      this.mobileCarouselDestroy(main);
      this.scroll_galleryInit(main, context);
    }

    window.addEventListener('resize', WAU.Helpers.debounce((event) => {
			if ( WAU.Helpers.isDevice() ) {
        this.mobileCarouselInit(main, config, context);
      } else {
        this.mobileCarouselDestroy(main);
        this.scroll_galleryInit(main, context);
      }
		}, 300).bind(this));

  }
  function scroll_galleryInit(main, context) {
    var imgLoad = imagesLoaded( main );
    function onAlways() {
      ProductScrollGallery.galleryEvents(main, context);
    }
    if (main) {
      imgLoad.on( 'always', onAlways )
    }
  }
  function galleryEvents(main, context) {
    document.addEventListener("shopify:section:load", function(event) {
      if (event.target.querySelector('[data-section-type="product"]')) {
         ProductScrollGallery.scroll_galleryInit(main, context);
      }
    });

    /* On Variant Change and Initial Load */
    Events.on('variantchange:image', function(id, context){

      if ( id === null ) return false;

      var el = main.querySelector("[data-image-id='" + id + "']");

      // Bail if not scroll_gallery gallery.
      if (context.dataset.productGallery != 'scroll_gallery') return false;

      ProductScrollGallery.switchMedia(main, id, context);

      ProductScrollGallery.scrollIntoView(el);
    });
  }
  function scrollIntoView(element) {
    if (!element) {
      console.log('Error. Must provide an element to scroll to.');
      return false;
    }
    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 500)
  }
  function switchMedia(main, mediaId, context) {
    let currentMedia = main.querySelector('[data-product-single-media-wrapper]:not(.inactive)'),
        newMedia = main.querySelector('[data-product-single-media-wrapper]' + "[data-thumbnail-id='product-template-" + mediaId +"']"),
        otherMedia = main.querySelectorAll('[data-product-single-media-wrapper]' + ":not([data-thumbnail-id='product-template-" + mediaId + "'])");

    if (currentMedia) {
      currentMedia.dispatchEvent(
        new CustomEvent('mediaHidden', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (newMedia) {
      newMedia.classList.add('active-slide');
      newMedia.classList.remove('inactive');
      newMedia.dispatchEvent(
        new CustomEvent('mediaVisible', {
          bubbles: true,
          cancelable: true
        })
      );
    }

    if (otherMedia) {
      otherMedia.forEach(
        function(el) {
          el.classList.add('inactive');
          el.classList.remove('active-slide');
        }.bind(this)
      );
    }
  }
  function mobileCarouselInit(main, config, context) {
    var flkty = new Flickity( main, {
      // options
      wrapAround: true,
      cellAlign: 'left',
      draggable: true,
      pageDots: true,
      prevNextButtons: true,
      autoPlay: false,
      selectedAttraction: 0.2,
      friction: 0.8,
      dragThreshold: 5,
      adaptiveHeight: true,
      imagesLoaded: true,
      arrowShape: 'M71.9,95L25.1,52.2c-0.6-0.6-0.9-1.3-0.9-2.2s0.3-1.6,0.9-2.2L71.9,5l3.9,4.3L31.4,50l44.4,40.7L71.9,95z',
      on: {
        ready: function() {
          setTimeout(function(){
            var flkty = Flickity.data( main );
            context.querySelector('.flickity-enabled').style.height = null;
            flkty.resize();
          }, 200);

          ProductScrollGallery.mobileGalleryEvents(this, context, main);
        },
        change: function() {
          ProductScrollGallery.switchMedia(main, this.selectedElement.dataset.imageId, context);
        },
        dragStart: function () {
          document.ontouchmove = e => e.preventDefault();
        },
        dragEnd: function () {
          document.ontouchmove = () => true
        }
      }
    });
  }
  function mobileCarouselDestroy(main) {
    var flkty = Flickity.data(main);
    if ( !flkty ) return false;
    flkty.destroy();
  }
  function mobileGalleryEvents(flkty, context, main) {

    /* On Variant Change and Initial Load */
    Events.on('variantchange:image', function(id, context){

      if ( id === null ) return false;

      /* Select new image in flickity */
      var el, index, curFlkty;

      el = main.querySelector("[data-image-id='" + id + "']");
      if (!el) return false;
      index = parseInt(el.dataset.slideIndex);

      curFlkty = Flickity.data( main );
      if ( curFlkty ) curFlkty.select( index );

    });
  }
  function enlargePhoto(context) {

    let buttons = context.querySelectorAll('.js-zoom-btn');

    if ( !buttons ) return false;

    buttons.forEach((button, i) => {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        if ( WAU.Helpers.isDevice() && button.tagName == 'IMG' ) return false;

        var btn = event.target,
            index = btn.getAttribute('data-index'),
            index = parseInt(index,10);

        const loader = new WAU.Helpers.scriptLoader();
        loader.load([jsAssets.zoom]).then(() => {
          openPhotoSwipe(index);
        });

      });
    });

    var openPhotoSwipe = function(index) {
      var pswpElement = document.querySelectorAll('.pswp')[0];

      let images = context.querySelectorAll('#main-image-gallery .image-slide');

      if ( images.length < 2 ) {
        var arrows = false;
      } else {
        var arrows = true;
      }

      let items = [];
      images.forEach((image, i) => {
        let imageTag = image.querySelector('.product__image');

        let item = {
          src: imageTag.getAttribute('data-zoom-src'),
          w: imageTag.getAttribute('width'),
          h: imageTag.getAttribute('height')
        }
        items.push(item);
      });

      var options = {
        index: index,
        arrowEl: arrows,
        captionEl: false,
        closeOnScroll: false,
        counterEl: false,
        history: false,
        fullscreenEl: false,
        preloaderEl: false,
        shareEl: false,
        tapToClose: false,
        zoomEl: true
      };

      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();

      gallery.listen('afterChange', function() {
        var flkty = Flickity.data('.js-scroll-gallery');
        var newIndex = gallery.getCurrentIndex();
        if ( !flkty ) return false;
        flkty.select (newIndex);
      });

    };
  }
  return {
    init,
    scroll_galleryInit,
    galleryEvents,
    scrollIntoView,
    switchMedia,
    mobileCarouselInit,
    mobileCarouselDestroy,
    mobileGalleryEvents,
    enlargePhoto
  }
})();

ProductSet = (function() {

  function getPrice() {
    var setPrice = 0;
    document.querySelectorAll('.js-set_item:not(.js-product_set--skip) .js-product-set-selected.active--image').forEach(item => {
      let itemPrice = item.getAttribute('data-variant-price');
      setPrice += parseInt(itemPrice);
    });
    return setPrice;
  }

  function init(container) {
    const loader = new WAU.Helpers.scriptLoader();
    loader.load([jsAssets.flickity]).finally(() => {});


    let setProducts = container.querySelectorAll('.js-set-product');
    setProducts.forEach(item => Product(item));
    var data = {};
        data = setData(container, data);

    Events.on('productset:checkbox', (blockId, checked) => {
      // Get the "set item" product block
      const productSetBlock = document.querySelector(`[data-block-id="${blockId}"]`);

      if (!productSetBlock) return;

      // Toggle "flag" class
      productSetBlock.classList.toggle('js-product_set--skip', !checked);

      // Set data
      data = setData(container, data);

      // Update price
      container.querySelector('.js-product-set-price').innerHTML = WAU.Helpers.formatMoney(getPrice());
    });

    Events.on("variantinputchange", function (variant) {
      // Update variant data for adding to cart
      data = setData(container, data);

      // Update selected variants in product form
      var variantContext = document.querySelector(`.js-product-set-selected[data-variant-id="${variant.id}"]`).parentNode;
      variantContext.querySelectorAll('.js-product-set-selected').forEach(item => item.classList.remove('active--image'));
      variantContext.querySelector(`.js-product-set-selected[data-variant-id="${variant.id}"]`)?.classList.add('active--image');

      // Update price on selected variant
      variantContext.querySelector(`.js-product-set-selected[data-variant-id="${variant.id}"]`).setAttribute('data-variant-price', variant.price);

      container.querySelector('.js-product-set-price').innerHTML = WAU.Helpers.formatMoney(getPrice());
    });

    Events.on('variantinputchange:image', function(id, context){
      if ( id === null ) return false;
      context.querySelectorAll('.active--image').forEach(item => item.classList.remove('active--image'));
      context.querySelector(`img[data-image-id="${id}"]`)?.classList.add('active--image');
    });

    let customSubmits = document.querySelectorAll('.js-custom-submit');
    customSubmits.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (!data) return false;
        WAU.AjaxCart.addItemsToCart(data, event.target);
      });
    });
  }
  function setData(container, data) {
    let forms = container.querySelectorAll('.product__form-buttons:not(.skip)');
    var items = [];

    for (const prop of Object.getOwnPropertyNames(data)) {
      delete data[prop];
    }

    var data = {};
    forms.forEach((form) => {
      let varID = form.querySelector('#formVariantId').value,
          setTitle = container.dataset.setTitle;
      var item = {};

      item.id = parseInt(varID);
      item.quantity = 1;
      item.properties = {
        'Product Set': setTitle
      }
      items.push(item);

      data = { items };
    });

    return data;
  }
  return {
    init,
    setData
  }
})();

/**
 * Product Set Item Checkbox
 * @description Custom element for product set item checkbox. Toggles if a product in the set is added to the cart or not.
 */
class WAUProductSetItemCheckbox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.querySelector('input[type="checkbox"]')?.addEventListener('change', this.handleChange);
  }

  handleChange(event) {
    const checkbox = event.target;
    const blockId = checkbox.getAttribute('data-block-id');
    const selector = `[data-set-block-id="${blockId}"]`;
    const form = document.querySelector(selector);
    if (!form) return false;
    if (checkbox.checked) {
      form.classList.remove('skip');
    } else {
      form.classList.add('skip');
    }
    Events.trigger('productset:checkbox', blockId, checkbox.checked);
  }
}

customElements.define('wau-product-set-item-checkbox', WAUProductSetItemCheckbox);

function Product(container) {
  var events = new EventEmitter3();
  events.trigger = events.emit; // alias

  var productJson = container.querySelector('.product-json');

  if ( !productJson ) return false;

  var Product = productJson.innerHTML,
      Product = JSON.parse(Product || '{}');

  var sectionId = container.dataset.sectionId;

  if (container.querySelector('pickup-availability')) {
    container.querySelector('pickup-availability').instance = events;
  }

  if ( container.querySelector("[data-product-form]") ) {
    ProductForm(container, sectionId, events, Product);
  }

  if ( container.querySelector("[data-product-qty]") ) {
    ProductQuantity(container, events);
    ProductQuantityControls(container, events);
  }

  if ( container.getAttribute('data-product-gallery') === 'thumbnail' ) {
    ProductGallery.init(container, sectionId, events, Product);
  }

  if ( container.getAttribute('data-product-gallery') === 'scroll_gallery' ) {
    ProductScrollGallery.init(container);
  }

  if ( container.querySelector('[data-recipient-form]') ) {
    GiftCardRecipient(container, sectionId, events, Product);
  }

  if ( document.querySelector("[data-product-details]") ) {
    ProductDetails(document.querySelector("[data-product-details]"), events, Product);
  }

  if ( document.querySelector('[data-countdown]') ) {
    Countdown(container, sectionId, events, Product);
  }

  /* Product media */
  if ( container.querySelectorAll('[data-product-media-type-video]').length > 0 ) {
    setTimeout(function() {
      container.querySelectorAll('[data-product-media-type-video]').forEach(function (item, sectionId) {
        ProductVideo.init(item, sectionId);
      });
    }, 90);
  }

  let modelViewerElements = container.querySelectorAll('[data-product-media-type-model]');

  if ( modelViewerElements.length > 0 ) {
    setTimeout(function() {
      ProductModel.init(modelViewerElements, sectionId);
    }, 90);
  }

  var self = this;

  document.addEventListener('shopify_xr_launch', function() {
    var currentMedia = document.querySelector('[data-product-single-media-wrapper]:not(.inactive)', self);

    currentMedia.dispatchEvent(
      new CustomEvent('xrLaunch', {
        bubbles: true,
        cancelable: true
      })
    );
  });
}

GiftCardRecipient = function (context, sectionId, events, Product) {
  const container = context.querySelector(".recipient-form");
  if (!container) return false;
  const recipientCheckbox = container.querySelector(`#Recipient-Checkbox-${ sectionId }`);
  recipientCheckbox.disabled = false;
  const emailInput = container.querySelector(`#Recipient-email-${ sectionId }`);
  const nameInput = container.querySelector(`#Recipient-name-${ sectionId }`);
  const messageInput = container.querySelector(`#Recipient-message-${ sectionId }`);
  const hiddenField = container.querySelector(`#Recipient-Control-${ sectionId }`);
  hiddenField.disabled = true;
  const form = container.closest('.js-prod-form-submit');
  const formSubmitButton = form.querySelector('.js-ajax-submit');
  const defaultErrorMessage = context.querySelector('.js-error-msg').innerHTML;

  form.addEventListener('change', handleChange);

  function handleChange(event) {
    if (!recipientCheckbox.checked) {
      clearForm();
    } else {
      emailInput.required = true;
    }
  }

  function clearForm() {
    clearErrorMessage();
    emailInput.value = '';
    nameInput.value = '';
    messageInput.value = '';
    emailInput.required = false;
  }

  function clearErrorMessage() {
    container.querySelectorAll('.recipient-fields .form__message').forEach(field => {
      field.classList.add('hidden');
      const textField = field.querySelector('.error-message');
      if (textField) textField.innerText = '';
    });
  }

  function displayErrorMessage(title, body, formContext) {
    if (!form.isSameNode(formContext)) return;
    clearErrorMessage();
    if (typeof body === 'object') {
      return Object.entries(body).forEach(([key, value]) => {
        const errorMessageId = `RecipientForm-${ key }-error-${ sectionId }`
        const fieldSelector = `#Recipient-${ key }-${ sectionId }`;
        const placeholderElement = container.querySelector(`${fieldSelector}`);
        const label = placeholderElement?.getAttribute('placeholder') || key;
        const message = `${label} ${value}`;
        const errorMessageElement = container.querySelector(`#${errorMessageId}`);
        const errorTextElement = errorMessageElement?.querySelector('.error-message')
        if (!errorTextElement) return;

        errorTextElement.innerText = `${message}.`;
        errorMessageElement.classList.remove('hidden');
      });
    }
  }

  function updateErrorMessage(title, config, formContext) {
    if (!form.isSameNode(formContext)) return;

    const errorMessage = context.querySelector('.js-error-msg');
    if (!errorMessage) {
      console.warn('No error message found.');
      return;
    }
    errorMessage.innerHTML = `<b>${config.form_error}</b> ${title}`;

    // Set back to default
    setTimeout(() => {
      errorMessage.innerHTML = defaultErrorMessage;
    }, 4000)
  }

  Events.on('recipientform:errors', function(title, body, config, addToCartForm) {
    displayErrorMessage(title, body, addToCartForm);
    updateErrorMessage(title, config, addToCartForm);
  });
};

document.querySelectorAll('[data-section-type="product"]').forEach(function(container, i){
  Product(container);
});

document.querySelectorAll('[data-section-type="product-set"]').forEach(function(container, i) {
  ProductSet.init(container);
});

document.addEventListener("shopify:section:select", function(event) {
  if (event.target.querySelector('[data-section-type="product-set"]')) ProductSet.init(event.target.querySelector('[data-section-type="product-set"]'));
});

document.addEventListener("shopify:block:select", function(event) {
  if (event.target.querySelector('[data-section-type="product"]')) Product(event.target.querySelector('[data-section-type="product"]'));

  if (event.target.querySelector('[data-section-type="product-set"]')) ProductSet.init(event.target.querySelector('[data-section-type="product-set"]'));
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="product"]')) Product(event.target.querySelector('[data-section-type="product"]'));

  if (event.target.querySelector('[data-section-type="product-set"]')) ProductSet.init(event.target.querySelector('[data-section-type="product-set"]'));
});
