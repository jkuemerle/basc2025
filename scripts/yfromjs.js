const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yaml  = require('yaml')

const argv = yargs(hideBin(process.argv))
    .option('challenges', {type: 'string', description: 'JSON file of challenge data'} )
    .option('flags', {type: 'string', description: 'JSON file of flag data'} )
    .option('hints', {type: 'string', description: 'JSON file of hint data'} )
    .option('tags', {type: 'string', description: 'JSON file of tag data'} )
    .option('output', {type: 'string', description: 'YAML file for output'} )
    .usage('Usage: $0 --challenges <challenges file> --flags <flags file> --hints <hints file> --tags <tags file> --output <output file>')
    .parse();

var cf = argv.challenges.trim();
var ff = argv.flags.trim();
var hf = argv.hints.trim();
var tf = argv.tags.trim();
var outfile = argv.output.trim();

var challenges = JSON.parse(fs.readFileSync(cf));
var flags = JSON.parse(fs.readFileSync(ff));
var hints = JSON.parse(fs.readFileSync(hf));
var tags = JSON.parse(fs.readFileSync(tf));

var results = challenges.results.map(c => {
    return {
        name: c.name,
        description: c.description,
        max_attempts: c.max_attempts,
        value: c.value,
        category: c.category,
        type: c.type,
        state: c.state,
        flags: flags.results.filter(x => x.challenge_id == c.id).map(f => { return { type: f.type, content: f.content, data: f.data }; }),
        hints: hints.results.filter(x => x.challenge_id == c.id).map(h => { return { type: h.type, content: h.content, cost: h.cost, requirements: null } }),
        tags: tags.results.filter(x => x.challenge_id == c.id).map(f => { return { value: f.value }; }), 
    };
});

const y = yaml.stringify(results,)
fs.writeFileSync(outfile, y);

console.log(`Wrote: ${outfile}`);