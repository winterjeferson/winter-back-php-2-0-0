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

        this.$buttonLogin.addEventListener('click', () => {
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
            if (ajax.readyState === 4 && ajax.status === 200) {
                self.$buttonLogin.removeAttribute('disabled');
                self.buildLoginResponse(ajax.responseText);
            }
        };

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

window.objWbLogin = new WbLogin();