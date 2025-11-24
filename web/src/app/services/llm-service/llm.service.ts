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
    let model = this.settingsService.Settings.openAiModel() ?? 'qwen/qwen3-4b-2507';

    var result = await fetch(baseUrl + "/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: 'You will receive a text extracted from a pdf manual for a model train. This text should contain a descriptions of available dcc functions. The functions might be out of order.  Keep in mind that functions are generally referred to with a number and "F" as a prefix. F0 is usually the first function. Some functions might be described with icons, if you cannot identify a textual description ignore it. Functions might be described in multiple languages, if this is the case only return the ' + this.getLanguage() + ' texts. Example output: [ { "f": 0, "d": "Licht"},{"f":1,"d":"Sound"}] Only export the json array, no other text.'
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
      // Filter out thinking output and code blocks if any exist.
      var filteredText = outputText.replace(/.*<\/think>/s, '').replace(/```json|```/g, '');
      return JSON.parse(filteredText) as LlmFunctionOutput[];
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
