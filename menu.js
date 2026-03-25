const { Menu, BrowserWindow, dialog, globalShortcut, ipcMain, app } = require('electron');
const fs = require('fs');

function loadFile() {
  const window = BrowserWindow.getFocusedWindow();
  
  const options = {
    title: 'Selecciona un archivo Markdown',
    filters: [
      { name: 'Archivos Markdown', extensions: ['md'] },
      { name: 'Archivos de texto', extensions: ['txt'] }
    ]
  };

  dialog.showOpenDialog(window, options, (paths) => {
    if (paths && paths.length > 0) {
      const content = fs.readFileSync(paths[0]).toString();
      window.webContents.send('load', content);
    }
  });
}

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+O', () => {
    loadFile();
  });
});


const template = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Guardar',
        accelerator: 'CmdOrCtrl+S',
        click() {
          saveFile();
        }
      }
    ]
  },
  {
    label: 'Formato',
    submenu: [
      {
        label: 'Negrita',
        accelerator: 'CmdOrCtrl+B',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-bold');
        }
      }
    ]
  }
];

ipcMain.on('save', (event, arg) => {
  const window = BrowserWindow.getFocusedWindow();
  
  const options = {
    title: 'Guardar archivo Markdown',
    filters: [
      { name: 'Documento Markdown', extensions: ['md'] }
    ]
  };

  dialog.showSaveDialog(window, options, (filename) => {
    if (filename) {
      console.log(`Guardando contenido en: ${filename}`);
      fs.writeFileSync(filename, arg);
    }
  });
});

const menu = Menu.buildFromTemplate(template);
module.exports = menu;