

/*const { Configuration, OpenAIApi } = require('openai') ;

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export async function sendMessagetoOpenAI(message : string) {
const res = await openai.completions.create({
    model: 'text-davinci-003',
    prompt: message,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty:0,
    presence_penalty:0
});
return res.data.choices[0].text;
}*/
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API,
  dangerouslyAllowBrowser: true  // This is also the default, can be omitted
});

export async function sendMessagetoOpenAI(message : string){
const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Generate a title for a social media post on the topic of ${message}`,
    max_tokens: 20,
  });
  return completion.choices[0].text;
};

export async function sendIdeatoOpenAI(message: string){
  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Generate a single sentence 40 words social media caption on the topic of ${message}`,
    max_tokens: 60,
  });
  return completion.choices[0].text;
}
