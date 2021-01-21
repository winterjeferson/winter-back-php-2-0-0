class Admin {
    constructor() {
        this.pageCurrent = '';
    }

    build() {
        if (!window.helper.getUrlWord('admin')) {
            return;
        }

        this.updateVariable();
        this.buildMenuDifeneActive();
        this.builTableTdWrapper();
    }

    updateVariable() {
        this.elPage = document.querySelector('#mainContent');

        if (!document.contains(this.elPage)) return;

        this.elButtonBlog = this.elPage.querySelector('[data-id="btAdminBlog"]');
        this.elButtonUpload = this.elPage.querySelector('[data-id="btAdminImage"]');
        this.elButtonLogout = this.elPage.querySelector('[data-id="btAdminLogout"]');
    }

    buildMenuDifeneActive() {
        let classActive = 'menu-tab-active';
        let href = window.location.href;
        let split = href.split('/');
        let length = split.length;
        let target = split[length - 2];
        let capitalized = target.charAt(0).toUpperCase() + target.slice(1);
        let selector = document.querySelector('#mainContent [data-id="btAdmin' + capitalized + '"]');

        if (selector === null) {
            return;
        }

        selector.parentNode.classList.add(classActive);
    }

    builTableTdWrapper() {
        const cssWrapper = 'table-td-wrapper';
        const el = document.querySelectorAll(`.${cssWrapper}`);

        Array.prototype.forEach.call(el, (item) => {
            item.onclick = () => {
                if (item.classList.contains(cssWrapper)) {
                    item.classList.remove(cssWrapper);
                } else {
                    item.classList.add(cssWrapper);
                }
            };
        });
    }

    showResponse(data) {
        let color = '';
        let response = '';

        switch (data) {
            case 'done':
                location.reload();
                break;
            case 'problemPermission':
                color = 'red';
                response = globalTranslation.problemPermission;
            default:
                color = 'red';
                response = globalTranslation.errorAdministrator;
                break;
        }

        window.notification.add({
            'text': response,
            'color': color
        });
    }
}

export {
    Admin
};
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
        url.watch(this.elFormFieldTitle, this.elFormFieldUrl);
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

    buildMenu() {
        this.elButtonRegister.onclick = () => {
            if (!this.validateForm()) return;

            if (this.isEdit) {
                this.editSave();
            } else {
                this.saveContent();
            }
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

    validateForm() {
        const arrField = [
            this.elFormFieldTitle,
            this.elFormFieldUrl
        ];

        return window.form.validateEmpty(arrField);
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
}

export {
    AdminBlog
};
class AdminPage {
    build() {
        if (!window.helper.getUrlWord('admin/page')) {
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
        url.watch(this.elFormFieldTitle, this.elFormFieldUrl);
    }

    update() {
        this.elPage = document.querySelector('#pageAdminPageEdit');
        this.elCkEditor = CKEDITOR.instances.fieldContent;
        this.elContentList = document.querySelector('#pageAdminPageList');
        this.elFormFieldMenu = this.elPage.querySelector('[data-id="formFieldMenu"]');
        this.elFormFieldTitle = this.elPage.querySelector('[data-id="formFieldTitle"]');
        this.elFormFieldUrl = this.elPage.querySelector('[data-id="formFieldUrl"]');
        this.elButtonRegister = this.elPage.querySelector('#btRegister');

        this.isEdit = false;
        this.editId = 0;
    }

    buildMenu() {
        this.elButtonRegister.onclick = () => {
            if (!this.validateForm()) return;

            if (this.isEdit) {
                this.editSave();
            } else {
                this.saveContent();
            }
        };
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

    buildMenuTableActive(table) {
        let elButton = table.querySelectorAll('[data-action="inactivate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                window.modal.buildModal({
                    'kind': 'confirmation',
                    'content': globalTranslation.confirmationInactivate,
                    'size': 'small',
                    'click': `window.adminPage.modify(${item.getAttribute('data-id')}, "inactivate")`
                });
            };
        });
    }

    buildMenuTableInactive(table) {
        let elButton = table.querySelectorAll('[data-action="activate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                this.modify(item.getAttribute('data-id'), 'activate');
            };
        });
    }

    buildMenuTableDefault(table) {
        let elButtonEdit = table.querySelectorAll('[data-action="edit"]');
        let elButtonDelete = table.querySelectorAll('[data-action="delete"]');

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
                    'click': `window.adminPage.delete(${item.getAttribute('data-id')})`
                });
            };
        });
    }

    validateForm() {
        let arrField = [
            this.elFormFieldMenu,
            this.elFormFieldTitle
        ];

        return window.form.validateEmpty(arrField);
    }

    saveContent() {
        let ajax = new XMLHttpRequest();
        let url = url.getController({
            'folder': 'admin',
            'file': 'PageAjax'
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

    editSave() {
        const self = this;
        let ajax = new XMLHttpRequest();
        let url = url.getController({
            'folder': 'admin',
            'file': 'PageAjax'
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
        let url = url.getController({
            'folder': 'admin',
            'file': 'PageAjax'
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
            }
        };

        ajax.send(parameter);
    }

    editFillField(obj) {
        this.elFormFieldTitle.value = obj['title_' + globalLanguage];
        this.elFormFieldUrl.value = obj['url_' + globalLanguage];
        this.elFormFieldMenu.value = obj['menu_' + globalLanguage];
        this.editId = obj['id'];

        this.elCkEditor.setData(obj['content_' + globalLanguage], function () {
            this.checkDirty();
        });
    }

    buildParameter() {
        return '' +
            '&title=' + this.elFormFieldTitle.value +
            '&url=' + this.elFormFieldUrl.value +
            '&menu=' + this.elFormFieldMenu.value +
            '&content=' + this.elCkEditor.getData();
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = url.getController({
            'folder': 'admin',
            'file': 'PageAjax'
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
        let url = url.getController({
            'folder': 'admin',
            'file': 'PageAjax'
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
}

export {
    AdminPage
};
class AdminUploadImage {
    constructor() {
        this.deleteElement = '';
    }

    build() {
        if (!window.helper.getUrlWord('admin/image')) {
            return;
        }

        this.updateVariable();
        this.buildMenu();
    }

    updateVariable() {
        this.elButtonUploadThumbnail = document.querySelector('[data-id="btUploadThumbnail"]');
        this.elButtonUploadBanner = document.querySelector('[data-id="btUploadBanner"]');
    }

    buildMenu() {
        let elButtonDelete = document.querySelectorAll('[data-action="delete"]');

        this.elButtonUploadThumbnail.addEventListener('click', () => {
            this.upload(this.elButtonUploadThumbnail, 'blog/thumbnail/');
        });

        this.elButtonUploadBanner.addEventListener('click', () => {
            this.upload(this.elButtonUploadBanner, 'blog/banner/');
        });

        Array.prototype.forEach.call(elButtonDelete, (item) => {
            item.onclick = () => {
                this.deleteImage(item);
            };
        });
    }

    deleteImage(button) {
        this.deleteElement = button;

        window.modal.buildModal({
            'kind': 'confirmation',
            'content': globalTranslation.confirmationDelete,
            'size': 'small',
            'click': 'window.adminUploadImage.deleteImageAjax()'
        });
    }

    deleteImageAjax() {
        const self = this;
        const data = new FormData();
        const ajax = new XMLHttpRequest();
        const el = this.deleteElement.parentNode.parentNode.parentNode;
        let file = el.querySelector('[data-id="fileName"]').innerText;
        let path = el.parentNode.parentNode.getAttribute('data-path');
        let elReturn = el.parentNode.parentNode.parentNode.parentNode.parentNode;

        data.append('f', file);
        data.append('p', path);
        data.append('token', globalToken);

        ajax.open('POST', url.getController({
            'folder': 'admin',
            'file': 'ImageDelete'
        }));

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.buildResponse(ajax.responseText, elReturn);
                window.modal.closeModal();
            }
        };

        ajax.send(data);
    }

    upload(target, path) {
        const self = this;
        const elForm = target.parentNode.parentNode.parentNode;
        const elFile = elForm.querySelector('[type=file]');
        const data = new FormData();
        const ajax = new XMLHttpRequest();
        const file = elFile.files[0];
        const url = url.getController({
            'folder': 'admin',
            'file': 'ImageUpload'
        });

        if (elFile.files.length === 0) {
            elFile.click();
            return;
        }

        data.append('p', path);
        data.append('f', file);
        data.append('token', globalToken);

        this.elButtonUploadThumbnail.setAttribute('disabled', 'disabled');
        ajax.open('POST', url);

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.elButtonUploadThumbnail.removeAttribute('disabled');
                self.buildResponse(ajax.responseText, elForm);
            }
        };

        ajax.send(data);
    }

    buildResponse(response) {
        let color;

        switch (response) {
            case 'fileDeleted':
            case 'uploadDone':
                color = 'green';
                document.location.reload();
                break;
            default:
                color = 'red';
                break;
        }

        window.notification.add({
            'text': globalTranslation[response],
            color
        });
    }
}

export {
    AdminUploadImage
};
class AdminUser {
    build() {
        if (!window.helper.getUrlWord('admin/user')) return;

        this.updateVariable();
        this.buildMenu();
    }

    buildController() {
        const controller = wbUrl.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });

        return controller;
    }

    buildParameter() {
        const parameter =
            `&name=${this.elFormFieldName.value}` +
            `&email=${this.elFormFieldEmail.value}` +
            `&permission=${this.elFormFieldPermission.value}` +
            `&password=${this.elFormFieldPassword.value}`;

        return parameter;
    }

    buildMenu() {
        let elTable = this.elPage.querySelectorAll('.table');
        let elTableActive = this.elPage.querySelectorAll('[data-id="tableActive"]');
        let elTableInactive = this.elPage.querySelectorAll('[data-id="tableInactive"]');

        this.elFormSend.onclick = () => {
            if (!this.validateForm()) return;
            this.isEdit ? this.editSave() : this.saveContent();
        };

        Array.prototype.forEach.call(elTable, (item) => {
            this.buildMenuEdit(item);
            this.buildMenuDelete(item);
        });

        Array.prototype.forEach.call(elTableActive, (item) => {
            this.buildMenuInactivate(item);
        });

        Array.prototype.forEach.call(elTableInactive, (item) => {
            this.buildMenuActivate(item);
        });
    }

    buildMenuActivate(table) {
        const elButton = table.querySelectorAll('[data-action="activate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                this.modify(item.getAttribute('data-id'), 'activate');
            };
        });
    }

    buildMenuInactivate(table) {
        const elButton = table.querySelectorAll('[data-action="inactivate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                window.modal.buildModal({
                    'kind': 'confirmation',
                    'content': globalTranslation.confirmationInactivate,
                    'size': 'small',
                    'click': `window.adminUser.modify(${item.getAttribute('data-id')}, 'inactivate')`
                });
            };
        });
    }

    buildMenuEdit(table) {
        const elButtonEdit = table.querySelectorAll('[data-action="edit"]');

        Array.prototype.forEach.call(elButtonEdit, (item) => {
            item.onclick = () => {
                this.editId = item.getAttribute('data-id');
                this.editLoadData(this.editId);
            };
        });
    }

    buildMenuDelete(table) {
        const elButtonDelete = table.querySelectorAll('[data-action="delete"]');

        Array.prototype.forEach.call(elButtonDelete, (item) => {
            item.onclick = () => {
                window.modal.buildModal({
                    'kind': 'confirmation',
                    'content': globalTranslation.confirmationDelete,
                    'size': 'small',
                    'click': `window.adminUser.delete(${item.getAttribute('data-id')})`
                });
            };
        });
    }

    delete(id) {
        const parameter =
            '&action=doDelete' +
            `&id=${id}`;
        const obj = {
            controller: this.buildController(),
            parameter
        };
        let data = wbHelper.ajax(obj);

        data.then((result) => {
            admin.showResponse(result);
        });
    }

    editLoadData(id) {
        const parameter =
            '&action=editLoadData' +
            `&id=${id}`;
        const obj = {
            controller: this.buildController(),
            parameter
        };
        let data = wbHelper.ajax(obj);

        data.then((result) => {
            this.editLoadDataSuccess(result);
        });
    }

    editLoadDataSuccess(data) {
        let obj = JSON.parse(data);

        document.documentElement.scrollTop = 0;
        this.editFillField(obj);
    }

    editFillField(obj) {
        this.isEdit = true;
        this.elFormFieldName.value = obj['name'];
        this.elFormFieldEmail.value = obj['email'];
        this.elFormFieldPassword.value = '';
        this.editId = obj['id'];
        this.elFormFieldPermission.value = obj['permission'];
    }

    editSave() {
        const parameter =
            '&action=doUpdate' +
            `&id=${this.editId}` +
            this.buildParameter();
        const obj = {
            controller: this.buildController(),
            parameter
        };
        let data = wbHelper.ajax(obj);

        data.then((result) => {
            admin.showResponse(result);
        });
    }

    modify(id, status) {
        const parameter =
            '&action=doUpdate' +
            `&status=${status}` +
            `&id=${id}`;
        const obj = {
            controller: this.buildController(),
            parameter
        };
        let data = wbHelper.ajax(obj);

        data.then((result) => {
            admin.showResponse(result);
        });
    }

    saveContent() {
        const parameter =
            '&action=doSave' +
            this.buildParameter();
        const obj = {
            controller: this.buildController(),
            parameter
        };
        let data = wbHelper.ajax(obj);

        data.then((result) => {
            admin.showResponse(result);
        });
    }

    updateVariable() {
        this.isEdit = false;
        this.editId = 0;

        this.elPage = document.querySelector('#pageAdminUser');
        this.elForm = document.querySelector('#form');
        this.elFormFieldName = document.querySelector('#form_name');
        this.elFormFieldEmail = document.querySelector('#form_email');
        this.elFormFieldPassword = document.querySelector('#form_password');
        this.elFormFieldPermission = document.querySelector('#form_permission');
        this.elFormSend = document.querySelector('#form_button_send');
    }

    validateForm() {
        let arrField = [
            this.elFormFieldEmail,
            this.elFormFieldPassword
        ];

        return window.form.validateEmpty(arrField);
    }
}

export {
    AdminUser
};
class Login {
    build() {
        if (!window.helper.getUrlWord('login')) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        this.isSignUp = false;

        this.elPage = document.querySelector('#pageAdminLogin');
        this.elButtonLogin = document.querySelector('#pageAdminLoginBt');
        this.elFieldLogin = document.querySelector('#pageAdminLoginUser');
        this.elFieldPassword = document.querySelector('#pageAdminLoginPassword');
    }

    buildMenu() {
        this.elButtonLogin.addEventListener('click', () => {
            this.buildLogin();
        });
    }

    validate() {
        const arrField = [this.elFieldLogin, this.elFieldPassword];
        const validate = window.FormData.validateEmpty(arrField);

        if (validate) {
            return true;
        }
    }

    buildLogin() {
        const controller = wbUrl.getController({
            'folder': 'admin',
            'file': 'LoginAjax'
        });
        const parameter =
            `&email=${this.elFieldLogin.value}` +
            `&password=${this.elFieldPassword.value}`;
        const obj = {
            controller,
            parameter
        };
        let data = wbHelper.ajax(obj);

        data.then((result) => {
            this.buildLoginSuccess(result);
        });
    }

    buildLoginSuccess(data) {
        let response = '';

        this.elButtonLogin.removeAttribute('disabled');

        switch (data) {
            case 'inactive':
                response = globalTranslation.loginInactive;
                break;
            case 'problem':
                response = globalTranslation.loginFail;
                this.elFieldLogin.focus();
                break;
            case 'empty_email':
                response = globalTranslation.emptyField;
                this.elFieldLogin.focus();
                break;
            case 'empty_password':
                response = globalTranslation.emptyField;
                this.elFieldPassword.focus();
                break;
            default:
                wbUrl.buildUrl('admin');
                break;
        }

        window.notification.add({
            'text': response,
            'color': 'red'
        });
    }
}

export {
    Login
};
window.adminUser = new AdminUser();

const admin = new Admin();
const adminBlog = new AdminBlog();
const adminPage = new AdminPage();
const adminUploadImage = new AdminUploadImage();
const login = new Login();

document.addEventListener('DOMContentLoaded', () => {
    login.build();
    admin.build();
    adminBlog.build();
    adminUploadImage.build();
    adminUser.build();
    adminPage.build();
});