class AdminBlog {
    build() {
        if (!window.helper.getUrlWord('admin/blog')) return;

        CKEDITOR.replace('fieldContent', {});
        CKEDITOR.config.basicEntities = false;
        CKEDITOR.config.entities_greek = false;
        CKEDITOR.config.entities_latin = false;
        CKEDITOR.config.entities_additional = '';

        this.update();
        this.buildMenu();
        this.buildMenuTable();
        this.buildMenuThumbnail();
        url.watch(this.elFormFieldTitle, this.elFormFieldUrl);
    }

    buildMenu() {
        this.elButtonRegister.onclick = () => {
            if (!this.validateForm()) return;
            this.isEdit ? this.editSave() : this.saveContent();
        };
    }

    buildMenuThumbnail() {
        const elTarget = this.elContentEditThumbnail.querySelectorAll('.table');

        Array.prototype.forEach.call(elTarget, (table) => {
            this.buildMenuThumbnailButton(table);
        });
    }

    buildMenuThumbnailButton(table) {
        const elButton = table.querySelectorAll('[data-action="edit"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                window.modal.buildModal('ajax', url.getController({
                    'folder': 'admin',
                    'file': 'BlogThumbnail'
                }), 'eb');
            };
        });
    }

    buildMenuTableActive(table) {
        const elButton = table.querySelectorAll('[data-action="inactivate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                window.modal.buildModal({
                    'kind': 'confirmation',
                    'content': globalTranslation.confirmationInactivate,
                    'size': 'small',
                    'click': `window.adminBlog.modify(${item.getAttribute('data-id')}, 'inactivate')`
                });
            };
        });
    }

    buildMenuTableInactive(table) {
        const elButton = table.querySelectorAll('[data-action="activate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                this.modify(item.getAttribute('data-id'), 'activate');
            };
        });
    }

    buildMenuTableDefault(table) {
        const elButtonEdit = table.querySelectorAll('[data-action="edit"]');
        const elButtonDelete = table.querySelectorAll('[data-action="delete"]');

        Array.prototype.forEach.call(elButtonEdit, (item) => {
            item.onclick = () => {
                this.editId = item.getAttribute('data-id');
                this.editLoadData(this.editId);
            };
        });

        Array.prototype.forEach.call(elButtonDelete, (item) => {
            item.onclick = () => {
                window.modal.buildModal({
                    'kind': 'confirmation',
                    'content': globalTranslation.confirmationDelete,
                    'size': 'small',
                    'click': `window.adminBlog.delete(${item.getAttribute('data-id')})`
                });
            };
        });
    }

    buildMenuTable() {
        const elTable = this.elContentList.querySelectorAll('.table');
        const elTableActive = this.elContentList.querySelectorAll('[data-id="tableActive"]');
        const elTableInactive = this.elContentList.querySelectorAll('[data-id="tableInactive"]');

        Array.prototype.forEach.call(elTableActive, (table) => {
            this.buildMenuTableActive(table);
        });

        Array.prototype.forEach.call(elTableInactive, (table) => {
            this.buildMenuTableInactive(table);
        });

        Array.prototype.forEach.call(elTable, (table) => {
            this.buildMenuTableDefault(table);
        });
    }

    buildParameter() {
        const thumbnail = this.thumbnail === this.thumbnailDefault ? '' : this.thumbnail;
        const parameter =
            `&title=${this.elFormFieldTitle.value}` +
            `&url=${this.elFormFieldUrl.value}` +
            `&content=${this.elCkEditor.getData()}` +
            `&datePost=${this.elFormFieldDatePost.value}` +
            `&dateEdit=${this.elFormFieldDateEdit.value}` +
            `&authorId=${this.elFormFieldAuthor.value}` +
            `&thumbnail=${thumbnail}` +
            `&tag=${this.elFormFieldTag.value}`;

        return parameter;
    }

    delete(id) {
        const url = url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        const parameter =
            '&action=doDelete' +
            '&id=' + id +
            '&token=' + globalToken;
        let ajax = new XMLHttpRequest();

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    editSave() {
        const self = this;
        const url = url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        const parameter =
            '&action=doUpdate' +
            '&id=' + self.editId +
            this.buildParameter() +
            '&token=' + globalToken;
        let ajax = new XMLHttpRequest();

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    editLoadData(id) {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        let parameter =
            '&action=' + 'editLoadData' +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                let obj = JSON.parse(ajax.responseText);

                document.documentElement.scrollTop = 0;
                self.isEdit = true;
                self.editFillField(obj);
                self.thumbnail = obj['thumbnail'].trim();
                self.modifyThumbnail();
            }
        };

        ajax.send(parameter);
    }

    editFillField(obj) {
        const datePost = obj['date_post_' + globalLanguage];
        const dateEdit = obj['date_edit_' + globalLanguage];

        this.elFormFieldTitle.value = obj['title_' + globalLanguage];
        this.elFormFieldUrl.value = obj['url_' + globalLanguage];
        this.elFormFieldTag.value = obj['tag_' + globalLanguage];
        this.elFormFieldDatePost.value = datePost !== null ? datePost.substring(0, 10) : datePost;
        this.elFormFieldDateEdit.value = dateEdit !== null ? dateEdit.substring(0, 10) : dateEdit;
        this.editId = obj['id'];
        this.elFormFieldAuthor.value = obj['author_id'];

        this.elCkEditor.setData(obj['content_' + globalLanguage], () => {
            this.checkDirty();
        });
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        let parameter =
            '&action=doModify' +
            '&status=' + status +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    modifyThumbnail() {
        const elImage = this.elThumbnailWrapper.querySelector('table').querySelector('[data-id="thumbnail"]');
        const elName = this.elThumbnailWrapper.querySelector('table').querySelector('[data-id="name"]');

        if (this.thumbnail === '' || this.thumbnail === null) {
            this.thumbnail = this.thumbnailDefault;
            this.pathImage = '';
        } else {
            this.pathImage = this.pathThumbnail;
        }

        elImage.setAttribute('src', 'assets/img/' + this.pathImage + this.thumbnail);
        elName.innerHTML = this.thumbnail;
    }

    saveContent() {
        const url = url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        const parameter =
            '&action=doSave' +
            this.buildParameter() +
            '&token=' + globalToken;
        let ajax = new XMLHttpRequest();

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    selectImage(target) {
        const elCard = target.parentNode.parentNode;
        const imageName = elCard.querySelector('[data-id="imageName"]').innerText;

        this.thumbnail = imageName;
        window.modal.closeModal();
        this.modifyThumbnail();
    }

    update() {
        this.elPage = document.querySelector('#pageAdminBlog');
        this.elContentEdit = document.querySelector('#pageAdminBlogEdit');
        this.elContentEditThumbnail = this.elContentEdit.querySelector('[data-id="thumbnailWrapper"]');
        this.elContentList = document.querySelector('#pageAdminBlogList');
        this.elFormRegister = this.elContentEdit.querySelector('[data-id="formRegister"]');
        this.elFormFieldTitle = this.elContentEdit.querySelector('[data-id="fieldTitle"]');
        this.elFormFieldUrl = this.elContentEdit.querySelector('[data-id="fieldUrl"]');
        this.elFormFieldContent = this.elContentEdit.querySelector('[data-id="fieldContent"]');
        this.elFormFieldTag = this.elContentEdit.querySelector('[data-id="fieldTag"]');
        this.elFormFieldDatePost = this.elContentEdit.querySelector('[data-id="fieldDatePost"]');
        this.elFormFieldDateEdit = this.elContentEdit.querySelector('[data-id="fieldDateEdit"]');
        this.elThumbnailWrapper = this.elContentEdit.querySelector('[data-id="thumbnailWrapper"]');
        this.elFormFieldAuthor = document.querySelector('[data-id="author"]');
        this.elCkEditor = CKEDITOR.instances.fieldContent;
        this.elButtonRegister = this.elPage.querySelector('#btRegister');

        this.isEdit = false;
        this.editId = 0;
        this.thumbnail = '';
        this.thumbnailDefault = 'blog-thumbnail.jpg';
        this.pathImage = '';
        this.pathThumbnail = 'dynamic/blog/thumbnail/';
    }

    validateForm() {
        const arrField = [
            this.elFormFieldTitle,
            this.elFormFieldUrl
        ];

        return window.form.validateEmpty(arrField);
    }
}

export {
    AdminBlog
};