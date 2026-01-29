console.log("complementary-products.js script loaded");

if (!customElements.get("complementary-products")) {
  customElements.define(
    "complementary-products",
    class ComplementaryProducts extends HTMLElement {
      observer = undefined;

      constructor() {
        super();
      }

      connectedCallback() {
        this.element = this.querySelector(".js-complementary-products");

        this.observer?.unobserve(this);
        this.observer = new IntersectionObserver((entries, observer) => {
          if (!entries[0].isIntersecting) return;
          this.loadComplementaryProducts(this.element);
          observer.unobserve(this);
        },
        {
          rootMargin: '0px 0px 400px 0px'
        });
        this.observer.observe(this);
      }

      loadComplementaryProducts(element) {

        // Bail if no element.
        if (element === null) return

        // Read product id from data attribute
        const { productId, sectionId, limit, intent, baseUrl } = element.dataset;

        const complementarySectionUrl = `${baseUrl}?section_id=${sectionId}&product_id=${productId}&limit=${limit}&intent=${intent}`;

        fetch(complementarySectionUrl)
          .then((response) => response.text())
          .then((text) => {
            const html = document.createElement("div");
            html.innerHTML = text;
            const recommendations = html.querySelector(
              ".js-complementary-products"
            );

            if (recommendations && recommendations.innerHTML.trim().length) {
              element.innerHTML = recommendations.innerHTML;
            }

            WAU.Quickshop.init();
          })
          .catch((error) => {
            console.log(error);
          });
      };
    }
  );
}
