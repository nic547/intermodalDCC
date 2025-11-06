import { TestBed } from '@angular/core/testing';

import { FontUnicodeTranslator } from './font-unicode-translator';
describe('FontUnicodeTranslator', () => {
    describe('with a single 1-to-1 entry', () => {
        const parameters = [
            { value: '', expected: '' },
            { value: '<0000>', expected: 'A' },
            { value: '<00000000>', expected: 'AA' }
        ];
        parameters.forEach(parameter => {
            it(`with input ${parameter.value} should return '${parameter.expected}'`,
                () => {
                    let mapping = new FontUnicodeTranslator();
                    mapping.AddEntry('<0000> <0041>');

                    const result = mapping.Decode(parameter.value)
                    expect(result).toBe(parameter.expected);
                });
        });
    });

    describe('with some 1-to-1 entries', () => {
        const parameters = [
            { value: '', expected: '' },
            { value: '<0000>', expected: 'A' },
            { value: '<0001>', expected: 'B' },
            { value: '<00010002>', expected: 'BC' }
        ];
        parameters.forEach(parameter => {
            it(`with input ${parameter.value} should return '${parameter.expected}'`,
                () => {
                    let mapping = new FontUnicodeTranslator();
                    mapping.AddEntry('<0000> <0041>');
                    mapping.AddEntry('<0001> <0042>');
                    mapping.AddEntry('<0002> <0043>');

                    const result = mapping.Decode(parameter.value)
                    expect(result).toBe(parameter.expected);
                });
        });
    })

    describe('with 1-to-many entries', () => {
        const parameters = [
            { value: '', expected: '' },
            { value: '<0001>', expected: 'ff' },
            { value: '<0000>', expected: 'A' },
            { value: '<00010001>', expected: 'ffff' },
            { value: '<00010000>', expected: 'ffA' }
        ];
        parameters.forEach(parameter => {
            it(`with input ${parameter.value} should return '${parameter.expected}'`,
                () => {
                    let mapping = new FontUnicodeTranslator();
                    mapping.AddEntry('<0000> <0041>');
                    mapping.AddEntry('<0001> <00660066>');

                    const result = mapping.Decode(parameter.value)
                    expect(result).toBe(parameter.expected);
                });
        });
    })

    describe('with range entries', () => {
        const parameters = [
            { value: '', expected: '' },
            { value: '<0000>', expected: 'A' },
            { value: '<0001>', expected: 'B' }
        ];
        parameters.forEach(parameter => {
            it(`with input ${parameter.value} should return '${parameter.expected}'`,
                () => {
                    let mapping = new FontUnicodeTranslator();
                    mapping.AddRangeEntry('<0000> <00FF> <0041>');

                        const result = mapping.Decode(parameter.value)
                        expect(result).toBe(parameter.expected);
                    });
            });
    });
});