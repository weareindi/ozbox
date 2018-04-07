import Template from '../html/template.html';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * OzBox
 */
export class OzBox {
    /**
     * Constructor
     * @param {object} options User defined overrides
     */
    constructor(options) {
        this.settings = Object.assign({
            'selector': '[data-ozbox]',
            'groupNameAttribute': 'data-ozbox',
            'customImgSrcAttribute': 'data-ozbox-src'
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
        document.body.insertAdjacentHTML('beforeend', Template);
    }

    /**
     * Register Template Elements
     */
    registerElements() {
        this.elements = {};

        // Surface
        this.elements.surface = document.querySelector('.ozbox');

        // Window
        this.elements.window = document.querySelector('.ozbox__window');

        // Ajax Loader
        this.elements.loader = document.querySelector('.ozbox__loader');

        // Image Container Element
        this.elements.image = document.querySelector('.ozbox__image');

        // Img Element
        this.elements.img = document.querySelector('.ozbox__img');

        // Buttons
        this.elements.buttons = {};
        this.elements.buttons.close = document.querySelector('.ozbox-button--close');
        this.elements.buttons.previous = document.querySelector('.ozbox-button--previous');
        this.elements.buttons.next = document.querySelector('.ozbox-button--next');
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
     * This allows ozbox elements to be inserted into the DOM at any time not
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
     * 'data-ozbox' attribute
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
     * Show Ozbox
     */
    show() {
        this.elements.surface.setAttribute('data-active', true);
    }

    /**
     * Hide Ozbox
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
