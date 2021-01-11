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