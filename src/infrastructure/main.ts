import { app, BrowserWindow } from 'electron';
import path from 'path';

const WINDOW_CONFIG = {
  width: 300,
  height: 500,
  resizable: false,
  maximizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
} as const;

function createWindow(): void {
  const win = new BrowserWindow(WINDOW_CONFIG);
  win.loadFile(path.join(__dirname, '..', '..', 'src', 'presentation', 'index.html'));
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
