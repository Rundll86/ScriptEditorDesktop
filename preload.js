const { contextBridge, ipcRenderer } = require("type-electron");
contextBridge.exposeInMainWorld("desktopApi", {
    async getProjects() {
        const projects = await ipcRenderer.invoke("get-projects");
        return projects.map(project => project.name);
    },
    async saveProject(name, data) {
        return await ipcRenderer.invoke("save-project", name, data);
    },
    async createProject(name, path) {
        return await ipcRenderer.invoke("create-project", name, path);
    },
    async isProjectExist(name) {
        return await ipcRenderer.invoke("is-project-exist", name);
    },
    async openDialog(filename) {
        const target = await ipcRenderer.invoke("open-dialog", filename);
        console.log(target);
        return target;
    },
    async readProject(name) {
        return JSON.parse(await ipcRenderer.invoke("read-project", name));
    },
    refresh() {
        ipcRenderer.send("refresh");
    },
    toggleDevtool() {
        ipcRenderer.send("toggle-devtool");
    }
});
contextBridge.exposeInMainWorld("isDesktop", true);