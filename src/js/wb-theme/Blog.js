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