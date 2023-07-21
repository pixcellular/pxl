import {describe, expect, it} from '@jest/globals';
import ImprovedNoise from '../src/Perlin';

describe('Perlin.noise', () => {
  it('creates perlin noise', () => {
    expect(ImprovedNoise.noise(0.1003, 0, 0)).toBe(0.09166690547589719);
  });
  it('creates perlin noise', () => {
    expect(ImprovedNoise.noise(1.1, 0.0, 0.0)).not.toBe(ImprovedNoise.noise(0.1, 0.0, 0.0));
  });
});

