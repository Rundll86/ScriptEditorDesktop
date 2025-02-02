const { makeSaveRoot, makeSaveDir, createSaveFile, useSaveDir } = require('save-tool');
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('type-electron');
const fs = require("fs");
const path = require('path');
makeSaveRoot();
makeSaveDir("script-editor");
if (createSaveFile("script-editor", "projects.json").every(Boolean)) {
    fs.writeFileSync(useSaveDir("script-editor", "projects.json"), "[]");
};
/**
 * @returns {{name:string,path:string}[]}
 */
function getProjects() {
    return JSON.parse(fs.readFileSync(useSaveDir("script-editor", "projects.json")).toString());
};
function saveProjects(projects) {
    fs.writeFileSync(useSaveDir("script-editor", "projects.json"), JSON.stringify(projects));
};
function saveProject(name, data) {
    const projects = getProjects();
    const index = projects.findIndex(project => project.name === name);
    fs.writeFileSync(projects[index].path, data);
};
function createProject(name, path) {
    const projects = getProjects();
    projects.push({ name, path });
    saveProjects(projects);
};
function isProjectExist(name) {
    return getProjects().some(project => project.name === name);
};
app.on('ready', () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "preload.js")
        },
        icon: "favicon.ico"
    });
    window.loadURL("http://localhost:8080");
    Menu.setApplicationMenu(null);
    ipcMain.handle("get-projects", () => {
        return getProjects();
    });
    ipcMain.handle("save-project", (_, name, data) => {
        saveProject(name, data);
    });
    ipcMain.handle("create-project", (_, name, path) => {
        if (isProjectExist(name)) {
            return false;
        };
        createProject(name, path);
        return true;
    });
    ipcMain.handle("is-project-exist", (_, name) => {
        return isProjectExist(name);
    });
    ipcMain.handle("open-dialog", (_, filename) => {
        return dialog.showSaveDialogSync(window, {
            title: "选择保存路径",
            defaultPath: filename,
            filters: [
                { name: "项目", extensions: ["json"] }
            ]
        });
    });
    ipcMain.handle("read-project", (_, name) => {
        const projects = getProjects();
        const index = projects.findIndex(project => project.name === name);
        return fs.readFileSync(projects[index].path).toString();
    });
    ipcMain.on("refresh", () => {
        window.reload();
    });
    ipcMain.on("toggle-devtool", () => {
        window.webContents.toggleDevTools();
    });
    window.webContents.openDevTools();
});