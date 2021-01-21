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