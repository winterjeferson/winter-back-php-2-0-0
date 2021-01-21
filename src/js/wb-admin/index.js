window.adminUser = new AdminUser();
window.adminBlog = new AdminBlog();
window.adminPage = new AdminPage();

const admin = new Admin();
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