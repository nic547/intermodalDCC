export class FontUnicodeMapping {
  private rangeMappings: { start: number; end: number; result: number[]; }[] = [];
  private charMappings: Map<number, number[]> = new Map<number, number[]>();

  AddRangeEntry() {
    // There are two kinds of range entries - you can define a range based on a destination number that simply defined "how much to shift" the incoming values
    // or you can define it with an array of destination codes.
  }

  AddEntry(line: string) {
    var match = line.match(/<(\d+)> <(\d+)>/)
    if (match == null || match[1] == null || match[2] == null) {
      throw new Error("")
    }
    this.charMappings.set(parseInt(match[1], 16), [...match[2].matchAll(/\d{4}/g)].map(x => parseInt(x[0], 16)));
  }

  Decode(input: string): string {
    input = input.slice(1, -1)
    let result = '';
    
    for (let i = 0; i  < input.length; i+= 4)
    {
      const charCode = parseInt(input.slice(i , i+4), 16);
      let unicodeCodes = this.charMappings.get(charCode);
      if (unicodeCodes) {
        result += String.fromCodePoint(...unicodeCodes);
      } else {

      }
    }
    return result;
  }
}
