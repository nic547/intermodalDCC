import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfExtractionService {
  async tryLoadFunctions(file: File) {

    const arrayBuffer = await file.arrayBuffer();
    const array = new Uint8Array(arrayBuffer);
    let xrefByteoffset = this.getXrefByteOffset(array);
    console.debug('XREF BYTE OFFSET', xrefByteoffset);

    let xrefData = this.parseXrefSections(array, xrefByteoffset);

    console.table(xrefData.objects);

  }

  private getXrefByteOffset(array: Uint8Array): number {
    const startByte = this.findIndexReverse(array, array.length - 1, 'startxref');
    const xrefText = new TextDecoder().decode(array.slice(startByte, array.length));
    console.debug('XREF TEXT', xrefText);
    const match = xrefText.match(/startxref\s+(\d+)\s+%%EOF/);
    return parseInt(match?.[1] ?? '0', 10);
  }

  private findIndexReverse(array: Uint8Array, position: number, str: string): number {
    if (str.length + position > array.length) {
      position = array.length - str.length;
    }
    for (let i = position; i >= 0; i--) {
      const matches = str.split('').every((char, index) => {
        return array[i + index] === char.charCodeAt(0);
      });
      if (matches) {
        return i;
      }
    }
    throw new Error('Failed to locate string in byte array');
  }

  private parseDeflateStream(array: Uint8Array, start: number, length: number) {
  }

  /** Parse the line starting from position until the next CR and/or LF. Return the line (without cr/lf) and the position of the next line */
  private parseLine(array: Uint8Array, position: number): { line: string, nextPosition: number } {
    const start = position;
    const len = array.length;
    // iterate until we hit CR (13) or LF (10) or end of array
    while (position < len) {
      const b = array[position];
      if (b === 13 || b === 10) {
        break;
      }
      position++;
    }

    // slice the bytes for the line (excluding CR/LF)
    const lineBytes = array.slice(start, position);
    const line = new TextDecoder().decode(lineBytes);

    // compute nextPosition, skip CR and/or LF
    let nextPosition = position;
    if (nextPosition < len && array[nextPosition] === 13) {
      nextPosition++;
      // if CRLF sequence, skip the LF as well
      if (nextPosition < len && array[nextPosition] === 10) {
        nextPosition++;
      }
    } else if (nextPosition < len && array[nextPosition] === 10) {
      // lone LF
      nextPosition++;
    }

    return { line, nextPosition };

  }

  parseXrefSections(array: Uint8Array, xrefByteoffset: number): XrefData {

    let { nextPosition, line } = this.parseLine(array, xrefByteoffset);
    ({ nextPosition, line } = this.parseLine(array, nextPosition));

    let xrefHeaderMatch = line.match(/(\d+)\s+(\d+)/);
    let startObjNum = parseInt(xrefHeaderMatch?.[1] ?? '0');
    let numberOfObjects = parseInt(xrefHeaderMatch?.[2] ?? '0');

    let objects = new Map<number, number>();
    for (let i = 0; i < numberOfObjects; i++) {
      ({ nextPosition, line } = this.parseLine(array, nextPosition));
      let objMatch = line.match(/(\d{10})\s+(\d{5})\s+([nf])/);
      objects.set(startObjNum + i, parseInt(objMatch?.[0] ?? '0', 10));
    }
    

    ({ nextPosition, line } = this.parseLine(array, nextPosition));
    if (line !== 'trailer') {
      throw new Error('Expected trailer after xref section');
    }

    ({ nextPosition, line } = this.parseLine(array, nextPosition));

    let prevOffset = Number(line.match(/\/Prev\s+(\d+)/)?.[1]);
    let rootObjectId = Number(line.match(/\/Root\s+(\d+)\s+0\s+R/)?.[1]);

    return new XrefData(rootObjectId, prevOffset, objects);

  }
}

class XrefData {
  constructor(public rootObjectId: number | undefined, public prev: number | undefined, public objects: Map<number, number>) { }
}