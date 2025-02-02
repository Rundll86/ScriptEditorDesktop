const child_proces = require("child_process");
process.chdir("../ScriptEditor");
child_proces.execSync("yarn dist");
function copyFolderSync(src, dest) {
    const fs = require("fs");
    const path = require("path");
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};
copyFolderSync("dist", "../ScriptEditorDesktop/website");