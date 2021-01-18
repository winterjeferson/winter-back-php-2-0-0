class AdminUser {
    build() {
        if (!window.helper.getUrlWord('admin/user')) {
            return;
        }

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
            if (!this.validateForm()) {
                return;
            }

            if (self.isEdit) {
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
                window.modal.buildModal('confirmation', globalTranslation.confirmationDelete);
                window.modal.buildContentConfirmationAction('window.adminUser.delete(' + item.getAttribute('data-id') + ')');
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