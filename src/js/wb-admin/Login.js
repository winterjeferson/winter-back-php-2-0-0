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