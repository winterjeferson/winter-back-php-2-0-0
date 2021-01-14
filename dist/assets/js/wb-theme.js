class Blog {
    constructor() {
        this.cssLoadMore = 'loadMore';
        this.cssLoadMoreSelector = `[data-id="${this.cssLoadMore}"]`;
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
        this.elLastPost = document.querySelector(`#${this.page}LastPost`);
        this.elMostViewed = document.querySelector(`#${this.page}MostViewed`);
    }

    buildMenu() {
        if (!this.elLastPost || !this.elMostViewed) return;

        const elButtonLastPost = this.elLastPost.querySelector(this.cssLoadMoreSelector);
        const elButtonMostViewed = this.elMostViewed.querySelector(this.cssLoadMoreSelector);

        if (document.contains(elButtonLastPost)) {
            elButtonLastPost.addEventListener('click', () => {
                this.loadMore(elButtonLastPost);
            });
        }

        if (document.contains(elButtonMostViewed)) {
            elButtonMostViewed.addEventListener('click', () => {
                this.loadMore(elButtonMostViewed);
            });
        }
    }

    loadMore(target) {
        let self = this;
        let id = target.parentNode.parentNode.getAttribute('id');
        let idString = id.substring(this.page.length);
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'blog',
            'file': 'LoadMore'
        });
        let parameter =
            '&target=' + idString;

        target.classList.add('disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                target.classList.remove('disabled');
                self.loadMoreSuccess(id, ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    loadMoreSuccess(id, value) {
        let json = JSON.parse(value);
        let elSection = document.querySelector('#' + id);
        let elSectionList = elSection.querySelector('.blog-list');
        let elButton = elSection.querySelector('[data-id="' + this.cssLoadMore + '"]');

        if (!json[this.cssLoadMore]) {
            elButton.classList.add('disabled');
        }

        elSectionList.insertAdjacentHTML('beforeend', json['html']);
        window.scrollTo(0, document.documentElement.scrollTop + 1);
        window.scrollTo(0, document.documentElement.scrollTop - 1);
    }
}

window.blog = new Blog();
class WBForm {
    build() {
        if (!window.helper.getUrlWord('form')) return;

        this.update();
        this.buildMenu();
    }

    update() {
        this.elPage = document.querySelector('#pageForm');
        this.elForm = this.elPage.querySelector('.form');
        this.elFormFieldEmail = this.elForm.querySelector('[data-id="email"]');
        this.elFormFieldMessage = this.elForm.querySelector('[data-id="message"]');
        this.elButtonSend = this.elPage.querySelector('#pageFormBtSend');
    }

    buildMenu() {
        const self = this;

        this.elButtonSend.addEventListener('click', () => {
            if (objWfForm.validateEmpty([self.elFormFieldEmail, self.elFormFieldMessage])) {
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

        this.elButtonSend.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.elButtonSend.removeAttribute('disabled');
                self.response(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    getData() {
        let arr = [];

        arr.push(this.elForm.querySelector('[data-id="email"]').value);
        arr.push(this.elForm.querySelector('[data-id="message"]').value);

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

        objWfNotification.add(response, color, this.elForm);
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
        this.elSelect.addEventListener('change', (item) => {
            const selected = item.target.options.selectedIndex;
            const elOption = item.target.options[selected];
            const value = elOption.getAttribute('data-url');

            window.location.replace(value);
        });
    }

    defineActive() {
        this.elSelect.value = globalLanguage;
    }

    update() {
        this.elSelect = document.querySelector('#translationSelect');
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
        return `./app/controller/${obj['folder']}/${obj['file']}.php`;
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