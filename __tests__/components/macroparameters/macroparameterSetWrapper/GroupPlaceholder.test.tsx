import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  GroupPlaceholder,
  GroupPlaceholderProps,
} from '@/components/Macroparameters/MacroparameterSetWrapper/GroupPlaceholder/GroupPlaceholder';

let placeholder: string;

beforeAll(() => {
  placeholder = 'test placeholder';
});
const renderComponent = (props: GroupPlaceholderProps): RenderResult =>
  render(<GroupPlaceholder {...props} />);

const findPlaceholder = (): HTMLElement => screen.getByText(placeholder);
const findAddButton = (): HTMLElement => screen.getByText('Добавить статью');

describe('GroupPlaceholder', () => {
  test('renders correctly', () => {
    renderComponent({ text: placeholder });
    expect(findPlaceholder()).toBeInTheDocument();
  });
  test('callback correctly', () => {
    const fakeCallback = jest.fn();
    renderComponent({ text: placeholder, callback: fakeCallback });
    expect(findPlaceholder()).toBeInTheDocument();
    expect(findAddButton()).toBeInTheDocument();
    fireEvent.click(findAddButton());
    expect(fakeCallback).toBeCalledTimes(1);
  });
});
