require('dotenv').config();
const fs = require('fs');
const path = require('path');
const yaml  = require('yaml');
const llm = require('./llm');


var challenges = null;


module.exports.listChallenges = function() { 
    var ret = [];
    listChallenges().forEach(x => {
        ret.push(x.name);
    });
    return ret;
}

module.exports.getChallenge = function(val) {
    var work = listChallenges();
    var res = work.find(({name}) => name === val);
    if(res) {
        return { name: res.name, description: res.text };
    }
    return null;
}

module.exports.runPrompt = async function(val, prompt) {
    var work = listChallenges().find(({name}) => name === val);
    if(!work) {
        return '';
    }
    var ret = await llm.runPrompt(work.prompt, prompt);
    return ret;
}


function listChallenges() {
    if(!challenges) {
        //const chalFile = path.join(__dirname, "data", "challenges.yml" );
        const chalFile = process.env.LLM_CHALLENGES;
        if(fs.existsSync(chalFile)) {
            var fc = fs.readFileSync(chalFile,{ encoding: 'utf8', flag: 'r' });
            return yaml.parse(fc);
        }
        return [];        
    } else {
        return challenges;
    }
}