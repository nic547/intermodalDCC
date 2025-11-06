import { inject, Injectable } from '@angular/core';
import { SettingsService } from '../settings-service/settings.service';
import { LlmFunctionOutput, OAIChatCompletionResponse } from './llm.types';

@Injectable({
  providedIn: 'root'
})
export class LlmService {
  protected settingsService = inject(SettingsService);

  async parseFunctionText(text: string): Promise<Error | LlmFunctionOutput[]> {
    let baseUrl = this.settingsService.Settings.openAiApiUrl() ?? 'http://localhost:1234';
    let apiKey = this.settingsService.Settings.openAiApiKey() ?? '';

    var result = await fetch(baseUrl + "/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3-4b-2507",
        messages: [
          {
            role: "system",
            content: 'You will receive a text extracted from a pdf manual for a model train. This text should contain a descriptions of available dcc functions. The functions might be out of order.  Keep in mind that functions are generally referred to with a number and "F" as a prefix. F0 is usually the first function. Some functions might be described with icons, if you cannot identify a textual description ignore it. Functions might be described in multiple languages, if this is the case only return the German texts. Example output: [ { "f": 0, "d": "Licht"},{"f":1,"d":"Sound"}]'
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const responseObject = await result.json() as OAIChatCompletionResponse;

    if (responseObject) {
      return JSON.parse(responseObject.choices[0].message.content) as LlmFunctionOutput[];
    }
    else {
      return new Error("No response from LLM");
    }
  }
}
