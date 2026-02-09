const PADDING = 10;
let activeHotspot = null;

// Handle product popup adjusts the product's position
// based on if it goes out of bounds or not.
const handleProductPopup = event => {
    event.preventDefault();
    event.stopPropagation();

    // Get event target.
    let target = event.target;

    // Bail if there is no event target.
    if (!target) {
        return false;
    }

    // Bail if document element
    if (target.nodeName === '#document') {
        return false;
    }

    // Bail if target is not a hotspot
    if (!target.matches('.hotspot')) {
        return false;
    }

    // Get child product.
    let product = target.querySelector('.product-hotspot');
    let overlay = document.querySelector('.shop-the-look-overlay');

    // Check if this hotspot is already active
    const isAlreadyActive = product.classList.contains('active');

    // Close all other hotspots
    closeAllHotspots();

    // If this hotspot wasn't active before, open it
    if (!isAlreadyActive) {
        product.classList.add('active');
        activeHotspot = target;

        if (window.innerWidth < 768) {
            target.classList.add('active-mobile');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('shop-the-look-active');

            // Populate mobile popup
            let mobilePopup = document.querySelector('.shop-the-look-mobile-popup');
            if (mobilePopup) {
                mobilePopup.innerHTML = product.outerHTML;
                mobilePopup.classList.add('active');
            }
        } else {
            // Desktop positioning logic
            product.style.transform = ''; // Reset any previous transform

            // Use helper method to determine if it is out of bounds
            let isOut = WAU.Helpers.isOutOfBounds(product);

            let translateX = 0;
            let translateY = 0;

            if (isOut.left) {
                translateX = Math.round(Math.abs(isOut.leftAmount)) + PADDING;
            } else if (isOut.right) {
                translateX = (Math.round(isOut.rightAmount) + (PADDING * 2)) * -1;
            }

            // Check if it overflows the container (.stl__image)
            let container = target.closest('.stl__image');
            if (container) {
                let containerRect = container.getBoundingClientRect();
                let productRect = product.getBoundingClientRect();

                // Check bottom overflow
                if (productRect.bottom > containerRect.bottom) {
                    let offBottom = productRect.bottom - containerRect.bottom;
                    translateY = (offBottom + PADDING) * -1;
                }

                // Check top overflow (in case it's pushed too far up or hotspot is near top)
                if (productRect.top + translateY < containerRect.top) {
                    let offTop = containerRect.top - (productRect.top + translateY);
                    translateY += offTop + PADDING;
                }
            }

            // Apply calculated transforms
            product.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    } else {
        activeHotspot = null;
    }
};

// Close all hotspots
const closeAllHotspots = () => {
    const allProducts = document.querySelectorAll('.product-hotspot');
    const allHotspots = document.querySelectorAll('.hotspot');
    const overlay = document.querySelector('.shop-the-look-overlay');

    allProducts.forEach(product => {
        product.classList.remove('active');
        product.style.transform = '';
    });

    allHotspots.forEach(hotspot => {
        hotspot.classList.remove('active-mobile');
    });

    if (overlay) overlay.classList.remove('active');

    const mobilePopup = document.querySelector('.shop-the-look-mobile-popup');
    if (mobilePopup) {
        mobilePopup.classList.remove('active');
        mobilePopup.innerHTML = '';
    }

    document.body.classList.remove('shop-the-look-active');
};

// Handle click outside to close hotspots
const handleOutsideClick = (event) => {
    let overlay = document.querySelector('.shop-the-look-overlay');
    if (activeHotspot && (!activeHotspot.contains(event.target) || event.target === overlay)) {
        closeAllHotspots();
        activeHotspot = null;
    }
};

// Get all the hotspots in the section container.
let hotspots = document.querySelectorAll('.hotspot');

// Check if there are hotspots
if (hotspots.length > 0) {
    // Apply event listeners to all of them
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', handleProductPopup);
    });

    // Add click outside listener
    document.addEventListener('click', handleOutsideClick);

    WAU.Quickshop.init();
};
