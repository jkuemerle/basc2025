const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yaml  = require('yaml')

const argv = yargs(hideBin(process.argv))
    .option('input', {type: 'array', default: null,  description: 'One or more YAML challenge files'} )
    .option('folder', {type: 'string', description: 'Path to folder of YAML challenge files'} )
    .option('pages', {type: 'string', description: 'Path to directory of pages files'} )
    .option('output', {type: 'string', description: 'Output folder'} )
    .usage('Usage: $0 --output <output folder> --input <one or more input files> --pages <path to pages directory>')
    .parse();

var pagesFolder = argv.pages ? argv.pages.trim() : "";
var outFolder = argv.output.trim();
var inputFiles = [];
if (argv.input && argv.input.length > 0 && argv[0]) {
    inputFiles = argv.input.map((x) => { return x.trim(); });
}
var inputFolder = argv.folder ? argv.folder.trim() : "";

var challenge_id = 1;
var flag_id = 1;
var hint_id = 1;
var tag_id = 1;
var challenges = { results: [] };
var flags = { results: [] };
var hints = { results: [] };
var tags = { results: [] };
var integrated = {
    results: []
};
var multiple_choice = {
    results: []
};

if (inputFolder) {
    var e = fs.readdirSync(inputFolder, { withFileTypes: true });
    for (var i = 0; i < e.length; i++) {
        if (e[i].isFile() && path.extname(path.join(inputFolder, e[i].name)).toLowerCase() == '.yml') {
            inputFiles.push(path.join(inputFolder, e[i].name));
        }
    }
}
var initalize_id = null;

for (var i = 0; i < inputFiles.length; i++) {
    console.log(`Processing ${inputFiles[i]}`)
    var fn = inputFiles[i];
    var fc = fs.readFileSync(fn,{ encoding: 'utf8', flag: 'r' });
    var work = yaml.parse(fc);
    for (var w = 0; w < work.length; w++) {
        if (work[w].name && work[w].description && work[w].category && work[w].type) {
            chal = {
                id: challenge_id,
                name: work[w].name,
                description: work[w].description,
                max_attempts: work[w].max_attempts ? work[w].max_attempts : 0,
                value: work[w].value,
                category: work[w].category,
                type: work[w].type,
                state: work[w].state
            };
            if (chal.name == "Initialize") {
                initalize_id = chal.id;
            }
            challenges.results.push(chal);
            if (work[w].flags) {
                for (var f = 0; f < work[w].flags.length; f++) {
                    flag = { id: flag_id, challenge_id: challenge_id, type: work[w].flags[f].type, content: work[w].flags[f].content, data: work[w].flags[f].data ? work[w].flags[f].data : "case_insensitive" };
                    flags.results.push(flag);
                    flag_id++;
                }
            }
            if (work[w].hints) {
                for (var h = 0; h < work[w].hints.length; h++) {
                    hint = { id: hint_id, challenge_id: challenge_id, type: work[w].hints[h].type, content: work[w].hints[h].content, cost: work[w].hints[h].cost, requirements: work[w].hints[h].requirements };
                    hints.results.push(hint);
                    hint_id++;
                }
            }
            if(work[w].tags) {
                for (var t = 0; t < work[w].tags.length; t++) {
                    tag = { id: tag_id, challenge_id: challenge_id, value: work[w].tags[t].value };
                    tags.results.push(tag);
                    tag_id++;
                }
            }
            if (work[w].type == "integrated") {
                ic = { id: challenge_id, challengeName: work[w].name }
                integrated.results.push(ic);
            }
            if (work[w].type == "multiple_choice") {
                mc = { id: challenge_id }
                multiple_choice.results.push(mc);
            }
            challenge_id++;
        }
    }
}

if (initalize_id) {
    for (var i = 0; i < challenges.results.length; i++) {
        if (challenges.results[i].category == "Admin" || challenges.results[i].category == "Developer") {
            challenges.results[i].requirements = { prerequisites: [initalize_id] };
        }
    }
}

if( challenges.results.length > 0) {
    challenges.count = challenges.results.length;
}
if( flags.results.length > 0) {
    flags.count = flags.results.length;
}
if( hints.results.length > 0) {
    hints.count = hints.results.length;
}
if( tags.results.length > 0) {
    tags.count = tags.results.length;
}
if( integrated.results.length > 0) {
    integrated.count = integrated.results.length;
}
if( multiple_choice.results.length > 0) {
    multiple_choice.count = multiple_choice.results.length;
}

var ct = JSON.stringify(challenges);
var ft = JSON.stringify(flags);
var ht = JSON.stringify(hints);
var tt = JSON.stringify(tags);
var it = JSON.stringify(integrated);
var mc = JSON.stringify(multiple_choice);
var challengeOutFile = path.join(outFolder, "challenges.json");
var flagsOutFile = path.join(outFolder, "flags.json");
var hintsOutFile = path.join(outFolder, "hints.json");
var tagsOutFile = path.join(outFolder, "tags.json");
var integratedOutFile = path.join(outFolder, "integrated_challenge.json");
var multipleChoiceOutFile = path.join(outFolder, "multiple_choice.json");
fs.writeFileSync(challengeOutFile, ct);
fs.writeFileSync(flagsOutFile, ft);
fs.writeFileSync(hintsOutFile, ht);
fs.writeFileSync(tagsOutFile, tt);
fs.writeFileSync(integratedOutFile, it);
fs.writeFileSync(multipleChoiceOutFile, mc);

//TODO: fix pages PK issue

if (pagesFolder) {
    var pagesFile = path.join(outFolder, "pages.json");
    var pages = {};
    if(fs.existsSync(pagesFile)) {
        pages = JSON.parse(fs.readFileSync(pagesFile));
    }
    var content = fs.readdirSync(pagesFolder).map(f => {
        if ((path.extname(f).toLowerCase().trim() == ".html") || (path.extname(f).toLowerCase().trim() == ".md")) {
            format = 'html';
            if(path.extname(f).toLowerCase().trim() == ".md") {
                format = 'markdown';
            }
            var route = path.basename(f, path.extname(f)).replace("_", "");
            var title = path.basename(f, path.extname(f)).split("_").map(s => {
                return s.charAt(0).toUpperCase() + s.substring(1)
            }).join(" ");
            var content = fs.readFileSync(path.join(pagesFolder, f), 'utf-8').replace(/(\r\n|\n|\r)/gm, "\r\n").replace('"', '\"');
            return { title: title, route: route, content: content, format: format };;
        }
    });
    var unmatched;
    var matched;
    if(!pages.results){
        pages.results = [];
        unmatched = content; 
    } else {
        unmatched = content.filter(c => {
            return pages.results.filter(p => { return p.route == c.route; }).length <= 0;
        });
        matched = content.filter(c => {
            return pages.results.filter(p => { return p.route == c.route; }).length > 0;
        });    
    }
    // update matched
    if(matched && matched.length > 0) {
        for (var i = 0; i < matched.length; i++) {
            for (var p = 0; p < pages.results.length; p++) {
                if (pages.results[p].route == matched[i].route) {
                    pages.results[p].title = matched[i].title;
                    pages.results[p].content = matched[i].content;
                    pages.results[p].format = matched[i].format;
                }
            }
        }    
    }
    // add unmatched
    var id = pages.count + 1;
    for (var i = 0; i < unmatched.length; i++) {
        var val = { id: id, title: unmatched[i].title, route: unmatched[i].route, content: unmatched[i].content, draft: 0, hidden: 0, auth_required: 0, format: unmatched[i].format };
        pages.results.push(val);
        id++;
    }
    pages.count = pages.results.length;
    // write pages data
    fs.writeFileSync(pagesFile, JSON.stringify(pages));
}

console.log(`Complete, data written to ${outFolder}`);