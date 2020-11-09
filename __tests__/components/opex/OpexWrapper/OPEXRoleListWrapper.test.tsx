import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  OPEXRoleListWrapper,
  OPEXRoleListWrapperProps,
} from '../../../../src/components/OPEX/OPEXRoleListWrapper';

let roleList: any[];
beforeAll(() => {
  roleList = [{ name: 'Обустройство' }, { name: 'Экономика' }];
});
const renderComponent = (props: OPEXRoleListWrapperProps): RenderResult =>
  render(<OPEXRoleListWrapper {...props} />);

const findFirstOPEXSet = (): HTMLElement => screen.getByText('Обустройство');
const findSecondOPEXSet = (): HTMLElement => screen.getByText('Экономика');

describe('OPEXRoleListWrapper', () => {
  test('renders correctly', () => {
    renderComponent({
      roleList,
      selectedRole: { name: 'Обустройство' },
      selectRole: jest.fn(),
    });

    expect(findFirstOPEXSet()).toBeInTheDocument();
    expect(findSecondOPEXSet()).toBeInTheDocument();
  });

  test('choose macroparameter set correct', () => {
    const fakeCallback = jest.fn();
    renderComponent({
      roleList,
      selectedRole: { name: 'Обустройство' },
      selectRole: fakeCallback,
    });
    expect(findFirstOPEXSet()).toBeInTheDocument();
    expect(findSecondOPEXSet()).toBeInTheDocument();
    fireEvent.click(findSecondOPEXSet());
    expect(fakeCallback).toBeCalledTimes(1);
    fireEvent.click(findFirstOPEXSet());
    expect(fakeCallback).toBeCalledTimes(2);
  });
});
