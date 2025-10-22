import { signal } from "@angular/core";

export class SettingsDto {
    public enableLLMFunctionsParser: boolean = false;

    public openAiApiUrl?: string;
    public openAiApiKey?: string;
}

export class Settings {
    public enableLLMFunctionsParser = signal(false);

    public openAiApiUrl = signal<string | undefined>(undefined);
    public openAiApiKey = signal<string | undefined>(undefined);

    public toDto(): SettingsDto {
        return {
            enableLLMFunctionsParser: this.enableLLMFunctionsParser(),
            openAiApiUrl: this.openAiApiUrl(),
            openAiApiKey: this.openAiApiKey(),
        };
    } 
    
    updateFromDto(dto: Partial<SettingsDto>) {
        this.enableLLMFunctionsParser.set(dto.enableLLMFunctionsParser ?? false);
        this.openAiApiUrl.set(dto.openAiApiUrl ?? undefined);
        this.openAiApiKey.set(dto.openAiApiKey ?? undefined);
    }

    public getCopy(): Settings {
        const copy = new Settings();
        copy.updateFromDto(this.toDto());
        return copy;
    }

    update(settings: Settings) {
        const dto = settings.toDto();
        this.updateFromDto(dto);
    }



}