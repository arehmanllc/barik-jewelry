WAU.Quickshop = {
	cache: new Map(),
  init: function init() {

    var selectors = {
      quickviewButton: '.js-quickview-trigger'
    }

		// Remove section contents
		if ( document.getElementById('quickshopTemplate') ) {
			document.getElementById('quickshopTemplate').innerHTML = '';
		}

    // Init on click event for buttons
    document.querySelectorAll(selectors.quickviewButton).forEach((button, i) => {

      button.addEventListener('click', function(event) {
        event.preventDefault();
				event.target.classList.add('loading-quickshop');

				var productUrl = this.dataset.productUrl,
						productUrl = WAU.Quickshop.cleanUrl(productUrl, 'variant');

				let singleVariant = event.target.hasAttribute('data-quick-add');

				const loader = new WAU.Helpers.scriptLoader();

        if ( this.dataset.hasModel )loader.load([jsAssets.productModel]).finally(() => {});
        if ( this.dataset.hasVideo )loader.load([jsAssets.productVideo]).finally(() => {});
				if ( this.dataset.productComplementaryProducts )loader.load([jsAssets.productComplementaryProducts]).finally(() => {});
        if ( this.dataset.productPickupAvailability )loader.load([jsAssets.productPickupAvailability]).finally(() => {});

				loader.load([jsAssets.flickity]).finally(() => {
					loader.load([jsAssets.product]).finally(() => {
						WAU.Quickshop.getTemplate(productUrl, singleVariant, event.target);
					});
				});

      });
    });

		// TODO: Merge into the above
		// Prefetch Quickviews
    document.querySelectorAll(selectors.quickviewButton).forEach(button => {
      if (!'IntersectionObserver' in window) return;
      const observer = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(button);
        WAU.Quickshop.prefetchQuickview(button);
      },
      {
        rootMargin: '0px 0px 200px 0px',
      });
      observer.observe(button);
    });

		// Open placeholder product on edit
		document.addEventListener("shopify:section:select", function(event) {
		  if (event.target.id != 'shopify-section-quickshop') return false;

			WAU.Quickshop.getOnboard();

		});
  },
	prefetchQuickview: async function({dataset}) {
    const { productUrl } = dataset;
    const cleanUrl = WAU.Quickshop.cleanUrl(productUrl);

    if (!WAU.Quickshop.cache.has(cleanUrl)) {
      const response = await fetch(productUrl);
      htmlText = await response.text();
      WAU.Quickshop.cache.set(cleanUrl, htmlText);
    }
  },
  formatTemplate: function formatTemplate(response) {
		const html = new DOMParser()
      .parseFromString(response, 'text/html')
      .getElementById('quickshopTemplate').innerHTML;

    return html;
  },
  showModal: function showModal(trigger) {
		trigger.setAttribute('data-wau-modal-target', 'quickview');
		trigger.classList.add('js-modal-open');

		WAU.Modal._openByName("modal-quickview");
  },
  hideModal: function hideModal() {
		document.querySelector('.js-quickview-content').innerHTML = '';

    WAU.Modal._closeByName("modal-quickview");
  },
	showDrawer: function showDrawer(trigger) {
		trigger.setAttribute('data-wau-slideout-target', 'quickview');
		trigger.setAttribute('data-slideout-direction', 'right');
		trigger.classList.add('js-slideout-open');

		WAU.Slideout._openByName("slideout-quickview");
	},
	hideDrawer: function hideDrawer() {
		document.querySelector('.js-quickview-content').innerHTML = '';

		WAU.Slideout._closeByName("slideout-quickview");
	},
  cleanUrl: function cleanUrl(url, key) {
    return url.split('?')[0] + '?view=quick';
  },
	getTemplate: async function getTemplate(url, singleVariant, trigger) {
		try {
			let htmlText;

      // Use cached HTML if available
      if (WAU.Quickshop.cache.has(url)) {
        htmlText = WAU.Quickshop.cache.get(url);
      } else {
        const response = await fetch(url);
        htmlText = await response.text();
      }

			let content = WAU.Quickshop.formatTemplate(htmlText);

			// Replace content
			document.querySelector('.js-quickview-content').innerHTML = content;

			// Set context
			const context = document.getElementById('quickview-form');

			// Load product js function
			Product(context);

			// Load Payment Buttons
			if (context.querySelector('.js-quickview-wrapper')) {
				if (
					context.querySelector('.js-quickview-wrapper').dataset.paymentButton == 'true' &&
					Shopify.PaymentButton
				) {
					Shopify.PaymentButton.init();
				}
			}

			// Trigger event for add to cart
			if (context.querySelector('.js-ajax-submit')) {
				context.querySelector('.js-ajax-submit').addEventListener('click', function (e) {
					e.preventDefault();

					var addToCartForm = this.closest('form');

					let cartConfig = document.getElementById('cart-config');
					if (!cartConfig) return false;
					cartConfig = JSON.parse(cartConfig.innerHTML || '{}');

					WAU.AjaxCart.addToCart(addToCartForm, null, cartConfig, true, false);

					return false;
				});
			}

			let type = context.dataset.quickshopType,
				quickAdd = context.dataset.quickshopAdd === 'true';

			if (quickAdd === true && singleVariant === true) {
				// Add to cart if single variant and quick add is enabled
				var addToCartForm = context.querySelector('.js-product-form-quickshop');

				let cartConfig = document.getElementById('cart-config');
				if (!cartConfig) return false;
				cartConfig = JSON.parse(cartConfig.innerHTML || '{}');

				trigger.classList.add('js-quick-adding');

				WAU.AjaxCart.addToCart(addToCartForm, null, cartConfig, true, true, trigger);

				trigger.classList.remove('loading-quickshop');
			} else {
				// Open quick shop
				if (type === 'modal') {
					WAU.Quickshop.showModal(trigger);
				} else {
					WAU.Quickshop.showDrawer(trigger);
				}
				trigger.classList.remove('loading-quickshop');
			}
		} catch (error) {
			console.log(error);
		}
	},
	getOnboard: function getOnboard() {

		const template = document.querySelector('.js-quickview-onboard');

		if (!template) {
			console.error('Error. No quickview onboard element.');
			return false;
		}

		const content = template.content.cloneNode(true);

		if (!content) {
			console.error('Error. No quickview onboard content.');
			return false;
		}

		const quickviewContent = document.querySelector('.js-quickview-content');

		if (!quickviewContent) {
			console.error('Error. No quickview content element.');
			return false;
		}

		quickviewContent.innerHTML = '';

		quickviewContent.appendChild(content);

		let type = template.dataset.quickshopType,
				trigger = document.querySelector('.js-quickview-onboard-trigger');

		if ( type == 'modal' ) {

			if (document.body.classList.contains('slideout-right--open')) document.body.classList.remove('slideout-right--open');
			WAU.Quickshop.showModal(trigger);

		} else {
			if (document.body.classList.contains('modal--open')) document.body.classList.remove('modal--open');
			WAU.Quickshop.showDrawer(trigger);
		}

	}
}

document.addEventListener('DOMContentLoaded', function() {
  WAU.Quickshop.init();
});

document.addEventListener('shopify:section:select', function(event){
  WAU.Quickshop.init();
});
