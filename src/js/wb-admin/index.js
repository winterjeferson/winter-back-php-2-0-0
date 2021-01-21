window.adminUser = new AdminUser();
window.adminBlog = new AdminBlog();

const admin = new Admin();
const adminPage = new AdminPage();
const adminUploadImage = new AdminUploadImage();
const login = new Login();

document.addEventListener('DOMContentLoaded', () => {
    login.build();
    admin.build();
    adminBlog.build();
    adminUploadImage.build();
    adminUser.build();
    adminPage.build();
});