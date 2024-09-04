import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

export interface LlmOutputStructure {
    status: string;
    error: string;
    data: Record<string, string>;
}

@Injectable()
export class OpenAiService {
    private readonly azureOpenAiEndpoint: string;
    private readonly apiKey: string;

    constructor() {
        this.azureOpenAiEndpoint =
            'https://carvachai.openai.azure.com/openai/deployments/DocumentAI/chat/completions?api-version=2024-02-15-preview';
        this.apiKey = process.env.OPENAI_API_KEY;
    }

    private parseJsonString(jsun: string) {
        console.log(jsun);
        const cleanedJsonString = jsun.replace(/```json|```/g, '').trim();
        try {
            const jsonObject = JSON.parse(cleanedJsonString);
            return jsonObject;
        } catch (error) {
            console.error('Invalid JSON string:', error);
            return null;
        }
    }

    async extractText(encodedImage: string, type: string): Promise<LlmOutputStructure> {
        const payload = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `
                You are an AI tasked with extracting textual information from various types of documents provided as images.

                1.	Input: You will receive a document in image format.
                2.	Task: Your job is to extract all important textual information from the document which can be used for verification.
                3.	Output Format: The output should be strictly in JSON format and add status code to the response as "200" if information is extracted.
                4.  Error Handling: Also check if document is of type ${type}. If not, respond with a simple JSON object with status "400".
                5.	Error Handling: If no relevant information can be extracted from the document, respond with a simple JSON object with very short error message and status "404".
                6.  Do not include empty fields in the response.
                7.  Field names(key of json) should be in normal casing where first letter is capital and rest are small and words are separated by space.

                Reponse should be a json object with status, error and data fields. If status is 200, data should contain extracted information. If status is 400, error should contain a message that document is not of type ${type}. If status is 404, error should contain a message that no relevant information could be extracted from the document.
              `,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${encodedImage}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        };

        try {
            const response = await axios.post(this.azureOpenAiEndpoint, payload, {
                headers: {
                    'api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });
            return this.parseJsonString(response.data.choices[0]?.message?.content.trim());
        } catch (error) {
            console.error(error);
            throw new Error('Error extracting text from image');
        }
    }
}
