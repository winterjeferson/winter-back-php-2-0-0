class WbManagement {
    verifyLoad() {
        window.addEventListener('load', this.applyClass(), {
            once: true
        });
    }

    applyClass() {
        objWbTranslation.build();
        objWbBlog.build();
        objWbForm.build();
    }
}

const objWbManagement = new WbManagement();

objWbManagement.verifyLoad();