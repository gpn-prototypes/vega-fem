import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  MacroparameterSetList,
  MacroparameterSetListProps,
} from '@/components/Macroparameters/MacroparameterSetList/MacroparameterSetList';
import store from '@/store/store';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';

let macroparameterSetList: Array<MacroparameterSet>;
beforeAll(() => {
  macroparameterSetList = [
    {
      id: 1,
      name: 'firstMacroparameter',
      caption: 'firstMacroparameterCaption',
    },
    {
      id: 2,
      name: 'secondMacroparameter',
      caption: 'secondMacroparameterCaption',
    },
  ];
});

const renderComponent = (props: MacroparameterSetListProps): RenderResult =>
  render(
    <Provider store={store}>
      <MacroparameterSetList {...props} />
    </Provider>,
  );

const findFirstMacroparameterSet = (): HTMLElement =>
  screen.getByText('firstMacroparameterCaption');
const findSecondMacroparameterSet = (): HTMLElement =>
  screen.getByText('secondMacroparameterCaption');

describe('MacroparameterSetList', () => {
  test('renders correctly', () => {
    renderComponent({
      macroparameterSetList,
      chooseMacroparameterSet: jest.fn(),
    });
    expect(findFirstMacroparameterSet()).toBeInTheDocument();
    expect(findSecondMacroparameterSet()).toBeInTheDocument();
  });
  test('choose macroparameter set correct', () => {
    const fakeCallback = jest.fn();
    renderComponent({
      macroparameterSetList,
      chooseMacroparameterSet: fakeCallback,
    });
    expect(findFirstMacroparameterSet()).toBeInTheDocument();
    expect(findSecondMacroparameterSet()).toBeInTheDocument();
    fireEvent.click(findSecondMacroparameterSet());
    expect(fakeCallback).toBeCalledTimes(1);
    fireEvent.click(findFirstMacroparameterSet());
    expect(fakeCallback).toBeCalledTimes(2);
  });
});
