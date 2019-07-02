import ResizeObserver from 'resize-observer-polyfill';

/**
 * Ozbox
 */
class Ozbox {
    /**
     * Constructor
     * @param {object} options User defined overrides
     */
    constructor(options) {
        this.settings = Object.assign({
            'selector': '[ozbox]',
            'groupNameAttribute': 'ozbox',
            'customImgSrcAttribute': 'ozbox-src'
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
        <div class="ozbox" data-active="false">
            <div class="ozbox__background"></div>

            <div class="ozbox__nav">
                <div class="ozbox__buttons">
                    <div class="ozbox__button ozbox__button--previous">
                        <button class="ozbox-button ozbox-button--previous">
                            <span class="ozbox-button__icon">
                                <svg viewBox="0 0 22 36" style="background-color:#ffffff00" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                    <path d="M21 3.3L18.8 1 1 18l17.8 17 2.2-2.3L5.6 18 21 3.3zm0 0z"/>
                                </svg>
                            </span>
                            <span class="ozbox-button__text">Previous</span>
                        </button>
                    </div>
                    <div class="ozbox__button ozbox__button--next">
                        <button class="ozbox-button ozbox-button--next">
                            <span class="ozbox-button__icon">
                                <svg viewBox="0 0 22 36" style="background-color:#ffffff00" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                    <path d="M1 3.3L3.2 1 21 18 3.2 35 1 32.7 16.4 18 1 3.3zm0 0z"/>
                                </svg>
                            </span>
                            <span class="ozbox-button__text">Next</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="ozbox__container">
                <div class="ozbox__window">
                    <div class="ozbox__frame">
                        <div class="ozbox__loader">
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
                        <div class="ozbox__button ozbox__button--close">
                            <button class="ozbox-button ozbox-button--close">
                                <span class="ozbox-button__icon">
                                    <svg viewBox="0 0 18 18" style="background-color:#ffffff00" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                        <path d="M.5 1.6l7 6.8-.1.1-6.9 7 1 1 7-6.9 7 6.9 1-1-7-7h.1l6.9-7-1-1-7 6.9-7-6.9-1 1z" fill="#fff"/>
                                    </svg>
                                </span>
                                <span class="ozbox-button__text">Close</span>
                            </button>
                        </div>
                        <div class="ozbox__item">
                            <!--
                            <img class="ozbox__image">
                            <iframe class="ozbox__iframe" type="text/html" frameborder="0"></iframe>
                            -->
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
        this.elements.surface = document.querySelector('.ozbox');

        // Window
        this.elements.window = document.querySelector('.ozbox__window');

        // Ajax Loader
        this.elements.loader = document.querySelector('.ozbox__loader');

        // Item Container Element
        this.elements.item = document.querySelector('.ozbox__item');

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
            this.hideItem();
            this.hideClose();
            this.removeItem();
        });

        this.elements.buttons.previous.addEventListener('click', () => {
            this.changeImg('previous');
        });

        this.elements.buttons.next.addEventListener('click', () => {
            this.changeImg('next');
        });

        (new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                this.updateMaxDimensions(entry.contentRect.width, entry.contentRect.height);
                this.setMaxDimensions();
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
                this.loadItem();
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
        this.hideItem();
        this.removeItem();
        this.showLoader();
        this.loadItem();
    }

    updateMaxDimensions(width, height) {
        this.maxWidth = width;
        this.maxHeight = height;
    }

    /**
     * Set Img Element Max Dimensions it can grow to
     * @param {integer} width In Pixels
     * @param {integer} height In Pixels
     */
    setMaxDimensions() {
        const element = this.elements.item.querySelector('.ozbox__image, .ozbox__aspectRatio');

        if (!element) {
            return false;
        }

        element.style.maxWidth = (this.maxWidth + 'px');
        element.style.maxHeight = (this.maxHeight + 'px');
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
    removeItem() {
        this.elements.item.innerHTML = '';
    }

    /**
     * Add current image source to src value on img element
     */
    loadItem() {
        var src = this.groupImages[this.groupCurrentIndex];

        // Do YouTube
        if (this.isYoutube(src)) {
            return this.loadYouTube(src);
        }

        // Do image
        return this.loadImage(src);
        // return this.elements.image.setAttribute('src', src);
    }

    loadImage(src) {
        const element = document.createElement('img');
        element.className += 'ozbox__image';
        element.src = src;
        element.onload = () => {
            this.setMaxDimensions();
            this.hideLoader();
            this.showItem();
            this.showClose();
        }

        this.elements.item.appendChild(element);
    }

    /**
     * Show Image Container
     */
    showItem() {
        this.elements.item.setAttribute('data-active', true);
    }

    /**
     * Hide Image Container
     */
    hideItem() {
        this.elements.item.setAttribute('data-active', false);
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

    /**
     * Is supplied URL a known video url
     * @return {Boolean}
     */
    isYoutube(src) {
        var regExp = /\/\/.*?(youtube.com|youtu.be)/;
        var match = src.match(regExp);

        if (!match) {
            return false;
        }

        if (match.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * Get YouTube video ID
     * @param  {String} src A valid url
     * @return {[type]}     [description]
     */
    getYouTubeIDFromSrc(src) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = src.match(regExp);

        return (match&&match[7].length==11)? match[7] : false;
    }

    /**
     * Load Video
     * @param  {String} src A valid YouTube video url
     */
    loadYouTube(src) {
        var youtubeID = this.getYouTubeIDFromSrc(src);

        // Add placeholder div to control aspect ratio
        const placeholder = document.createElement('img');
        placeholder.className += 'ozbox__aspectRatio';
        placeholder.src = 'https://i1.ytimg.com/vi/'+ youtubeID +'/maxresdefault.jpg';
        this.elements.item.appendChild(placeholder);

        // Load iframe
        const iframe = document.createElement('iframe');
        iframe.className += 'ozbox__iframe';
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('allowfullscreen', 'allowfullscreen');
        iframe.src = 'https://www.youtube.com/embed/'+ youtubeID +'?modestbranding=1&autohide=1&controls=1&showinfo=0&showsearch=0&rel=0&iv_load_policy=0&autoplay=1&loop=0';
        iframe.onload = () => {
            this.setMaxDimensions();
            this.hideLoader();
            this.showItem();
            this.showClose();
        }
        this.elements.item.appendChild(iframe);
    }
}

module.exports.Ozbox = Ozbox;
