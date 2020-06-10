const fs = require('fs');
const { promisify } = require('util');
const path = require('path')

// Fs promisify
const rename = promisify(fs.rename)
const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)

// Get the folder path from argv or choose current directory
const folderToRead = process.argv[2] || './'

// Get current file name
const __file = __filename.split(path.sep).pop();

// Folder names to move the files to 
const folders = {
    programming: 'Programming',
    archives: 'Archives',
    videos: 'Videos',
    images: 'Images',
    docs: 'Docs',
    others: 'Others',
}

// Details of file types and corresponding folders

const fileFolders = {
    js: folders.programming,
    ts: folders.programming,
    html: folders.programming,
    css: folders.programming,
    php: folders.programming,
    sql: folders.programming,
    zip: folders.archives,
    rar: folders.archives,
    '7z': folders.archives,
    mp4: folders.archives,
    mkv: folders.archives,
    avi: folders.archives,
    jpg: folders.images,
    jpeg: folders.images,
    png: folders.images,
    gif: folders.images,
    pdf: folders.docs,
    doc: folders.docs,
    docx: folders.docs,
    xls: folders.docs,
    xlsx: folders.docs,
    txt: folders.docs,
}
let result = {}

doDeClutter();
// doClutter();

async function doDeClutter() {
    createFolders();

    let files = await getListOfFiles();
    console.log("TCL: deClutter -> files", files)

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let fileName = file.name;
        let ext = fileName.split('.').pop();
        let folder = fileFolders[ext];
        if (!folder) {
            folder = folders.others;
        }
        try {
            await rename(`${folderToRead}${path.sep}${fileName}`, `${folderToRead}${path.sep}${folder}${path.sep}${fileName}`)
            if (!result[folder]) {
                result[folder] = 0;
            }
            result[folder]++;

        } catch (error) {
            console.log("TCL: deClutter -> error", error)

        }
    }
    console.log("******************")
    console.log(result)
}

function createFolders() {
    let foldersToCreate = Object.values(folders);
    foldersToCreate.forEach(async (folder) => {
        try {

            await mkdir(`${folderToRead}${path.sep}${folder}`)

        } catch (error) {
            console.log("TCL: createFolders -> error", error)

        }
    })

}

async function getListOfFiles() {

    try {
        let allFiles = await readdir(folderToRead, { withFileTypes: true })
        let filteredFiles = allFiles.filter(file => {
            console.log(file);
            if (folderToRead == './' && file.name == __file) {
                return false;
            }
            return !file.isDirectory()
        })
        return filteredFiles
    } catch (error) {
        console.log("TCL: getListOfFiles -> error", error)
    }
}

function doClutter() {

    let allFolders = Object.values(folders);
    allFolders.forEach(async (folder) => {
        let folderPath = `${folderToRead}${path.sep}${folder}`;
        let files;
        try {
            files = await readdir(folderPath);

        } catch (error) {
            console.log("TCL: doClutter -> error", error)

        }
        files.forEach(async file => {
            try {
                await rename(`${folderPath}${path.sep}${file}`, `${folderToRead}${path.sep}${file}`)

            } catch (error) {
                console.log("TCL: doClutter -> rename error", error)
            }
        })
    })
}

