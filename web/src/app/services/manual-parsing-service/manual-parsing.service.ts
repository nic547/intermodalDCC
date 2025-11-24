import { inject, Injectable } from '@angular/core';
import { PdfService } from '../pdf-service/pdf.service';
import { LlmService } from '../llm-service/llm.service';
import { ParsedFunction } from './manual-parsing.types';
import { DccFunction } from '../../engine/types';

@Injectable({
  providedIn: 'root'
})
export class ManualParsingService {

  pdfService = inject(PdfService);
  llmService = inject(LlmService);

  async parseManual(file: File): Promise<DccFunction[] | Error> {
    let pages = await this.pdfService.tryLoadPages(file);
    if (pages instanceof Error) {
      return pages;
    }
    let scores = this.scorePages(pages);
    let maxScore = Math.max(...scores);

    if (maxScore === 0) {
      return new Error("No references to functions found in the manual.");
    }

    let bestPages: string[] = [];
    scores.forEach((score, index) => {
      if (score === maxScore) {
        bestPages.push(pages[index]);
      }

    });

    if (bestPages.length === 0) {
      return new Error("Failed to identify relevant pages in the manual.");
    }

    if (bestPages.length === 1) {
      var functions = await this.llmService.parseFunctionText(bestPages[0]);
      if (functions instanceof Error) {
        return functions;
      }
      return functions.map(f => DccFunction.create(f.f, f.d));
    }

    return Error("Not implemented yet.");

  }

  /** Scores the relevance of each page based on how many F[number] it references. */
  scorePages(pages: string[]): number[] {
    return pages.map(page => {
      let score = 0;
      for (let functionNr = 0; functionNr <= 68; functionNr++) {
        if (page.includes(`F${functionNr}`)) {
          score++;
        }
      }
      return score;
    })
  }
}
