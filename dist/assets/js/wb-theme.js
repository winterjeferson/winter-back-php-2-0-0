class Blog {
    constructor() {
        this.classlaodMore = 'loadMore';
    }

    build() {
        if (!window.helper.getUrlWord('blog')) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        this.page = 'pageBlog';
        this.$lastPost = document.querySelector('#' + this.page + 'LastPost');
        this.$mostViewed = document.querySelector('#' + this.page + 'MostViewed');
    }

    buildMenu() {
        let self = this;

        if (!this.$lastPost) {
            return;
        }

        if (document.contains(this.$lastPost.querySelector('[data-id="' + this.classlaodMore + '"]'))) {
            this.$lastPost.querySelector('[data-id="' + this.classlaodMore + '"]').addEventListener('click', () => {
                self.loadMore(this);
            });
        }

        if (document.contains(this.$mostViewed.querySelector('[data-id="' + this.classlaodMore + '"]'))) {
            this.$mostViewed.querySelector('[data-id="' + this.classlaodMore + '"]').addEventListener('click', () => {
                self.loadMore(this);
            });
        }
    }

    loadMore(target) {
        let self = this;
        let parentId = target.parentNode.parentNode.parentNode.getAttribute('id');
        let parentIdString = parentId.substring(this.page.length);
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'blog',
            'file': 'LoadMore'
        });
        let parameter =
            '&target=' + parentIdString;

        target.classList.add('disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                target.classList.remove('disabled');
                self.loadMoreSuccess(parentId, ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    loadMoreSuccess(parentId, value) {
        let json = JSON.parse(value);
        let $section = document.querySelector('#' + parentId);
        let $sectionList = $section.querySelector('.blog-list');
        let $bt = $section.querySelector('[data-id="' + this.classlaodMore + '"]');

        if (!json[this.classlaodMore]) {
            $bt.classList.add('disabled');
        }

        $sectionList.insertAdjacentHTML('beforeend', json['html']);
        window.scrollTo(0, document.documentElement.scrollTop + 1);
        window.scrollTo(0, document.documentElement.scrollTop - 1);
    }
}

window.blog = new Blog();
class WBForm {
    build() {
        if (!window.helper.getUrlWord('form')) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        this.$page = document.querySelector('#pageForm');
        this.$form = this.$page.querySelector('.form');
        this.$formFieldEmail = this.$form.querySelector('[data-id="email"]');
        this.$formFieldMessage = this.$form.querySelector('[data-id="message"]');
        this.$btSend = this.$page.querySelector('#pageFormBtSend');
    }

    buildMenu() {
        const self = this;

        this.$btSend.addEventListener('click', () => {
            if (objWfForm.validateEmpty([self.$formFieldEmail, self.$formFieldMessage])) {
                self.send();
            }
        });
    }

    send() {
        const self = this;
        const ajax = new XMLHttpRequest();
        const url = window.url.getController({
            'folder': 'form',
            'file': 'FormAjax'
        });
        let parameter =
            '&method=sendForm' +
            '&data=' + JSON.stringify(self.getData()) +
            '&token=' + globalToken;

        this.$btSend.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.$btSend.removeAttribute('disabled');
                self.response(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    getData() {
        let arr = [];

        arr.push(this.$form.querySelector('[data-id="email"]').value);
        arr.push(this.$form.querySelector('[data-id="message"]').value);

        return arr;
    }

    response(data) {
        let response = '';
        let color = '';

        switch (data) {
            case 'ok':
                color = 'green';
                response = globalTranslation.formSent;
                break;
            default:
                color = 'red';
                response = globalTranslation.formProblemSend;
                break;
        }

        objWfNotification.add(response, color, this.$form);
    }
}

window.wbForm = new WBForm();
class WBTranslation {
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

window.wbTranslation = new WBTranslation();
class Url {
    buildSEO(url) {
        return url.toString() // Convert to string
            .normalize('NFD') // Change diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
            .replace(/\s+/g, '-') // Change whitespace to dashes
            .toLowerCase() // Change to lowercase
            .replace(/&/g, '-and-') // Replace ampersand
            .replace(/[^a-z0-9\-]/g, '') // Remove anything that is not a letter, number or dash
            .replace(/-+/g, '-') // Remove duplicate dashes
            .replace(/^-*/, '') // Remove starting dashes
            .replace(/-*$/, ''); // Remove trailing dashes
    }

    build(target) {
        window.location = globalUrl + globalLanguage + '/' + target + '/';
    }

    getController(obj) {
        return './application/controller/' + obj['folder'] + '/' + obj['file'] + '.php';
    }

    watch(fieldWatch, fieldReturn) {
        const self = this;

        fieldWatch.addEventListener('focusout', function () {
            fieldReturn.value = self.buildSEO(fieldWatch.value);
        });
    }
}

window.url = new Url();
window.addEventListener('load',
    window.wbTranslation.build(),
    window.blog.build(),
    window.wbForm.build(), {
        once: true
    });