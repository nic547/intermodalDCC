import { Injectable } from '@angular/core';
import { FontUnicodeMapping } from './font-unicode-mapping';

type ObjectMap = Map<number, number>

const CHAR_e = 101;
const CHAR_n = 110;
const CHAR_d = 100;
const CHAR_o = 111;
const CHAR_b = 98;
const CHAR_j = 106;

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
    let rootObjectStartByte = xrefData.objects.get(xrefData.rootObjectId ?? 0) ?? 0;
    let pageObjectNr = this.parseRootObject(array, rootObjectStartByte);
    let pages = this.parsePagesObject(array, xrefData.objects.get(pageObjectNr) ?? 0);

    await Promise.all(
    pages.map(async pageObjNr => {
      let pageStartByte = xrefData.objects.get(pageObjNr) ?? 0;
      let content = await this.parsePageContent(array, pageStartByte, xrefData.objects);
      let text = content.map(c => this.extractText(c)).join('|');
    })
  );

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
      let objectOffset = parseInt(objMatch?.[1] ?? '0', 10);
      if (objectOffset > 0) {
        objects.set(startObjNum + i, parseInt(objMatch?.[0] ?? '0', 10));
      }

    }


    ({ nextPosition, line } = this.parseLine(array, nextPosition));
    if (line !== 'trailer') {
      throw new Error('Expected trailer after xref section');
    }

    ({ nextPosition, line } = this.parseLine(array, nextPosition));

    let prevOffset = Number(line.match(/\/Prev\s+(\d+)/)?.[1]);
    let rootObjectId = Number(line.match(/\/Root\s+(\d+)\s+0\s+R/)?.[1]);

    let xrefData = new XrefData(rootObjectId, prevOffset, objects);

    if (prevOffset) {
      console.debug('Found Prev offset, parsing previous xref section', prevOffset);
      let prevXrefData = this.parseXrefSections(array, prevOffset);
      xrefData.objects = new Map([...xrefData.objects, ...prevXrefData.objects]);
    }

    return xrefData;
  }

  parseRootObject(array: Uint8Array, startByte: number): number {
    let endByte = this.findObjectEnd(array, startByte);
    let objectBytes = array.slice(startByte, endByte);
    let objectText = new TextDecoder().decode(objectBytes);

    // find pages object reference
    let pagesMatch = objectText.match(/\/Pages\s+(\d+)\s+0\s+R/);
    let pagesObjectId = Number(pagesMatch?.[1]);
    console.debug('PAGES OBJECT ID', pagesObjectId);

    console.debug('ROOT OBJECT TEXT', objectText);

    return pagesObjectId;
  }

  parsePagesObject(array: Uint8Array, startByte: number): number[] {
    let endByte = this.findObjectEnd(array, startByte);
    let objectBytes = array.slice(startByte, endByte);
    let objectText = new TextDecoder().decode(objectBytes);

    let kidsMatch = objectText.match(/\/Kids\[(.*?)\]/);
    let kidsText = kidsMatch?.[1] ?? '';
    let kids = kidsText.split(' ').filter((s, i) => i % 3 === 0).map(s => Number(s)) ?? [];

    console.debug('KIDS OBJECT IDS', kids);
    return kids;
  }

  async parsePageContent(array: Uint8Array, startByte: number, objectMap: ObjectMap): Promise<string[]> {
    let endByte = this.findObjectEnd(array, startByte);
    let objectBytes = array.slice(startByte, endByte);
    let objectText = new TextDecoder().decode(objectBytes);

    let contentsMatch = objectText.match(/\/Contents(?:\[| )(.*?)\]?(?:\/|>>)/);
    let contentsText = contentsMatch?.[1] ?? '';
    let contentsObjectId = contentsText.split(' ').filter((s, i) => i % 3 === 0).map(s => Number(s)) ?? [];
    console.debug('CONTENTS OBJECT ID', contentsObjectId);

    let fontMatch = objectText.match(/\/Font<<(.*?)>>/);
    let fontDefinitions = fontMatch?.[1].matchAll(/(?<name>\w+) (?<nr>\d+) (?<gen>\d+) R/g);



    let contentsOffset = contentsObjectId.map(id => objectMap.get(id) ?? 0);
    let content = await Promise.all(contentsOffset.map(async offset => await this.parseContent(array, offset)));
    return content;
  }

  async parseContent(array: Uint8Array, startByte: number): Promise<string> {
    let endByte = this.findObjectEnd(array, startByte);
    let objectBytes = array.slice(startByte, endByte);
    let text = new TextDecoder().decode(objectBytes);

    var streamAttributes = text.match(/^\d+ \d+ obj\s*<<(.*)>>stream\s?\s?/)
    if (streamAttributes?.[1]) {
      let streamLenght = Number(streamAttributes[1].match(/\/Length\s+(\d+)/)?.[1] ?? '0');
      let streamStartByte = streamAttributes[0].length;
      let streamEndByte = streamStartByte + streamLenght;
      let streamBytes = objectBytes.slice(streamStartByte, streamEndByte);
      const decompressedStream = new Blob([streamBytes]).stream().pipeThrough(new DecompressionStream('deflate'));
      text = await new Response(decompressedStream).text();
      return text;
    } else {
      return text;
    }
  }

  async parseFontUnicodeMapping(array: Uint8Array, objNr: number, objectMap: ObjectMap): Promise<FontUnicodeMapping> {
    let fontStartByte = objectMap.get(objNr) ?? 0;
    let fontContent = this.parseContent(array, fontStartByte)

    return new FontUnicodeMapping();

  }

  extractText(content: string): string {
    let matches = content.matchAll(/\(.*\)Tj|\[.*\]TJ/g);
    let text = '';
    for (const match of matches) {
      let textSlugs = match[0].matchAll(/\(.*?\)|\<.*?\>/g);
      for (const slug of textSlugs) {
        if (slug[0].startsWith('(') && slug[0].endsWith(')')) {
          text += slug[0].slice(1, -1);
        } else if (slug[0].startsWith('<') && slug[0].endsWith('>')) {
          //TODO: Use Font's Character Map to decode hex to string
          let hex = slug[0].slice(1, -1);
          let str = '';
          for (let i = 0; i < hex.length; i += 4) {
            let code = parseInt(hex.substr(i, 4), 16);
            str += String.fromCharCode(code);
          }
          text += str;
        }
      }
    }
    return text;
  }

  findObjectEnd(array: Uint8Array, objectOffset: number): number {
    for (let i = objectOffset; i < array.length - 1; i++) {
      if (
        array[i] === CHAR_e &&
        array[i + 1] === CHAR_n &&
        array[i + 2] === CHAR_d &&
        array[i + 3] === CHAR_o &&
        array[i + 4] === CHAR_b &&
        array[i + 5] === CHAR_j
      ) { // 'end'
        return i + 6;
      }
    }
    throw new Error('Failed to find end of object');
  }
}

class XrefData {
  constructor(public rootObjectId: number | undefined, public prev: number | undefined, public objects: Map<number, number>) { }
}

