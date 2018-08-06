const fs = require('fs');


module.exports = {
    getAllImageUrlsArr(arrOfEntryPointsRelativeToPublicDir, contentBase) {
        const resultingArr = [];
        const startingString = 'localhost:9001';

        function createImagePath(fileName, appendToPathString) {
            const filePath = `${contentBase}/${appendToPathString}/${fileName}`;
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                const fileNames = fs.readdirSync(filePath);

                if (!fileNames || !fileNames.length) return [];

                return fileNames.forEach(innerFileName => createImagePath(innerFileName, `${appendToPathString}/${fileName}`));
            }

            if (stats.isFile()) {
                const tempUrl = `${startingString}/${appendToPathString}/${fileName}`;

                return resultingArr.push(`http://${tempUrl}`);
            }

            return [];
        }

        arrOfEntryPointsRelativeToPublicDir.forEach(entryPoint => createImagePath(entryPoint, ''));

        return resultingArr;
    },
};
