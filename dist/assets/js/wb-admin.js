class WbAdmin {
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
        this.$page = document.querySelector('#mainContent');

        if (!document.contains(this.$page)) {
            return;
        }

        this.$btBlog = this.$page.querySelector('[data-id="btAdminBlog"]');
        this.$btUpload = this.$page.querySelector('[data-id="btAdminImage"]');
        this.$btLogout = this.$page.querySelector('[data-id="btAdminLogout"]');
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
            }
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

        objWfNotification.add(response, color);
    }
}

const objWbAdmin = new WbAdmin();
class WbAdminBlog {
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
        objWbUrl.watch(this.$formFieldTitle, this.$formFieldUrl);
    }

    update() {
        this.isEdit = false;
        this.editId = 0;
        this.$page = document.querySelector('#pageAdminBlog');
        this.$contentEdit = document.querySelector('#pageAdminBlogEdit');
        this.$contentEditThumbnail = this.$contentEdit.querySelector('[data-id="thumbnailWrapper"]');
        this.$contentList = document.querySelector('#pageAdminBlogList');
        this.$formRegister = this.$contentEdit.querySelector('[data-id="formRegister"]');
        this.$formFieldTitle = this.$contentEdit.querySelector('[data-id="fieldTitle"]');
        this.$formFieldUrl = this.$contentEdit.querySelector('[data-id="fieldUrl"]');
        this.$formFieldContent = this.$contentEdit.querySelector('[data-id="fieldContent"]');
        this.$formFieldTag = this.$contentEdit.querySelector('[data-id="fieldTag"]');
        this.$formFieldDatePost = this.$contentEdit.querySelector('[data-id="fieldDatePost"]');
        this.$formFieldDateEdit = this.$contentEdit.querySelector('[data-id="fieldDateEdit"]');
        this.$thumbnailWrapper = this.$contentEdit.querySelector('[data-id="thumbnailWrapper"]');
        this.$formFieldAuthor = document.querySelector('[data-id="author"]');
        this.thumbnail = '';
        this.thumbnailDefault = 'blog-thumbnail.jpg';
        this.pathImage = '';
        this.pathThumbnail = 'dynamic/blog/thumbnail/';
        this.$ckEditor = CKEDITOR.instances.fieldContent;
        this.$btRegister = this.$page.querySelector('[data-id="btRegister"]');
    }

    buildMenu() {
        const self = this;

        this.$btRegister.onclick = function () {
            if (!self.validateForm()) {
                return;
            }

            if (self.isEdit) {
                self.editSave();
            } else {
                self.saveContent();
            }
        }
    }

    buildMenuThumbnail() {
        const $target = this.$contentEditThumbnail.querySelectorAll('.table');

        Array.prototype.forEach.call($target, function (table) {
            let $button = table.querySelectorAll('[data-action="edit"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('ajax', objWbUrl.getController({
                        'folder': 'admin',
                        'file': 'BlogThumbnail'
                    }), 'eb');
                }
            });
        });
    }

    buildMenuTable() {
        const self = this;
        const $table = this.$contentList.querySelectorAll('.table');
        const $tableActive = this.$contentList.querySelectorAll('[data-id="tableActive"]');
        const $tableInactive = this.$contentList.querySelectorAll('[data-id="tableInactive"]');

        Array.prototype.forEach.call($tableActive, function (table) {
            let $button = table.querySelectorAll('[data-action="inactivate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationInactivate);
                    objWfModal.buildContentConfirmationAction('objWbAdminBlog.modify(' + item.getAttribute('data-id') + ', "inactivate")');
                }
            });
        });

        Array.prototype.forEach.call($tableInactive, function (table) {
            let $button = table.querySelectorAll('[data-action="activate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    self.modify(item.getAttribute('data-id'), 'activate');
                }
            });
        });

        Array.prototype.forEach.call($table, function (table) {
            let $buttonEdit = table.querySelectorAll('[data-action="edit"]');
            let $buttonDelete = table.querySelectorAll('[data-action="delete"]');

            Array.prototype.forEach.call($buttonEdit, function (item) {
                item.onclick = function () {
                    self.editId = item.getAttribute('data-id');
                    self.editLoadData(self.editId);
                }
            });

            Array.prototype.forEach.call($buttonDelete, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationDelete);
                    objWfModal.buildContentConfirmationAction('objWbAdminBlog.delete(' + item.getAttribute('data-id') + ')');
                }
            });
        });
    }

    editSave() {
        const self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    editLoadData(id) {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                let obj = JSON.parse(ajax.responseText);

                document.documentElement.scrollTop = 0;
                self.isEdit = true;
                self.editFillField(obj);
                self.thumbnail = obj['thumbnail'].trim();
                self.modifyThumbnail();
            }
        }

        ajax.send(parameter);
    }

    editFillField(obj) {
        const datePost = obj['date_post_' + globalLanguage];
        const dateEdit = obj['date_edit_' + globalLanguage];

        this.$formFieldTitle.value = obj['title_' + globalLanguage];
        this.$formFieldUrl.value = obj['url_' + globalLanguage];
        this.$formFieldTag.value = obj['tag_' + globalLanguage];
        this.$formFieldDatePost.value = datePost !== null ? datePost.substring(0, 10) : datePost;
        this.$formFieldDateEdit.value = dateEdit !== null ? dateEdit.substring(0, 10) : dateEdit;
        this.editId = obj['id'];
        this.$formFieldAuthor.value = obj['author_id'];

        this.$ckEditor.setData(obj['content_' + globalLanguage], function () {
            this.checkDirty();
        });
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    delete(id) {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    validateForm() {
        let arrField = [
            this.$formFieldTitle,
            this.$formFieldUrl
        ];

        return objWfForm.validateEmpty(arrField);
    }

    buildParameter() {
        const thumbnail = this.thumbnail === this.thumbnailDefault ? '' : this.thumbnail;

        return '' +
            '&title=' + this.$formFieldTitle.value +
            '&url=' + this.$formFieldUrl.value +
            '&content=' + this.$ckEditor.getData() +
            '&datePost=' + this.$formFieldDatePost.value +
            '&dateEdit=' + this.$formFieldDateEdit.value +
            '&authorId=' + this.$formFieldAuthor.value +
            '&thumbnail=' + thumbnail +
            '&tag=' + this.$formFieldTag.value;
    }

    saveContent() {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    selectImage(target) {
        let $card = target.parentNode.parentNode;
        let imageName = $card.querySelector('[data-id="imageName"]').innerText;

        this.thumbnail = imageName;
        objWfModal.closeModal();
        this.modifyThumbnail();
    }

    modifyThumbnail() {
        let $image = this.$thumbnailWrapper.querySelector('table').querySelector('[data-id="thumbnail"]');
        let $name = this.$thumbnailWrapper.querySelector('table').querySelector('[data-id="name"]');

        if (this.thumbnail === '' || this.thumbnail === null) {
            this.thumbnail = this.thumbnailDefault;
            this.pathImage = '';
        } else {
            this.pathImage = this.pathThumbnail;
        }

        $image.setAttribute('src', 'assets/img/' + this.pathImage + this.thumbnail);
        $name.innerHTML = this.thumbnail;
    }
}

const objWbAdminBlog = new WbAdminBlog();
class WbAdminPage {
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
        objWbUrl.watch(this.$formFieldTitle, this.$formFieldUrl);
    }

    update() {
        this.isEdit = false;
        this.editId = 0;
        this.$page = document.querySelector('#pageAdminPageEdit');
        this.$ckEditor = CKEDITOR.instances.fieldContent;
        this.$contentList = document.querySelector('#pageAdminPageList');
        this.$formFieldMenu = this.$page.querySelector('[data-id="formFieldMenu"]');
        this.$formFieldTitle = this.$page.querySelector('[data-id="formFieldTitle"]');
        this.$formFieldUrl = this.$page.querySelector('[data-id="formFieldUrl"]');
        this.$btRegister = this.$page.querySelector('[data-id="btRegister"]');
    }

    buildMenu() {
        const self = this;

        this.$btRegister.onclick = function () {
            if (!self.validateForm()) {
                return;
            }

            if (self.isEdit) {
                self.editSave();
            } else {
                self.saveContent();
            }
        }
    }

    buildMenuTable() {
        const self = this;
        const $table = this.$contentList.querySelectorAll('.table');
        const $tableActive = this.$contentList.querySelectorAll('[data-id="tableActive"]');
        const $tableInactive = this.$contentList.querySelectorAll('[data-id="tableInactive"]');

        Array.prototype.forEach.call($tableActive, function (table) {
            let $button = table.querySelectorAll('[data-action="inactivate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationInactivate);
                    objWfModal.buildContentConfirmationAction('objWbAdminPage.modify(' + item.getAttribute('data-id') + ', "inactivate")');
                }
            });
        });

        Array.prototype.forEach.call($tableInactive, function (table) {
            let $button = table.querySelectorAll('[data-action="activate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    self.modify(item.getAttribute('data-id'), 'activate');
                }
            });
        });

        Array.prototype.forEach.call($table, function (table) {
            let $buttonEdit = table.querySelectorAll('[data-action="edit"]');
            let $buttonDelete = table.querySelectorAll('[data-action="delete"]');

            Array.prototype.forEach.call($buttonEdit, function (item) {
                item.onclick = function () {
                    self.editId = item.getAttribute('data-id');
                    self.editLoadData(self.editId);
                }
            });

            Array.prototype.forEach.call($buttonDelete, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationDelete);
                    objWfModal.buildContentConfirmationAction('objWbAdminPage.delete(' + item.getAttribute('data-id') + ')');
                }
            });
        });
    }

    validateForm() {
        let arrField = [
            this.$formFieldMenu,
            this.$formFieldTitle
        ];

        return objWfForm.validateEmpty(arrField);
    }

    saveContent() {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    editSave() {
        const self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    editLoadData(id) {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                let obj = JSON.parse(ajax.responseText);

                document.documentElement.scrollTop = 0;
                self.isEdit = true;
                self.editFillField(obj);
            }
        }

        ajax.send(parameter);
    }

    editFillField(obj) {
        this.$formFieldTitle.value = obj['title_' + globalLanguage];
        this.$formFieldUrl.value = obj['url_' + globalLanguage];
        this.$formFieldMenu.value = obj['menu_' + globalLanguage];
        this.editId = obj['id'];

        this.$ckEditor.setData(obj['content_' + globalLanguage], function () {
            this.checkDirty();
        });
    }

    buildParameter() {
        return '' +
            '&title=' + this.$formFieldTitle.value +
            '&url=' + this.$formFieldUrl.value +
            '&menu=' + this.$formFieldMenu.value +
            '&content=' + this.$ckEditor.getData()
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    delete(id) {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }
}

const objWbAdminPage = new WbAdminPage();
class WbAdminUploadImage {
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
        this.$btUploadThumbnail = document.querySelector('[data-id="btUploadThumbnail"]');
        this.$btUploadBanner = document.querySelector('[data-id="btUploadBanner"]');
    }

    buildMenu() {
        const self = this;
        let $buttonDelete = document.querySelectorAll('[data-action="delete"]');

        this.$btUploadThumbnail.addEventListener('click', function (event) {
            self.upload(this, 'blog/thumbnail/');
        });

        this.$btUploadBanner.addEventListener('click', function (event) {
            self.upload(this, 'blog/banner/');
        });

        Array.prototype.forEach.call($buttonDelete, function (item) {
            item.onclick = function () {
                self.deleteImage(item);
            }
        });
    }

    deleteImage(button) {
        this.deleteElement = button;

        objWfModal.buildModal('confirmation', globalTranslation.confirmationDelete);
        objWfModal.buildContentConfirmationAction('objWbAdminUploadImage.deleteImageAjax()');
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

        ajax.open('POST', objWbUrl.getController({
            'folder': 'admin',
            'file': 'ImageDelete'
        }));

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.buildResponse(ajax.responseText, $return);
                objWfModal.closeModal();
            }
        }

        ajax.send(data);
    }

    upload(target, path) {
        const self = this;
        const $form = target.parentNode.parentNode.parentNode.parentNode.parentNode;
        const $file = $form.querySelector('[type=file]');
        const data = new FormData();
        const ajax = new XMLHttpRequest();
        const file = $file.files[0];
        const url = objWbUrl.getController({
            'folder': 'admin',
            'file': 'ImageUpload'
        });

        if ($file.files.length === 0) {
            $file.click();
            return;
        }

        data.append('p', path);
        data.append('f', file);
        data.append('token', globalToken);

        this.$btUploadThumbnail.setAttribute('disabled', 'disabled');
        ajax.open('POST', url);

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.$btUploadThumbnail.removeAttribute('disabled');
                self.buildResponse(ajax.responseText, $form);
            }
        }

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

const objWbAdminUploadImage = new WbAdminUploadImage();
class WbAdminUser {
    build() {
        if (!window.helper.getUrlWord('admin/user')) {
            return;
        }

        this.updateVariable();
        this.buildMenu();
        this.buildMenuTable();
    }

    updateVariable() {
        this.isEdit = false;
        this.editId = 0;
        this.$page = document.querySelector('#pageAdminUser');
        this.$formRegister = this.$page.querySelector('[data-id="formRegister"]');
        this.$formFieldName = this.$formRegister.querySelector('[data-id="name"]');
        this.$formFieldEmail = this.$formRegister.querySelector('[data-id="email"]');
        this.$formFieldPassword = this.$formRegister.querySelector('[data-id="password"]');
        this.$formFieldPermission = this.$formRegister.querySelector('[data-id="permission"]');
        this.$formSend = this.$formRegister.querySelector('[data-id="send"]');
    }

    buildMenu() {
        const self = this;

        this.$formSend.onclick = function () {
            if (!self.validateForm()) {
                return;
            }

            if (self.isEdit) {
                self.editSave();
            } else {
                self.saveContent();
            }
        }
    }

    buildMenuTable() {
        let self = this;
        let $table = this.$page.querySelectorAll('.table');
        let $tableActive = this.$page.querySelectorAll('[data-id="tableActive"]');
        let $tableInactive = this.$page.querySelectorAll('[data-id="tableInactive"]');

        Array.prototype.forEach.call($tableActive, function (table) {
            let $button = table.querySelectorAll('[data-action="inactivate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationInactivate);
                    objWfModal.buildContentConfirmationAction('objWbAdminUser.modify(' + item.getAttribute('data-id') + ', "inactivate")');
                }
            });
        });

        Array.prototype.forEach.call($tableInactive, function (table) {
            let $button = table.querySelectorAll('[data-action="activate"]');

            Array.prototype.forEach.call($button, function (item) {
                item.onclick = function () {
                    self.modify(item.getAttribute('data-id'), 'activate');
                }
            });
        });

        Array.prototype.forEach.call($table, function (table) {
            let $buttonEdit = table.querySelectorAll('[data-action="edit"]');
            let $buttonDelete = table.querySelectorAll('[data-action="delete"]');

            Array.prototype.forEach.call($buttonEdit, function (item) {
                item.onclick = function () {
                    self.editId = item.getAttribute('data-id');
                    self.editLoadData(self.editId);
                }
            });

            Array.prototype.forEach.call($buttonDelete, function (item) {
                item.onclick = function () {
                    objWfModal.buildModal('confirmation', globalTranslation.confirmationDelete);
                    objWfModal.buildContentConfirmationAction('objWbAdminUser.delete(' + item.getAttribute('data-id') + ')');
                }
            });
        });
    }

    modify(id, status) {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    delete(id) {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });
        let parameter =
            '&action=doDelete' +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    editLoadData(id) {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });
        let parameter =
            '&action=' + 'editLoadData' +
            '&id=' + id +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                let obj = JSON.parse(ajax.responseText);
                document.documentElement.scrollTop = 0;
                self.editFillField(obj);
            }
        }

        ajax.send(parameter);
    }

    editFillField(obj) {
        this.isEdit = true;
        this.$formFieldName.value = obj['name'];
        this.$formFieldEmail.value = obj['email'];
        this.$formFieldPassword.value = '';
        this.editId = obj['id'];
        this.$formFieldPermission.value = obj['permission'];
    }

    editSave() {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
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

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    saveContent() {
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
            'folder': 'admin',
            'file': 'UserAjax'
        });
        let parameter =
            '&action=doSave' +
            this.buildParameter() +
            '&token=' + globalToken;

        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                objWbAdmin.showResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    validateForm() {
        let arrField = [
            this.$formFieldEmail,
            this.$formFieldPassword
        ];

        return objWfForm.validateEmpty(arrField);
    }

    buildParameter() {
        return '' +
            '&name=' + this.$formFieldName.value +
            '&email=' + this.$formFieldEmail.value +
            '&permission=' + this.$formFieldPermission.value +
            '&password=' + this.$formFieldPassword.value;
    }
}

const objWbAdminUser = new WbAdminUser();
class WbLogin {
    build() {
        if (!window.helper.getUrlWord('login')) {
            return;
        }

        this.update();
        this.buildMenu();
    }

    update() {
        this.isSignUp = false;

        this.$page = document.querySelector('#pageAdminLogin');
        this.$buttonLogin = document.querySelector('#pageAdminLoginBt');
        this.$fielEmail = document.querySelector('#pageAdminLoginUser');
        this.$fieldPassword = document.querySelector('#pageAdminLoginPassword');
    }

    buildMenu() {
        let self = this;

        this.$buttonLogin.addEventListener('click', function (event) {
            self.buildLogin();
        });
    }

    validate() {
        if (this.$fielEmail.value === '') {
            this.$fielEmail.focus();
            this.buildLoginResponse('empty_email');
            return;
        }

        if (this.$fieldPassword.value === '') {
            this.$fieldPassword.focus();
            this.buildLoginResponse('empty_password');
            return;
        }

        return true;
    }

    buildLogin() {
        let self = this;
        let ajax = new XMLHttpRequest();
        let url = objWbUrl.getController({
            'folder': 'admin',
            'file': 'LoginAjax'
        });
        let parameter =
            '&email=' + this.$fielEmail.value +
            '&password=' + this.$fieldPassword.value +
            '&token=' + globalToken;

        if (!this.validate()) {
            return;
        }

        this.$buttonLogin.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                self.$buttonLogin.removeAttribute('disabled');
                self.buildLoginResponse(ajax.responseText);
            }
        }

        ajax.send(parameter);
    }

    buildLoginResponse(data) {
        let response = '';
        let $responseElement = this.$page.querySelector('.form');

        switch (data) {
            case 'inactive':
                response = globalTranslation.loginInactive;
                break;
            case 'problem':
                response = globalTranslation.loginFail;
                this.$fielEmail.focus();
                break;
            case 'empty_email':
                response = globalTranslation.emptyField;
                this.$fielEmail.focus();
                break;
            case 'empty_password':
                response = globalTranslation.emptyField;
                this.$fieldPassword.focus();
                break;
            default:
                objWbUrl.build('admin');
                break;
        }

        objWfNotification.add(response, 'red', $responseElement);
    }
}

const objWbLogin = new WbLogin();
class WbManagementAdmin {
    verifyLoad() {
        window.addEventListener('load', this.applyClass(), {
            once: true
        });
    }

    applyClass() {
        objWbLogin.build();
        objWbAdmin.build();
        objWbAdminBlog.build();
        objWbAdminUploadImage.build();
        objWbAdminUser.build();
        objWbAdminPage.build();
    }
}

const objWbManagementAdmin = new WbManagementAdmin();

objWbManagementAdmin.verifyLoad();