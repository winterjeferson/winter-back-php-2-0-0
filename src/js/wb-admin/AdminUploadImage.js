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

        objWfModal.buildModal('confirmation', globalTranslation.confirmationDelete);
        objWfModal.buildContentConfirmationAction('window.adminUploadImage.deleteImageAjax()');
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
                objWfModal.closeModal();
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