class WbBlog {
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
        let url = objWbUrl.getController({
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

window.objWbBlog = new WbBlog();