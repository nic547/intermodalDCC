import { inject, Injectable } from '@angular/core';
import { SettingsService } from '../settings-service/settings.service';
import { OAIChatCompletionResponse } from './llm.types';
import { DccFunction } from '../../engine/types';

@Injectable({
  providedIn: 'root'
})
export class LlmService {
  protected settingsService = inject(SettingsService);

  async parseFunctionText(text: string): Promise<Error | DccFunction[]> {
    let baseUrl = this.settingsService.Settings.openAiApiUrl() ?? 'http://localhost:1234';
    let apiKey = this.settingsService.Settings.openAiApiKey() ?? '';
    let model = this.settingsService.Settings.openAiModel() ?? 'qwen/qwen3-4b-2507';

    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }

    var result = await fetch(baseUrl + "chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: 'You will receive a text extracted from a pdf manual for a model train. This text should contain a descriptions of available dcc functions. The functions might be out of order.  Keep in mind that functions are generally referred to with a number and "F" as a prefix. F0 is usually the first function. Some functions might be described with icons, if you cannot identify a textual description ignore it. Functions might be described in multiple languages, if this is the case only return the ' + this.getLanguage() + ' texts. Example output: {"0":"Licht","1":"Sound"} Only export the json array, no other text.'
          },
          {
            role: "user",
            content: text + '/no_think'
          }
        ],
        temperature: 0
      })
    });

    const responseObject = await result.json() as OAIChatCompletionResponse;

    if (responseObject) {
      var outputText = responseObject.choices[0].message.content;
      // ensure we only get the json object
      var filteredText = outputText.match(/\{.*\}/s)?.[0];
      try {
        const result = JSON.parse(filteredText ?? '{}');
        return Object.entries(result).map(([key, value]) => {
          return DccFunction.create(Number.parseInt(key), String(value));
        });
      }
      catch {
        return new Error("Failed to parse JSON response from LLM");
      }
    }
    else {
      return new Error("No response from LLM");
    }
  }

  private getLanguage(): string {
    const languageCode = this.settingsService.Settings.llmLanguage();
    switch (languageCode) {
      case 'de':
        return 'German';
      case 'en':
        return 'English';
      default:
        return 'English';
    }
  }
}
