import fs from "fs";
import cp from "child_process";
import process from "process";
import commandExists from "command-exists";

/**
 *
 */
const Chrome = (url)=> {
    if (process.platform === 'win32') {
        fs.stat('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', function (err, stat) {
            if (err === null) {
                console.log("Launching Chrome");
                cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--kiosk', '--incognito', url]);
            } else if (err.code == 'ENOENT') {
                console.log("Chrome 64 not found, trying in 32 bits");
                fs.stat('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', function (error, stat) {
                    if (error === null) {
                        console.log("Launching Chrome");
                        cp.spawn('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', ['--kiosk', '--incognito', url]);
                    } else {
                        console.log('Chrome not installed');
                    }
                });
            } else {
                console.log('Chrome not installed');
            }
        });
    } else if (process.platform === 'linux') {
        commandExists('google-chrome', function (err, cmd) {
            if (cmd) {
                console.log("Launching Chrome");
                cp.spawn('google-chrome', ['--kiosk', '--incognito', url]);
            } else {
                console.log('Chrome not installed');
            }
        });
    }
};

export  default Chrome;
