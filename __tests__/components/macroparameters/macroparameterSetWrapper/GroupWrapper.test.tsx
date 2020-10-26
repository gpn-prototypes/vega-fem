import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  GroupWrapper,
  MacroparameterSetWrapperGroupProps,
} from '../../../../src/components/Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';

let fakeGroup: MacroparameterSetGroup;

beforeEach(() => {
  fakeGroup = {
    id: '1',
    name: 'fakeGroup',
    caption: 'Курсы основных валют',
    macroparameterList: [
      {
        id: '1',
        name: 'firstName',
        caption: 'Курс доллара реальный',
        unit: '₽/$',
        value: 54.9,
      },
      {
        id: '2',
        name: 'secondName',
        caption: 'Курс евро реальный',
        unit: '₽/€',
        value: 63.2,
      },
    ],
  };
});

const renderComponent = (props: MacroparameterSetWrapperGroupProps): RenderResult =>
  render(<GroupWrapper {...props} />);

const findGroup = (): HTMLElement => screen.getByText('Курсы основных валют');
const findArticle = (): HTMLElement => screen.getByTestId('groupWrapper-body');

describe('Macroparameters GroupWrapper', () => {
  test('renders correctly with macroparameter', () => {
    renderComponent({
      group: fakeGroup,
      deleteMacroparameterValue: jest.fn(),
      removeGroup: jest.fn(),
      requestAddMacroparameter: jest.fn(),
      requestChangeMacroparameterGroup: jest.fn(),
      requestDeleteMacroparameterGroup: jest.fn(),
      updateMacroparameterValue: jest.fn(),
    });
    // isCollapsed={{id: 1, collapsed: false}});
    expect(findGroup()).toBeInTheDocument();
  });
  test('renders correctly with collapsed:false', () => {
    renderComponent({
      group: fakeGroup,
      deleteMacroparameterValue: jest.fn(),
      removeGroup: jest.fn(),
      requestAddMacroparameter: jest.fn(),
      requestChangeMacroparameterGroup: jest.fn(),
      requestDeleteMacroparameterGroup: jest.fn(),
      updateMacroparameterValue: jest.fn(),
      isCollapsed: { id: 1, collapsed: false },
    });
    expect(findGroup()).toBeInTheDocument();
    expect(findArticle()).not.toHaveClass('GroupWrapper__body_hidden');
  });

  test('renders correctly with collapsed:true', () => {
    renderComponent({
      group: fakeGroup,
      deleteMacroparameterValue: jest.fn(),
      removeGroup: jest.fn(),
      requestAddMacroparameter: jest.fn(),
      requestChangeMacroparameterGroup: jest.fn(),
      requestDeleteMacroparameterGroup: jest.fn(),
      updateMacroparameterValue: jest.fn(),
      isCollapsed: { id: '1', collapsed: true },
    });
    expect(findGroup()).toBeInTheDocument();
    expect(findArticle()).toHaveClass('GroupWrapper__body_hidden');
  });
  test('collapsing correctly', () => {
    const fakeCollapseEvent = jest.fn();
    renderComponent({
      group: fakeGroup,
      deleteMacroparameterValue: jest.fn(),
      removeGroup: jest.fn(),
      requestAddMacroparameter: jest.fn(),
      requestChangeMacroparameterGroup: jest.fn(),
      requestDeleteMacroparameterGroup: jest.fn(),
      updateMacroparameterValue: jest.fn(),
      isCollapsed: { id: '1', collapsed: true },
      isCollapsedCallback: fakeCollapseEvent,
    });
    expect(findArticle()).toHaveClass('GroupWrapper__body_hidden');
    fireEvent.click(findGroup());
    expect(findArticle()).not.toHaveClass('GroupWrapper__body_hidden');
  });
  test('renders correctly with empty article list', () => {
    const fakeCollapseEvent = jest.fn();
    renderComponent({
      group: { ...fakeGroup, macroparameterList: [] },
      deleteMacroparameterValue: jest.fn(),
      removeGroup: jest.fn(),
      requestAddMacroparameter: jest.fn(),
      requestChangeMacroparameterGroup: jest.fn(),
      requestDeleteMacroparameterGroup: jest.fn(),
      updateMacroparameterValue: jest.fn(),
      isCollapsed: { id: '1', collapsed: true },
      isCollapsedCallback: fakeCollapseEvent,
    });
    expect(screen.getByText('Пока не добавлена ни одна статья')).toBeInTheDocument();
  });
});
