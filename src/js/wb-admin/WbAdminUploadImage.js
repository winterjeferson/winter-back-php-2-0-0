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

        this.$btUploadThumbnail.addEventListener('click', () => {
            self.upload(this, 'blog/thumbnail/');
        });

        this.$btUploadBanner.addEventListener('click', () => {
            self.upload(this, 'blog/banner/');
        });

        Array.prototype.forEach.call($buttonDelete, function (item) {
            item.onclick = function () {
                self.deleteImage(item);
            };
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
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.buildResponse(ajax.responseText, $return);
                objWfModal.closeModal();
            }
        };

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
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.$btUploadThumbnail.removeAttribute('disabled');
                self.buildResponse(ajax.responseText, $form);
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

window.objWbAdminUploadImage = new WbAdminUploadImage();