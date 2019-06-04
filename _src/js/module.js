/**
 * Lightbox
 */
class Lightbox {
    /**
     * Constructor
     * @param {object} options User defined overrides
     */
    constructor(options) {
        this.settings = Object.assign({
            'selector': '[lightbox]',
            'groupNameAttribute': 'lightbox',
            'customImgSrcAttribute': 'lightbox-src'
        }, options);

        this.appendTemplate();
        this.registerElements();
        this.registerTemplateBinds();
        this.populateDirectiveElements();
        this.registerDirectiveBinds();
        this.registerDomObserver();
    }

    /**
     * Inject template into DOM
     */
    appendTemplate() {
        const template = `
        <div class="lightbox" data-active="false">
            <div class="lightbox__background"></div>

            <div class="lightbox__nav">
                <div class="lightbox__buttons">
                    <div class="lightbox__button lightbox__button--previous">
                        <button class="lightbox-button lightbox-button--previous">
                            <span class="lightbox-button__icon">
                                <svg viewBox="0 0 22 36" style="background-color:#ffffff00" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                    <path d="M21 3.3L18.8 1 1 18l17.8 17 2.2-2.3L5.6 18 21 3.3zm0 0z"/>
                                </svg>
                            </span>
                            <span class="lightbox-button__text">Previous</span>
                        </button>
                    </div>
                    <div class="lightbox__button lightbox__button--next">
                        <button class="lightbox-button lightbox-button--next">
                            <span class="lightbox-button__icon">
                                <svg viewBox="0 0 22 36" style="background-color:#ffffff00" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                    <path d="M1 3.3L3.2 1 21 18 3.2 35 1 32.7 16.4 18 1 3.3zm0 0z"/>
                                </svg>
                            </span>
                            <span class="lightbox-button__text">Next</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="lightbox__container">
                <div class="lightbox__window">
                    <div class="lightbox__frame">
                        <div class="lightbox__loader">
                            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="rgba(255,255,255,0.75)" fill="rgba(0,0,0,0.5)">
                                    <circle cx="22" cy="22" r="1">
                                        <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                                    </circle>
                                    <circle cx="22" cy="22" r="1">
                                        <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                                    </circle>
                                </g>
                            </svg>
                        </div>
                        <div class="lightbox__button lightbox__button--close">
                            <button class="lightbox-button lightbox-button--close">
                                <span class="lightbox-button__icon">
                                    <svg viewBox="0 0 18 18" style="background-color:#ffffff00" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                        <path d="M.5 1.6l7 6.8-.1.1-6.9 7 1 1 7-6.9 7 6.9 1-1-7-7h.1l6.9-7-1-1-7 6.9-7-6.9-1 1z" fill="#fff"/>
                                    </svg>
                                </span>
                                <span class="lightbox-button__text">Close</span>
                            </button>
                        </div>
                        <div class="lightbox__image">
                            <img class="lightbox__img">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', template);
    }

    /**
     * Register Template Elements
     */
    registerElements() {
        this.elements = {};

        // Surface
        this.elements.surface = document.querySelector('.lightbox');

        // Window
        this.elements.window = document.querySelector('.lightbox__window');

        // Ajax Loader
        this.elements.loader = document.querySelector('.lightbox__loader');

        // Image Container Element
        this.elements.image = document.querySelector('.lightbox__image');

        // Img Element
        this.elements.img = document.querySelector('.lightbox__img');

        // Buttons
        this.elements.buttons = {};
        this.elements.buttons.close = document.querySelector('.lightbox-button--close');
        this.elements.buttons.previous = document.querySelector('.lightbox-button--previous');
        this.elements.buttons.next = document.querySelector('.lightbox-button--next');
    }

    /**
     * Register template level binds
     */
    registerTemplateBinds() {
        this.elements.buttons.close.addEventListener('click', () => {
            this.hide();
            this.hideImage();
            this.hideClose();
            this.removeImage();
        });

        this.elements.buttons.previous.addEventListener('click', () => {
            this.changeImg('previous');
        });

        this.elements.buttons.next.addEventListener('click', () => {
            this.changeImg('next');
        });

        this.elements.img.addEventListener('load', () => {
            this.hideLoader();
            this.showImage();
            this.showClose();
        });

        (new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                this.setMaxDimensions(entry.contentRect.width, entry.contentRect.height);
            }
        })).observe(this.elements.window);
    }

    /**
     * Register DOM observer
     * This allows lightbox elements to be inserted into the DOM at any time not
     * just on page load
     */
    registerDomObserver() {
        const domObserver = new MutationObserver(() => {
            this.populateDirectiveElements();
            this.registerDirectiveBinds();
        });

        domObserver.observe(document, {
            attributes: true,
            childList: true,
            characterData: false,
            subtree: true
        });
    }

    /**
     * Populate the directiveElements variable with elements that contain the
     * 'data-lightbox' attribute
     */
    populateDirectiveElements() {
        this.directiveElements = document.querySelectorAll(this.settings.selector);
    }

    /**
     * Regiser binds on directive elements
     */
    registerDirectiveBinds() {
        for (let i = 0; i < this.directiveElements.length; i++) {
            // Skip if event already defined
            if (this.directiveElements[i].eventsRegistered) {
                continue;
            }

            // Add click event
            this.directiveElements[i].addEventListener('click', (event) => {
                event.preventDefault();

                this.populateGroupImages(event.currentTarget);
                this.show();
                this.showLoader();
                this.loadImage();
            });

            // Save var to indicate click event is present
            this.directiveElements[i].eventsRegistered = true;
        }
    }

    /**
     * Populate group images array with provided sources
     * @param {element} element
     */
    populateGroupImages(element) {
        // Get group Name
        let groupName = false;
        if (element.getAttribute(this.settings.groupNameAttribute)) {
            groupName = element.getAttribute(this.settings.groupNameAttribute);
        }

        // Get selected element
        let groupElement = element;

        // Get group elements
        let groupElements = [groupElement];
        if (groupName) {
            const groupNodes = document.querySelectorAll(`[${this.settings.groupNameAttribute}="${groupName}"]`);
            groupElements = [].slice.call(groupNodes);
        }

        // Get group image srcs
        this.groupImages = [];
        for (let i = 0; i < groupElements.length; i++) {
            let src = groupElements[i].getAttribute('href');
            if (groupElements[i].getAttribute(this.settings.customImgSrcAttribute)) {
                src = groupElements[i].getAttribute(this.settings.customImgSrcAttribute);
            }
            this.groupImages.push(src);
        }

        // Find current element index in group
        this.groupCurrentIndex = 0;
        for (let i = 0; i < groupElements.length; i++) {
            if (groupElements[i] === groupElement) {
                this.groupCurrentIndex = i;
                break;
            }
        }

        // Set group size attribute
        this.elements.surface.setAttribute('data-group-size', groupElements.length);
    }

    /**
     * Change to adjacent image in group
     * @param {string} direction
     */
    changeImg(direction) {
        if (direction === 'previous') {
            let newIndex = (this.groupCurrentIndex - 1);
            if (this.groupCurrentIndex === 0) {
                newIndex = (this.groupImages.length - 1);
            }
            this.groupCurrentIndex = newIndex;
        }

        if (direction === 'next') {
            let newIndex = (this.groupCurrentIndex + 1);
            if (this.groupCurrentIndex === (this.groupImages.length - 1)) {
                newIndex = 0;
            }
            this.groupCurrentIndex = newIndex;
        }

        this.hideClose();
        this.hideImage();
        this.removeImage();
        this.showLoader();
        this.loadImage();
    }

    /**
     * Set Img Element Max Dimensions it can grow to
     * @param {integer} width In Pixels
     * @param {integer} height In Pixels
     */
    setMaxDimensions(width, height) {
        this.elements.img.style.maxWidth = (width + 'px');
        this.elements.img.style.maxHeight = (height + 'px');
    }

    /**
     * Show Lightbox
     */
    show() {
        this.elements.surface.setAttribute('data-active', true);
    }

    /**
     * Hide Lightbox
     */
    hide() {
        this.elements.surface.setAttribute('data-active', false);
    }

    /**
     * Show Loader
     */
    showLoader() {
        this.elements.loader.setAttribute('data-active', true);
    }

    /**
     * Hide Loader
     */
    hideLoader() {
        this.elements.loader.setAttribute('data-active', false);
    }

    /**
     * Remove src value from img element
     */
    removeImage() {
        this.elements.img.setAttribute('src', '');
    }

    /**
     * Add current image source to src value on img element
     */
    loadImage() {
        this.elements.img.setAttribute('src', this.groupImages[this.groupCurrentIndex]);
    }

    /**
     * Show Image Container
     */
    showImage() {
        this.elements.image.setAttribute('data-active', true);
    }

    /**
     * Hide Image Container
     */
    hideImage() {
        this.elements.image.setAttribute('data-active', false);
    }

    /**
     * Show Close Button
     */
    showClose() {
        this.elements.buttons.close.setAttribute('data-active', true);
    }

    /**
     * Hide Close Button
     */
    hideClose() {
        this.elements.buttons.close.setAttribute('data-active', false);
    }
}

module.exports.Lightbox = Lightbox;
