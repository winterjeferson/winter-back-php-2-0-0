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

        this.$btBlog = this.elPage.querySelector('[data-id="btAdminBlog"]');
        this.$btUpload = this.elPage.querySelector('[data-id="btAdminImage"]');
        this.$btLogout = this.elPage.querySelector('[data-id="btAdminLogout"]');
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
        let td = document.querySelectorAll('.td-wrapper');
        let currentClass = 'td-wrapper-auto';

        Array.prototype.forEach.call(td, function (item) {
            item.onclick = function () {
                if (item.classList.contains(currentClass)) {
                    item.classList.remove(currentClass);
                } else {
                    item.classList.add(currentClass);
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

window.admin = new Admin();
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
                    window.modal.buildModal('ajax', window.url.getController({
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
                    window.modal.buildModal('confirmation', globalTranslation.confirmationInactivate);
                    window.modal.buildContentConfirmationAction('window.adminBlog.modify(' + item.getAttribute('data-id') + ', "inactivate")');
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
                    window.modal.buildModal('confirmation', globalTranslation.confirmationDelete);
                    window.modal.buildContentConfirmationAction('window.adminBlog.delete(' + item.getAttribute('data-id') + ')');
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
        window.modal.closeModal();
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
        window.url.watch(this.elFormFieldTitle, this.elFormFieldUrl);
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
        let url = window.url.getController({
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
        let url = window.url.getController({
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
        let url = window.url.getController({
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
        let url = window.url.getController({
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
        let url = window.url.getController({
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

window.adminPage = new AdminPage();
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
        const self = this;
        let elButtonDelete = document.querySelectorAll('[data-action="delete"]');

        this.elButtonUploadThumbnail.addEventListener('click', () => {
            self.upload(this, 'blog/thumbnail/');
        });

        this.elButtonUploadBanner.addEventListener('click', () => {
            self.upload(this, 'blog/banner/');
        });

        Array.prototype.forEach.call(elButtonDelete, function (item) {
            item.onclick = function () {
                self.deleteImage(item);
            };
        });
    }

    deleteImage(button) {
        this.deleteElement = button;

        window.modal.buildModal('confirmation', globalTranslation.confirmationDelete);
        window.modal.buildContentConfirmationAction('window.adminUploadImage.deleteImageAjax()');
    }

    deleteImageAjax() {
        const self = this;
        const data = new FormData();
        const ajax = new XMLHttpRequest();
        let file = this.deleteElement.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-id="fileName"]').innerText;
        let path = this.deleteElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-path');
        let $return = this.deleteElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

        data.append('f', file);
        data.append('p', path);
        data.append('token', globalToken);

        ajax.open('POST', window.url.getController({
            'folder': 'admin',
            'file': 'ImageDelete'
        }));

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.buildResponse(ajax.responseText, $return);
                window.modal.closeModal();
            }
        };

        ajax.send(data);
    }

    upload(target, path) {
        const self = this;
        const elForm = target.parentNode.parentNode.parentNode.parentNode.parentNode;
        const elFile = elForm.querySelector('[type=file]');
        const data = new FormData();
        const ajax = new XMLHttpRequest();
        const file = elFile.files[0];
        const url = window.url.getController({
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

    buildResponse(response, $target) {
        switch (response) {
            case 'fileDeleted':
            case 'uploadDone':
                objWfNotification.add(globalTranslation[response], 'green', $target);
                document.location.reload();
                break;
            default:
                objWfNotification.add(globalTranslation[response], 'red', $target);
                break;
        }
    }
}

window.adminUploadImage = new AdminUploadImage();
class AdminUser {
    build() {
        if (!window.helper.getUrlWord('admin/user')) return;

        this.updateVariable();
        this.buildMenu();
        this.buildMenuTable();
    }

    buildParameter() {
        return '' +
            '&name=' + this.elFormFieldName.value +
            '&email=' + this.elFormFieldEmail.value +
            '&permission=' + this.elFormFieldPermission.value +
            '&password=' + this.elFormFieldPassword.value;
    }

    buildMenu() {
        this.elFormSend.onclick = () => {
            if (!this.validateForm()) return;

            if (this.isEdit) {
                this.editSave();
            } else {
                this.saveContent();
            }
        };
    }

    buildMenuTableInactivate(table) {
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

    buildMenuTable() {
        let elTable = this.elPage.querySelectorAll('.table');
        let elTableActive = this.elPage.querySelectorAll('[data-id="tableActive"]');
        let elTableInactive = this.elPage.querySelectorAll('[data-id="tableInactive"]');

        Array.prototype.forEach.call(elTableActive, (table) => {
            this.buildMenuTableInactivate(table);
        });

        Array.prototype.forEach.call(elTableInactive, (table) => {
            this.buildMenuTableActivate(table);
        });

        Array.prototype.forEach.call(elTable, (table) => {
            this.buildMenuTableEdit(table);
            this.buildMenuTableDelete(table);
        });
    }

    buildMenuTableActivate(table) {
        const elButton = table.querySelectorAll('[data-action="activate"]');

        Array.prototype.forEach.call(elButton, (item) => {
            item.onclick = () => {
                this.modify(item.getAttribute('data-id'), 'activate');
            };
        });
    }

    buildMenuTableEdit(table) {
        const elButtonEdit = table.querySelectorAll('[data-action="edit"]');

        Array.prototype.forEach.call(elButtonEdit, (item) => {
            item.onclick = () => {
                this.editId = item.getAttribute('data-id');
                this.editLoadData(this.editId);
            };
        });
    }

    buildMenuTableDelete(table) {
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
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });
        let parameter =
            '&action=doDelete' +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
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
            'file': 'UserAjax'
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
                self.editFillField(obj);
            }
        };

        ajax.send(parameter);
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
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });
        let parameter =
            '&action=doUpdate' +
            '&id=' + self.editId +
            this.buildParameter() +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'UserAjax'
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
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    saveContent() {
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });
        let parameter =
            '&action=doSave' +
            this.buildParameter() +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                window.admin.showResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
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

window.adminUser = new AdminUser();
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
        if (this.elFieldLogin.value === '') {
            this.elFieldLogin.focus();
            this.buildLoginResponse('empty_email');
            return;
        }

        if (this.elFieldPassword.value === '') {
            this.elFieldPassword.focus();
            this.buildLoginResponse('empty_password');
            return;
        }

        return true;
    }

    buildLogin() {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = window.url.getController({
            'folder': 'admin',
            'file': 'LoginAjax'
        });
        let parameter =
            '&email=' + this.elFieldLogin.value +
            '&password=' + this.elFieldPassword.value +
            '&token=' + globalToken;

        if (!this.validate()) {
            return;
        }

        this.elButtonLogin.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.elButtonLogin.removeAttribute('disabled');
                self.buildLoginResponse(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    buildLoginResponse(data) {
        let response = '';

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
                window.url.build('admin');
                break;
        }

        window.notification.add({
            'text': response,
            'color': 'red'
        });
    }
}

window.login = new Login();
document.addEventListener('DOMContentLoaded', () => {
    window.login.build();
    window.admin.build();
    window.adminBlog.build();
    window.adminUploadImage.build();
    window.adminUser.build();
    window.adminPage.build();
});