import {performance} from 'perf_hooks';
import Vector, {v} from '../src/Vector';
import {runFunction} from './test-util/runFunction';

describe('memoized v', () => {
  it.skip('should increase performance when creating vectors', () => {
    const args = [10, 20];
    const times = 1000_000;

    let withoutMemoization = performance.now();
    const withoutMemoResult  = runFunction((x, y) => new Vector(x, y), times, args);
    withoutMemoization = performance.now() - withoutMemoization;

    let withMemoization = performance.now();
    const withMemoResult = runFunction(v, times, args);
    withMemoization = performance.now() - withMemoization;

    console.log('test memoize vector', {withMemoization, withoutMemoization});
    expect(withMemoResult.slice(0, 10)).toStrictEqual(withoutMemoResult.slice(0, 10));
    expect(withMemoization < withoutMemoization / 2).toBe(true);
  });

});
