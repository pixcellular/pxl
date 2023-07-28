import {performance} from 'perf_hooks';
import Vector, {v} from '../src/Vector';
import {runFunction} from './test-util/runFunction';

describe('memoized v', () => {
  it('should increase performance when creating vectors', () => {
    const args = [10, 20];
    const times = 1000_000;

    let withoutMemoization = performance.now();
    const withResult  = runFunction((x, y) => new Vector(x, y), times, args);
    withoutMemoization = performance.now() - withoutMemoization;

    let withMemoization = performance.now();
    const withoutResult = runFunction(v, times, args);
    withMemoization = performance.now() - withMemoization;

    console.log('test memoize', {withMemoization, withoutMemoization});
    expect(withoutResult.slice(0, 10)).toStrictEqual(withResult.slice(0, 10));
    expect(withMemoization < withoutMemoization / 2).toBe(true);
  });

});
