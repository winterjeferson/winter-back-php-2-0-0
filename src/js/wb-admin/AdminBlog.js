class AdminBlog {
    build() {
        if (!window.helper.getUrlWord('admin/blog')) {
            return;
        }

        CKEDITOR.replace('fieldContent', {});
        CKEDITOR.config.basicEntities = false;
        CKEDITOR.config.entities_greek = false;
        CKEDITOR.config.entities_latin = false;
        CKEDITOR.config.entities_additional = '';

        this.update();
        this.buildMenu();
        this.buildMenuTable();
        this.buildMenuThumbnail();
        window.url.watch(this.elFormFieldTitle, this.elFormFieldUrl);
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
        this.elButtonRegister = this.elPage.querySelector('[data-id="btRegister"]');

        this.isEdit = false;
        this.editId = 0;
        this.thumbnail = '';
        this.thumbnailDefault = 'blog-thumbnail.jpg';
        this.pathImage = '';
        this.pathThumbnail = 'dynamic/blog/thumbnail/';
    }

    buildMenu() {
        const self = this;

        this.elButtonRegister.onclick = () => {
            if (!self.validateForm()) {
                return;
            }

            if (self.isEdit) {
                self.editSave();
            } else {
                self.saveContent();
            }
        };
    }

    buildMenuThumbnail() {
        const $target = this.elContentEditThumbnail.querySelectorAll('.table');

        Array.prototype.forEach.call($target, function (table) {
            let $button = table.querySelectorAll('[data-action="edit"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('ajax', window.url.getController({
                        'folder': 'admin',
                        'file': 'BlogThumbnail'
                    }), 'eb');
                };
            });
        });
    }

    buildMenuTable() {
        const self = this;
        const $table = this.elContentList.querySelectorAll('.table');
        const $tableActive = this.elContentList.querySelectorAll('[data-id="tableActive"]');
        const $tableInactive = this.elContentList.querySelectorAll('[data-id="tableInactive"]');

        Array.prototype.forEach.call($tableActive, function (table) {
            let $button = table.querySelectorAll('[data-action="inactivate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationInactivate);
                    objWfModal.buildContentConfirmationAction('window.adminBlog.modify(' + item.getAttribute('data-id') + ', "inactivate")');
                };
            });
        });

        Array.prototype.forEach.call($tableInactive, function (table) {
            let $button = table.querySelectorAll('[data-action="activate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    self.modify(item.getAttribute('data-id'), 'activate');
                };
            });
        });

        Array.prototype.forEach.call($table, function (table) {
            let $buttonEdit = table.querySelectorAll('[data-action="edit"]');
            let $buttonDelete = table.querySelectorAll('[data-action="delete"]');

            Array.prototype.forEach.call($buttonEdit, function (item) {
                item.onclick = function () {
                    self.editId = item.getAttribute('data-id');
                    self.editLoadData(self.editId);
                };
            });

            Array.prototype.forEach.call($buttonDelete, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationDelete);
                    objWfModal.buildContentConfirmationAction('window.adminBlog.delete(' + item.getAttribute('data-id') + ')');
                };
            });
        });
    }

    editSave() {
        const self = this;
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        let parameter =
            '&action=doUpdate' +
            '&id=' + self.editId +
            this.buildParameter() +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    editLoadData(id) {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        let parameter =
            '&action=' + 'editLoadData' +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
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

        this.elCkEditor.setData(obj['content_' + globalLanguage], function () {
            this.checkDirty();
        });
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
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
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    delete(id) {
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        let parameter =
            '&action=doDelete' +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    validateForm() {
        let arrField = [
            this.elFormFieldTitle,
            this.elFormFieldUrl
        ];

        return objWfForm.validateEmpty(arrField);
    }

    buildParameter() {
        const thumbnail = this.thumbnail === this.thumbnailDefault ? '' : this.thumbnail;

        return '' +
            '&title=' + this.elFormFieldTitle.value +
            '&url=' + this.elFormFieldUrl.value +
            '&content=' + this.elCkEditor.getData() +
            '&datePost=' + this.elFormFieldDatePost.value +
            '&dateEdit=' + this.elFormFieldDateEdit.value +
            '&authorId=' + this.elFormFieldAuthor.value +
            '&thumbnail=' + thumbnail +
            '&tag=' + this.elFormFieldTag.value;
    }

    saveContent() {
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'BlogAjax'
        });
        let parameter =
            '&action=doSave' +
            this.buildParameter() +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    selectImage(target) {
        let elCard = target.parentNode.parentNode;
        let imageName = elCard.querySelector('[data-id="imageName"]').innerText;

        this.thumbnail = imageName;
        objWfModal.closeModal();
        this.modifyThumbnail();
    }

    modifyThumbnail() {
        let elImage = this.elThumbnailWrapper.querySelector('table').querySelector('[data-id="thumbnail"]');
        let elName = this.elThumbnailWrapper.querySelector('table').querySelector('[data-id="name"]');

        if (this.thumbnail === '' || this.thumbnail === null) {
            this.thumbnail = this.thumbnailDefault;
            this.pathImage = '';
        } else {
            this.pathImage = this.pathThumbnail;
        }

        elImage.setAttribute('src', 'assets/img/' + this.pathImage + this.thumbnail);
        elName.innerHTML = this.thumbnail;
    }
}

window.adminBlog = new AdminBlog();