import template from '../html/template.html';

export class OzBox {
    constructor() {
        this.appendTemplate();
        this.registerDomListener();
    }

    appendTemplate() {
        document.body.insertAdjacentHTML('beforeend', template);
    }

    registerDomListener() {
        const mutationObserver = new MutationObserver(() => {
            this.getElements();
            this.binds();
        });

        mutationObserver.observe(document, {
            attributes: true,
            childList: true,
            characterData: false,
            subtree: true
        });
    }

    getElements() {
        this.elements = document.querySelectorAll('[data-ozbox]');
    }

    binds() {
        for (var i = 0; i < self.elements.length; i++) {
            // Skip if event already defined
            if (self.elements[i].eventRegistered) {
                continue;
            }

            // Add click event
            self.elements.addEventListener('click', (event) => {
                event.preventDefault();
            });

            // Save var to indicate click event is present
            self.elements.eventRegistered = true;
        }
    }
}
