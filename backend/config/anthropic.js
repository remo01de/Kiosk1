import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const createChatCompletion = async (messages, systemPrompt, maxTokens = 4096) => {
  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages
    });

    return {
      success: true,
      message: response.content[0].text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Anthropic API Fehler:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const streamChatCompletion = async (messages, systemPrompt, onChunk) => {
  try {
    const stream = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
      stream: true
    });

    let fullText = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const chunk = event.delta.text;
        fullText += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }
    }

    return {
      success: true,
      message: fullText
    };
  } catch (error) {
    console.error('Anthropic API Fehler (Stream):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default client;
