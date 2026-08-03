import { inject, Injectable } from '@angular/core';
import { LlmService } from '../llm-service/llm.service';
import { DccFunction } from '../../engine/types';
import { PDFParse } from 'pdf-parse';

@Injectable({
  providedIn: 'root'
})
export class ManualParsingService {

  llmService = inject(LlmService);

  async parseManual(file: File): Promise<DccFunction[] | Error> {

    PDFParse.setWorker('/assets/pdf.worker.mjs');
    let parser = await new PDFParse({ data: await file.arrayBuffer() });
    let pages = (await parser.getText()).pages.map(page => page.text);
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
      return await this.llmService.parseFunctionText(
        bestPages[0]);
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
