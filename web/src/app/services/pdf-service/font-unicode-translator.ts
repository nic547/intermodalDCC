export class FontUnicodeTranslator {
  private rangeMappings: { start: number; end: number; result: number[]; }[] = [];
  private charMappings: Map<number, number[]> = new Map<number, number[]>();

  AddRangeEntry(line: string) {
    // There are two kinds of range entries - you can define a range based on a destination number that simply defined "how much to shift" the incoming values
    // or you can define it with an array of destination codes.

    if (line.includes('[')) {
      //TODO: array based range entry
    }

    var match = line.match(/<([A-Fa-f0-9]+)> <([A-Fa-f0-9]+)> <([A-Fa-f0-9]+)>/)
    if (match == null || match[1] == null || match[2] == null || match[3] == null) {
      throw new Error("failed to match range entry")
    }
    const start = parseInt(match[1], 16);
    const end = parseInt(match[2], 16);
    const result = this.parseHexString(match[3]);
    this.rangeMappings.push({ start, end, result });

  }

  AddEntry(line: string) {
    var match = line.match(/<([A-Fa-f0-9]+)> <([A-Fa-f0-9]+)>/)
    if (match == null || match[1] == null || match[2] == null) {
      throw new Error("failed to match character entry")
    }
    this.charMappings.set(parseInt(match[1], 16), this.parseHexString(match[2]));
  }

  Decode(input: string): string {
    input = input.slice(1, -1)
    let result = '';

    for (let i = 0; i < input.length; i += 4) {
      const charCode = parseInt(input.slice(i, i + 4), 16);
      let unicodeCodes = this.charMappings.get(charCode);
      if (unicodeCodes) {
        result += String.fromCodePoint(...unicodeCodes);
      } else {
        for (const rangeMapping of this.rangeMappings) {
          if (charCode >= rangeMapping.start && charCode <= rangeMapping.end) {
            result += String.fromCodePoint(...rangeMapping.result.map(x => x + (charCode - rangeMapping.start)));
            break;
          }

        }
      }
    }
    return result;
  }

  private parseHexString(input: string): number[] {
    return [...input.matchAll(/[A-Fa-f0-9]{4}/g)].map(x => parseInt(x[0], 16));
  }
}