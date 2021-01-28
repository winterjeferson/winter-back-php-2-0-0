const allFile = '*.*';

module.exports = {
    src: `src/`,
    dist: `docs/`,
    assets: 'assets/',
    theme: 'theme',
    plugin: 'plugin',
    admin: 'admin',
    index: 'index',
    allFile: allFile,
    allFolderFile: `**/${allFile}`,
    prefix: 'wb-',
    folderFtp: '/www/test/',
    ftpHost: '',
    ftpPort: '',
    ftpUser: '',
    ftpPassword: '',
}