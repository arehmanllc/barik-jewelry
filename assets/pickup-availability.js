class PickupAvailability extends HTMLElement {
  constructor() {

    super();

    this.variantId = this.dataset.variantId;
    this.productTitle = this.dataset.productTitle;
    this.hasOnlyDefaultVariant = (this.dataset.hasOnlyDefaultVariant === 'true') ? true : false;
    this.baseUrl = this.dataset.baseUrl;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);
        this.loadAvailability(this.variantId, this.productTitle);
      },
      {
        rootMargin: '0px 0px 200px 0px'
      });
      observer.observe(this);
    } else {
      this.loadAvailability(this.variantId, this.productTitle);
    }
  }

  /**
   * Set event emitter instance used in product script.
   * @param  {object} instance Event emitter instance.
   */
  set instance(instance) {
    if (!instance) return false;
    this.events = instance;
    this.handleEvents();
  }

  /**
   * Returns event emitter instance.
   * @return {object} The event emitter instance.
   */
  get instance() {
    return this.events;
  }

  handleEvents() {
    if (this.events) {
      this.events.on("storeavailability:variant", (id, title) => {
        this.loadAvailability(id, title)
      });

      this.events.on("storeavailability:unavailable", () => {
        this.style.display = 'none';
      });
    }
  }

  loadAvailability(id, title) {

    const container = this;
    const blockId = this.dataset.blockId;
    const variantSectionUrl = this.baseUrl + '/variants/' + id + '/?section_id=pickup-availability';
    container.innerHTML = '';
    const newStr = `store-availability--${blockId}`;

    fetch(variantSectionUrl)
    .then((response) => {
      return response.text();
    })
    .then((storeAvailabilityHTML) => {

      if (storeAvailabilityHTML.trim() === '') {
        console.warn('Error, no HTML content returned.');
        return;
      }

      container.innerHTML = storeAvailabilityHTML;
      container.innerHTML = container.firstElementChild.innerHTML;

      // Update buttons
      container.querySelectorAll('[popovertarget]')?.forEach((button) => {
        button.setAttribute('popovertarget', newStr);
      });

      // Update Slideout Id
      container.querySelector('[id^=store-availability--]')?.setAttribute('id', newStr);

      container.style.opacity = 1;

      container.style.display = "block";

      if ( document.querySelector('[data-pick-up-available="false"]') ) {
        container.style.display = "none";
        console.warn('Error. No pickup available with data attribute set to true.');
        return false;
      } else {
        container.style.visibility = "visible";
      }
    })
    .catch((error) => {
      console.warn(error);
    });

  }
}

customElements.define('pickup-availability', PickupAvailability);
