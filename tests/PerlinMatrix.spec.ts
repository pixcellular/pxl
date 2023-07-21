import {describe, expect, it} from '@jest/globals';
import * as fs from 'fs';
import PerlinMatrix, {flatten, mapEachCell, PerlinMatrixConfig} from '../src/PerlinMatrix';

describe('PerlinMatrix', () => {
  const defaultMatrix = [
    [
      0.09985000337404129,
      0.2700325706700033,
      -0.13612206066797222
    ],
    [
      0.11261087558934378,
      0.09626656575293263,
      0.10387575112833816
    ]
  ];

  it('creates perlin noise', () => {
    const perlinMatrix = new PerlinMatrix(3, 2);
    expect(perlinMatrix.asArrays()).toStrictEqual(defaultMatrix);
  });

  it('seeds perlin matrix randomly', () => {
    const perlinMatrix1 = new PerlinMatrix(3, 2, {seeder: Math.random});
    const flatDefaultMatrix = flatten(defaultMatrix);
    const seededMatrix = perlinMatrix1.asArrays();
    const flatSeededMatrix = flatten(seededMatrix);
    const allInRange = !!flatSeededMatrix.filter(n => n > PerlinMatrix.range[0] && n < PerlinMatrix.range[1]);
    expect(seededMatrix).not.toStrictEqual(defaultMatrix);
    expect(allInRange).toBe(true);
    const allDiffer = !!flatSeededMatrix.filter((n, i) => n !== flatDefaultMatrix[i]);
    expect(allDiffer).toBe(true);
    const perlinMatrix2 = new PerlinMatrix(3, 2, {seeder: Math.random});
    const flatSeededMatrix2 = flatten(perlinMatrix2.asArrays());
    const diffBetween1And2 = flatSeededMatrix2.filter((n, i) => n !== flatSeededMatrix[i]);
    expect(diffBetween1And2.length).toBe(6);
  });

  it('creates perlin noise between 0 and 1', () => {
    const width = 100;
    const height = 100;
    const perlinMatrix = new PerlinMatrix(width, height);
    const allBetween0And1 = flatten(perlinMatrix.toFractions())
            .filter(v => v > 0 && v < 1)
            .length
        === 100 * 100;
    expect(allBetween0And1).toBe(true);
  });

  it('scale map, saved to html', () => {
    const width = 30;
    const height = 20;
    const grids = [];

    const maxScale = 50;
    for (let scale = 1; scale < maxScale; scale++) {
      const config = {
        scale: scale / 100,
        seeder: Math.random
      };
      const grid = createFractionsBwGradientGrid(config, width, height);
      grids.push(`<div>${width}x${height}; ${JSON.stringify(config)}</div>` + grid);
    }
    const html = `<html><body><div style="    
      display: block;
      unicode-bidi: embed;
      font-family: monospace;
      white-space: pre;
      "> 
        ${grids.join('\n')}    
      </div></body></html>`;
    const path = 'dist/perlin-matrix-scale.html';
    fs.writeFileSync(path, html);
  });

  it('shift map, saved to html', () => {
    const width = 30;
    const height = 20;
    const maxShift = 50;
    const grids: string[] = [];

    for (let shift = 1; shift < maxShift; shift++) {

      const config = {
        shift: shift / 3,
        scale: 0.25
      };
      grids.push(`<div>${width}x${height}; ${JSON.stringify(config)}</div>`
          + createFractionsBwGradientGrid(config, width, height)
      );
    }

    const path = 'dist/perlin-matrix-shift.html';
    writeToHtml(grids, path);
  });

  it('larger map contains smaller map, saved to html', () => {
    const grids: string[] = [];

    const config = {
      shift: 1,
      scale: 0.25
    };

    const smallWidth = 30;
    const smallHeight = 20;
    const smallPerlinMatrix = new PerlinMatrix(smallWidth, smallHeight, config);
    const smallFractions = smallPerlinMatrix.toFractions();
    grids.push(`<div>${smallWidth}x${smallHeight}; ${JSON.stringify(config)}</div>`
        + createBwGradientGrid(smallFractions)
    );

    const bigWidth = 60;
    const bigHeight = 40;
    const bigPerlinMatrix = new PerlinMatrix(bigWidth, bigHeight, config);
    const bigFractions = bigPerlinMatrix.toFractions();
    grids.push(`<div>${bigWidth}x${bigHeight}; ${JSON.stringify(config)}</div>`
        + createBwGradientGrid(bigFractions)
    );

    const path = 'dist/perlin-matrix-small-in-big.html';
    writeToHtml(grids, path);

    const smallMatchesBigCell = mapEachCell<number, boolean>(
        smallFractions, (location, value) => {
          return bigFractions[location.y][location.x] === value;
        });
    const allCellsMatch = flatten(smallMatchesBigCell)
            .filter(v => v)
            .length
        ===
        smallHeight * smallWidth;
    expect(allCellsMatch).toBe(true);
  });

});

function createFractionsBwGradientGrid(
    config: Partial<PerlinMatrixConfig>,
    width: number,
    height: number
) {
  const perlinMatrix = new PerlinMatrix(width, height, config);
  const fractions = perlinMatrix.toFractions();
  return createBwGradientGrid(fractions);
}

function createBwGradientGrid(fractions: number[][]) {
  return fractions.map(row => {
    return `</span><div class="row">${row.map(cell => {
      return `<span class="cell" style="background-color: ${toRgb(cell)}; height: 10px; width: 10px; display: inline-block;"> </span>`;
    }).join('')}</div>`;
  }).join('');
}

function writeToHtml(grids: any[], path: string) {
  const html = `<html lang="en"><body><div style="    
      display: block;
      unicode-bidi: embed;
      font-family: monospace;
      white-space: pre;
      "> 
        ${grids.join('\n')}    
      </div></body></html>`;
  fs.writeFileSync(path, html);
}

function toRgb(n: number) {
  const rgb = Math.round(n * 255);
  return `rgb(${rgb}, ${rgb}, ${rgb})`;
}
