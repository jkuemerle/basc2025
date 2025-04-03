require('dotenv').config();
const ollama = require('@langchain/ollama');
const openai = require('@langchain/openai');

var llm = null;

switch(process.env.LLM_PROVIDER.toUpperCase()) {
    case 'OLLAMA':
        llm = new ollama.ChatOllama({
            model: process.env.LLM_MODEL,
            temperature: 0,
            maxRetries: 2,
            baseUrl: process.env.OLLAMA_BASE
        });
        break;
    case 'OPENAI' :
        llm = new openai.ChatOpenAI({
            model: process.env.LLM_MODEL,
            temperature: 0,
        });
        break;
}


module.exports.runPrompt = async function(system, human){
    var prompt = system.replace("$$PROMPT$$", human)
    // const ret = await llm.invoke([
    //     ["system", system],
    //     ["human", human]
    // ]);
    ret = null
    if(llm) {
        try{
            work = await llm.invoke(prompt);
            ret = work.content;
        }
        catch(ex) {
            console.error(ex);
            ret = null;
        }
    }
    return ret;
}