class WBForm {
    build() {
        if (!window.helper.getUrlWord('form')) return;

        this.update();
        this.buildMenu();
    }

    update() {
        this.elPage = document.querySelector('#pageForm');
        this.elForm = this.elPage.querySelector('.form');
        this.elFormFieldEmail = this.elForm.querySelector('[data-id="email"]');
        this.elFormFieldMessage = this.elForm.querySelector('[data-id="message"]');
        this.elButtonSend = this.elPage.querySelector('#pageFormBtSend');
    }

    buildMenu() {
        const self = this;

        this.elButtonSend.addEventListener('click', () => {
            if (window.form.validateEmpty([self.elFormFieldEmail, self.elFormFieldMessage])) {
                self.send();
            }
        });
    }

    send() {
        const self = this;
        const ajax = new XMLHttpRequest();
        const url = window.url.getController({
            'folder': 'form',
            'file': 'FormAjax'
        });
        let parameter =
            '&method=sendForm' +
            '&data=' + JSON.stringify(self.getData()) +
            '&token=' + globalToken;

        this.elButtonSend.setAttribute('disabled', 'disabled');
        ajax.open('POST', url, true);
        ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.elButtonSend.removeAttribute('disabled');
                self.response(ajax.responseText);
            }
        };

        ajax.send(parameter);
    }

    getData() {
        let arr = [];

        arr.push(this.elForm.querySelector('[data-id="email"]').value);
        arr.push(this.elForm.querySelector('[data-id="message"]').value);

        return arr;
    }

    response(data) {
        let response = '';
        let color = '';

        switch (data) {
            case 'ok':
                color = 'green';
                response = globalTranslation.formSent;
                break;
            default:
                color = 'red';
                response = globalTranslation.formProblemSend;
                break;
        }

        objWfNotification.add(response, color, this.elForm);
    }
}

window.wbForm = new WBForm();