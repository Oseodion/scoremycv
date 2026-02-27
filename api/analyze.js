export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, imageBase64, imageType } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    let messages;

    if (imageBase64) {
      // Vision model for image uploads
      messages = [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${imageType};base64,${imageBase64}` }
          },
          {
            type: 'text',
            text: "This image is the candidate's CV/resume. Extract all text and information from it visually, then analyze it against the job description.\n\n" + prompt
          }
        ]
      }];
    } else {
      messages = [{ role: 'user', content: prompt }];
    }

    // Use vision model for images, fast text model for text
    const model = imageBase64
      ? 'meta-llama/llama-4-scout-17b-16e-instruct'
      : 'llama-3.3-70b-versatile';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.3,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: err.error?.message || 'Groq API error ' + response.status
      });
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    return res.status(200).json({ result });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
