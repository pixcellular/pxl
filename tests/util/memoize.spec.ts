import {performance} from 'perf_hooks';
import {memoize} from '../../src/util/memoize';
import {runFunction} from '../test-util/runFunction';

describe('memoize', () => {
  it('memoizes with single arg', () => {
    let withoutMemoization = performance.now();
    runFunction(foo, 1000, [123]);
    withoutMemoization = performance.now() - withoutMemoization;
    let withMemoization = performance.now();
    runFunction(memoize(foo, fooToKey), 1000, [123]);
    withMemoization = performance.now() - withMemoization;
    expect(withMemoization < withoutMemoization / 5).toBe(true);
  });

  it('memoizes with multiple args', () => {
    const args = [123, 'blarp'];
    const times = 1000;

    let withoutMemoization = performance.now();
    const withoutMemoResult: string[] = runFunction(bar, times, args);
    withoutMemoization = performance.now() - withoutMemoization;

    let withMemoization = performance.now();
    const withMemoResult: string[] = runFunction(memoize(bar, barToKey), times, args);
    withMemoization = performance.now() - withMemoization;

    console.log('test memoize', {withMemoization, withoutMemoization});

    expect(withMemoResult).toStrictEqual(withoutMemoResult);
    expect(withMemoization < withoutMemoization / 5).toBe(true);
  });
});
function foo(x: number) {
  for (let i = 0; i < x; i++) {
    Math.sqrt(x);
  }
}
function fooToKey(x: number) {
  return x;
}
function bar(x: number, y: string): string {
  let result = '';
  for (let i = 0; i < x; i++) {
    result += `${Math.sqrt(x)}${y}`;
  }
  return result;
}
function barToKey(x: number, y: string) {
  return y + x;
}
