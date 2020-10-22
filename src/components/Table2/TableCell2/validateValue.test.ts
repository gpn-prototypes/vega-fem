import { validateValue } from './validateValue';

describe('validateValue tableCell2', () => {
  test('input in tableCell2', () => {
    const input = '111,,.3.,44.';
    const input2 = '111,,.3.,44.77';
    const output = '111344.';
    const output2 = '111344.77';
    expect(validateValue(input)).toEqual(output);
    expect(validateValue(input2)).toEqual(output2);
  });
});
