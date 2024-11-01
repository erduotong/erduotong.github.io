/**
 * @fileOverview 将project.md转换成README.md
 */
import fs from 'fs';
import path from 'path';

const directoryPath = process.cwd();

function convertProjectToReadme(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                convertProjectToReadme(filePath);
            } else if (file.isFile() && path.extname(file.name) === '.md' && path.basename(file.name) === 'project.md') {
                const readmePath = path.join(dir, 'README.md');

                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return console.error('Unable to read file: ' + err);
                    }

                    const updatedData = `${data}\n\n***\n\n<Catalog/>\n\n`;

                    fs.writeFile(readmePath, updatedData, (err) => {
                        if (err) {
                            return console.error('Unable to write file: ' + err);
                        }
                        console.log(`Converted ${filePath} to ${readmePath}`);

                        fs.unlink(filePath, (err) => {
                            if (err) {
                                return console.error('Unable to delete file: ' + err);
                            }
                            console.log(`Deleted ${filePath}`);
                        });
                    });
                });
            }
        });
    });
}

convertProjectToReadme(directoryPath);