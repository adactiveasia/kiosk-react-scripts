const path = require('path');
const fs = require('fs-extra');
const spawn = require('react-dev-utils/crossSpawn');
const packageOverride = require('./adactive/packageOverrides.json');
const {askForToken, askFirebaseProjectId} = require("./adactive/promptUtils");

function addPackageOverrides(appPath) {
    const pkgPath = path.join(appPath, 'package.json');
    return fs.readJson(pkgPath)
        .then((pkg) => {
            Object.assign(pkg.scripts, packageOverride.scripts);
            Object.assign(pkg.dependencies, packageOverride.dependencies);
            if (!pkg.devDependencies) {
                pkg.devDependencies = {};
            }
            Object.assign(pkg.devDependencies, packageOverride.devDependencies);

            return fs.writeJson(pkgPath, pkg, { spaces: 2 });
        });
}

function addNpmToken(appPath) {
    return askForToken()
        .then((token) => {
            return fs.appendFile(path.join(appPath, '.npmrc'), token.trim());
        });
}

function addFirebaseConfig(appPath) {
    return askFirebaseProjectId()
        .then((projectId) => {
            return fs.writeJson(
                path.join(appPath, '.firebaserc'),
                {
                    projects: {
                        production: projectId,
                        staging: projectId + "-stg",
                        dev: projectId + "-dev"
                    }
                },
                { spaces: 2 }
            );
        });
}

function adactiveIniter(appPath, cb) {
    return addPackageOverrides(appPath)
        .then(() => addNpmToken(appPath))
        .then(() => addFirebaseConfig(appPath))
        .then(() => {
            const proc = spawn.sync('yarnpkg', ['install'], { stdio: 'inherit' });
            if (proc.status !== 0) {
                console.error(`yarn install failed`);
                return;
            }
        })
        .then(cb)
        ;
}

module.exports = adactiveIniter;
