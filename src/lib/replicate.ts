import Replicate from "replicate";

export const getReplicateClient = () => {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  return replicate;
};

const systemPrompt =
  "You are a helpful assistant. Please ensure that your responses are socially unbiased and positive in nature.\n\n If you dont know the answer to a question, please dont share false information. Start immediately with the bio text. Do not include any introductory phrases, greetings, or meta-statements about the task. Do not add any statements that are too appreciative but a little appreciation doesn't hurt. Do not exxagerate it but state the facts in a meaningful manner. Make it sound like a beautiful story with good language";

export const generateReplicateInput = ({ prompt }: { prompt: string }) => {
  return {
    top_k: 0,
    top_p: 1,
    prompt: prompt,
    max_tokens: 512,
    temperature: 0.75,
    system_prompt: systemPrompt,
    length_penalty: 1,
    max_new_tokens: 800,
    prompt_template:
      "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 0,
    log_performance_metrics: false,
  };
};
