import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { config } from '../config';

const dataFileName = 'longest100Lines.json';

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

@Injectable()
export class FileService {
  async uploadFile(file) {
    const lines = fs
      .readFileSync(file.path, 'utf-8')
      .split(/\r\n|\n/)
      .filter(Boolean);
    const longest100Lines = this.getNLongestLines(lines, 100);
    const current100LinesBuffer = fs.readFileSync(
      path.resolve(config.dataDirectory, dataFileName),
    );
    let current100Lines = [];
    try {
      current100Lines = JSON.parse(current100LinesBuffer.toString());
    } catch (error) {}

    const linesForSort = [...longest100Lines, ...current100Lines];
    const newLongest100Lines = this.getNLongestLines(linesForSort, 100);
    return fs.writeFileSync(
      path.resolve(config.dataDirectory, dataFileName),
      JSON.stringify(newLongest100Lines, null, 2),
    );
  }

  getRandomLine() {
    const [randomLine] = this.getRandomLineWithLineNumber();
    return randomLine;
  }

  getRandomLineBackwards() {
    const randomLine = this.getRandomLine();
    console.log(randomLine);
    return [...randomLine.toString()].reverse().join('');
  }

  getTop20LinesByFile(fileName) {
    fileName = fileName ? this.findFile(fileName) : this.findLatestFile();
    const lines = fs
      .readFileSync(path.resolve(config.fileDirectory, `${fileName}`), 'utf-8')
      .split(/\r\n|\n/)
      .filter(Boolean);
    return this.getNLongestLines(lines, 20);
  }

  getTop100Lines() {
    const top100LinesBuffer = fs.readFileSync(
      path.resolve(config.dataDirectory, dataFileName),
    );
    const top100Lines = JSON.parse(top100LinesBuffer.toString());
    return top100Lines;
  }

  getRandomLineWithLineNumber() {
    const latestFile = this.findLatestFile();
    const lines = fs
      .readFileSync(
        path.resolve(config.fileDirectory, `${latestFile}`),
        'utf-8',
      )
      .split(/\r\n|\n/)
      .filter(Boolean);
    const randomLineNumber = getRandomInt(0, lines.length);
    return [lines[randomLineNumber], randomLineNumber];
  }

  findLatestFile() {
    let latestFile = [0, ''];
    fs.readdirSync(path.resolve(config.fileDirectory)).forEach(file => {
      const splitfileName = file.split(/[\s.-]+/);
      const latestTimestamp = parseInt(
        splitfileName[splitfileName.length - 2],
        10,
      );

      if (latestTimestamp > latestFile[0]) {
        latestFile = [latestTimestamp, file];
      }
    });

    if (!latestFile[1]) {
      throw new NotFoundException('File not found. Please upload a file first');
    }
    return latestFile[1];
  }

  findFile(filename) {
    let latestFile = [0, ''];
    fs.readdirSync(path.resolve(config.fileDirectory)).forEach(file => {
      const splitfileName = file.split(/[\s.-]+/);
      const latestTimestamp = parseInt(
        splitfileName[splitfileName.length - 2],
        10,
      );

      if (
        latestTimestamp > latestFile[0] &&
        this.getOriginalFileName(file) === filename
      ) {
        latestFile = [latestTimestamp, file];
      }
    });

    if (!latestFile[1]) {
      throw new NotFoundException('File not found. Please upload a file first');
    }
    return latestFile[1];
  }

  getRandomLineWithAttributes() {
    const [randomLine, randomLineNumber] = this.getRandomLineWithLineNumber();
    let filename = this.findLatestFile();
    if (typeof filename === 'string') {
      // find original file name
      filename = this.getOriginalFileName(filename);
    }
    const mostFrequentCharacter = this.mostFrequentCharacter(randomLine);
    return {
      randomLine,
      randomLineNumber,
      filename,
      mostFrequentCharacter,
    };
  }

  mostFrequentCharacter(lineString) {
    if (!lineString) return null;
    const cleanedStr = lineString.replace(/\W/g, ''); // Removing non-alphanumeric chars
    if (cleanedStr.length === 0) return null;
    const strObj = {};
    let topChar = '';
    for (const val of cleanedStr) {
      strObj[val] = (strObj[val] || 0) + 1;
      if (topChar === '' || strObj[val] >= strObj[topChar]) topChar = val;
    }
    return topChar;
  }

  getNLongestLines(lines, N) {
    lines.sort((a, b) => {
      return (
        b.length - a.length || b.localeCompare(a) // sort by length, if equal then
      ); // sort by dictionary order
    });
    return lines.slice(0, N);
  }

  getOriginalFileName(fileName) {
    const reLast = /-[^-]*$/; // Remove word after last dash with regex
    return fileName.replace(reLast, '').concat('.txt');
  }
}
