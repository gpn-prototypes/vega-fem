import { spreadValue } from './spreadValue';

describe('spreadValue, every tableCell', () => {
  test('test input value', () => {
    const input1 = '18827734';
    const input2 = 18827734;
    const output1 = '18 827 734';
    const output2 = '18 827 734';
    expect(spreadValue(input1)).toEqual(output1);
    expect(spreadValue(input2)).toEqual(output2);
  });
});
