import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';

import {
  MacroparameterSetPlaceholder,
  MacroparameterSetPlaceholderProps,
} from '@/components/Macroparameters/MacroparameterSetWrapper/MacroparameterSetPlaceholder/MacroparameterSetPlaceholder';

let placeholder: string;

beforeAll(() => {
  placeholder = 'test placeholder';
});
const renderComponent = (props: MacroparameterSetPlaceholderProps): RenderResult =>
  render(<MacroparameterSetPlaceholder {...props} />);

const findPlaceholder = (): HTMLElement => screen.getByText(placeholder);

describe('MacroparameterSetPlaceholder', () => {
  test('renders correctly', () => {
    renderComponent({ text: placeholder });
    expect(findPlaceholder()).toBeInTheDocument();
  });
});
