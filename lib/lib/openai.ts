import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmotionAnalysis {
  emotion: string;
  score: number;
  analysis: string;
}

export const analyzeEmotion = async (
  content: string
): Promise<EmotionAnalysis> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an emotional intelligence assistant. Analyze the emotional content of journal entries and provide insights. Respond in JSON format with: emotion (joy/sadness/anger/fear/neutral), score (0-1), and analysis (brief insight).',
        },
        {
          role: 'user',
          content: `Analyze the emotion in this journal entry: "${content}"`,
        },
      ],
      temperature: 0.7,
    });

    const result = JSON.parse(
      response.choices[0].message.content || '{}'
    );

    return {
      emotion: result.emotion || 'neutral',
      score: result.score || 0.5,
      analysis: result.analysis || 'No analysis available',
    };
  } catch (error) {
    console.error('OpenAI emotion analysis error:', error);
    return {
      emotion: 'neutral',
      score: 0.5,
      analysis: 'Unable to analyze emotion at this time',
    };
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create an artistic, abstract representation of this emotion: ${prompt}`,
      n: 1,
      size: '1024x1024',
    });

    return response.data[0].url || '';
  } catch (error) {
    console.error('OpenAI image generation error:', error);
    throw new Error('Failed to generate image');
  }
};
