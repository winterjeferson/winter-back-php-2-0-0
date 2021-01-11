class WbTranslation {
    build() {
        this.update();
        this.defineActive();
        this.buildMenu();
    }

    buildMenu() {
        this.$select.addEventListener('change', () => {
            let selected = this.selectedIndex;
            let value = this.options[selected].getAttribute('data-url');

            window.location.replace(value);
        });
    }

    defineActive() {
        this.$select.value = globalLanguage;
    }

    update() {
        this.$select = document.querySelector('#translationSelect');
    }
}

const objWbTranslation = new WbTranslation();