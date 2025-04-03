const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const AdmZip = require('adm-zip');
const { info } = require('console');

const argv = yargs(hideBin(process.argv))
    .option('input', {type: 'string', default: null,  description: 'Folder with CTFd data files'} )
    .option('output', {type: 'string', description: 'Output CTFd backup zip '} )
    .usage('Usage: $0 --input <base input folder> > --output <output file>')
    .parse();

var outFile = argv.output.trim();
var inFolder = argv.input.trim();

var zipOut = new AdmZip();
if(fs.existsSync(path.join(inFolder, "db"))) {
    zipOut.addLocalFolder(path.join(inFolder, "db"), "db");
}
if(fs.existsSync(path.join(inFolder, "uploads"))) {
    zipOut.addLocalFolder(path.join(inFolder, "uploads"), "uploads");
}

var dirname = path.dirname(outFile);
if(!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
}

zipOut.writeZip(outFile);
console.log(`Complete, wrote to ${outFile}`);




