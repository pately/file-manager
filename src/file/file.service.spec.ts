import * as path from 'path';
import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should return valid result of getNLongestLines', () => {
    const sampleStringArray = ['aa', 'b', 'ccc', 'ddddd', 'ee', 'ffffffff'];
    expect(service.getNLongestLines([], 1)).toStrictEqual([]);
    expect(service.getNLongestLines(sampleStringArray, 1)).toStrictEqual([
      'ffffffff',
    ]);
    expect(service.getNLongestLines(sampleStringArray, 2)).toStrictEqual([
      'ffffffff',
      'ddddd',
    ]);
    expect(service.getNLongestLines(sampleStringArray, 3)).toStrictEqual([
      'ffffffff',
      'ddddd',
      'ccc',
    ]);
    expect(service.getNLongestLines(sampleStringArray, 4)).toStrictEqual([
      'ffffffff',
      'ddddd',
      'ccc',
      'ee',
    ]);
    expect(service.getNLongestLines(sampleStringArray, 5)).toStrictEqual([
      'ffffffff',
      'ddddd',
      'ccc',
      'ee',
      'aa',
    ]);
    expect(service.getNLongestLines(sampleStringArray, 8)).toStrictEqual([
      'ffffffff',
      'ddddd',
      'ccc',
      'ee',
      'aa',
      'b',
    ]);
  });

  it('should return valid result of mostFrequentCharacter', () => {
    expect(service.mostFrequentCharacter('aabcccdddddeeffffffff')).toBe('f');
    expect(service.mostFrequentCharacter('aab-------ccc')).toBe('c');
    expect(service.mostFrequentCharacter('aacbcc        ')).toBe('c');
  });

  it('should return valid result of getRandomLine', () => {
    const lines = fs
      .readFileSync(
        path.resolve(process.env.FILE_DIR, 'node-1604272796652.txt'),
        'utf-8',
      )
      .split('\n')
      .filter(Boolean);
    expect(typeof service.getRandomLine()).toBe('string');
    expect(lines.includes(`${service.getRandomLine()}`)).toBe(true);
  });

  it('should return valid result of findLatestFile', () => {
    expect(service.findLatestFile()).toBe('node-1604272796652.txt');
  });

  it('should return valid result of getTop20LinesByFile', () => {
    const fileName = '';
    const top20Lines = service.getTop20LinesByFile(fileName);
    expect(top20Lines.length).toBe(20);
    for (let i = 1, len = top20Lines.length; i < len; i++) {
      // check if current value smaller than previous value
      expect(top20Lines[i - 1].length).toBeGreaterThanOrEqual(
        top20Lines[i].length,
      );
    }
  });

  it('should return valid result of getTop100Lines', () => {
    const top100Lines = service.getTop100Lines();
    for (let i = 1, len = top100Lines.length; i < len; i++) {
      // check if current value smaller than previous value
      expect(top100Lines[i - 1].length).toBeGreaterThanOrEqual(
        top100Lines[i].length,
      );
    }
  });

  it('should return valid result of getRandomLineWithLineNumber', () => {
    const randomLineWithLineNumber = service.getRandomLineWithLineNumber();
    expect(typeof randomLineWithLineNumber[0]).toBe('string');
    expect(typeof randomLineWithLineNumber[1]).toBe('number');
    const lines = fs
      .readFileSync(
        path.resolve(process.env.FILE_DIR, 'node-1604272796652.txt'),
        'utf-8',
      )
      .split('\n')
      .filter(Boolean);

    expect(lines[randomLineWithLineNumber[1]]).toBe(
      randomLineWithLineNumber[0],
    );
  });
});
