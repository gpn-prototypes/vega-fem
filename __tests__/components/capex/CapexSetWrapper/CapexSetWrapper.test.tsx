import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  CapexSetWrapper,
  CapexSetWrapperProps,
} from '../../../../src/components/CAPEX/CapexSetWrapper/CapexSetWrapper';
import CapexSet from '../../../../types/CAPEX/CapexSet';

let fakeCapexSet: CapexSet;
// mocking table
jest.mock('../../../../src/containers/CAPEX/CapexTableContainer', () => {
  return {
    CapexTableContainer: () => {
      return <div />;
    },
  };
});

beforeEach(() => {
  fakeCapexSet = {
    years: 15,
    yearStart: 2020,
    capexGlobalValueList: [
      {
        id: '3',
        name: 'reserveValue',
        caption: 'Величина резерва',
        unit: 'rub.',
        value: 38.0,
      },
    ],
    capexExpenseGroupList: [
      {
        id: '1',
        name: 'oneTimePaymentGroup',
        caption: 'Первоначальный взнос',
        valueTotal: 1000000.0,
        capexExpenseList: [
          {
            id: '1',
            name: 'oneTimePaymentValue',
            caption: 'Значение разового платежа',
            unit: 'rub.',
            valueTotal: 1000000.0,
          },
        ],
      },
    ],
  };
});

const renderComponent = (props: CapexSetWrapperProps): RenderResult =>
  render(<CapexSetWrapper {...props} />);

describe('CapexSetWrapper', () => {
  test('Рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  test('Рендер соответствует снимку', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(
        <CapexSetWrapper
          capexSet={fakeCapexSet}
          updateCapexValue={jest.fn()}
          requestDeleteCapexGroup={jest.fn()}
          requestChangeCapexGroup={jest.fn()}
          deleteCapexValue={jest.fn()}
          addCapex={jest.fn()}
          addCapexSetGroup={jest.fn()}
          highlightArticle={jest.fn()}
          highlightArticleClear={jest.fn()}
          updateCapexGlobalValue={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Рендерится с правильно подставленным fakeCapexSet', () => {
    renderComponent({
      capexSet: fakeCapexSet,
      addCapex: jest.fn(),
      addCapexSetGroup: jest.fn(),
      deleteCapexValue: jest.fn(),
      highlightArticle: jest.fn(),
      highlightArticleClear: jest.fn(),
      requestChangeCapexGroup: jest.fn(),
      requestDeleteCapexGroup: jest.fn(),
      updateCapexGlobalValue: jest.fn(),
      updateCapexValue: jest.fn(),
    });

    expect(screen.getByDisplayValue('38')).toBeInTheDocument();
  });

  test('срабатывают ивенты на изменение глобального значения', () => {
    const fakeUpdateCapexGlobalValue = jest.fn();
    render(
      <CapexSetWrapper
        capexSet={fakeCapexSet}
        updateCapexValue={jest.fn()}
        requestDeleteCapexGroup={jest.fn()}
        requestChangeCapexGroup={jest.fn()}
        deleteCapexValue={jest.fn()}
        addCapex={jest.fn()}
        addCapexSetGroup={jest.fn()}
        highlightArticle={jest.fn()}
        highlightArticleClear={jest.fn()}
        updateCapexGlobalValue={fakeUpdateCapexGlobalValue}
      />,
    );
    const globalValueInput: HTMLElement = screen.getByDisplayValue('38');
    fireEvent.change(globalValueInput, { target: { value: '50' } });
    expect(globalValueInput).toHaveAttribute('value', '50');
    fireEvent.blur(globalValueInput);
    expect(fakeUpdateCapexGlobalValue).toBeCalledTimes(1);
  });

  test('срабатывают ивенты на добавление группы', () => {
    const fakeAddGroup = jest.fn();
    render(
      <CapexSetWrapper
        capexSet={fakeCapexSet}
        updateCapexValue={jest.fn()}
        requestDeleteCapexGroup={jest.fn()}
        requestChangeCapexGroup={jest.fn()}
        deleteCapexValue={jest.fn()}
        addCapex={jest.fn()}
        addCapexSetGroup={fakeAddGroup}
        highlightArticle={jest.fn()}
        highlightArticleClear={jest.fn()}
        updateCapexGlobalValue={jest.fn()}
      />,
    );

    const addToggle: HTMLElement = screen.getByText(/Добавить группу затрат/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText(
      'Введите название группы затрат',
    );
    const addGroupButton: HTMLElement = screen.getByText('Добавить группу');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupButton);
    expect(fakeAddGroup).toBeCalledTimes(1);
  });

  test('отмена добавления группы', () => {
    const fakeAddGroup = jest.fn();
    render(
      <CapexSetWrapper
        capexSet={fakeCapexSet}
        updateCapexValue={jest.fn()}
        requestDeleteCapexGroup={jest.fn()}
        requestChangeCapexGroup={jest.fn()}
        deleteCapexValue={jest.fn()}
        addCapex={jest.fn()}
        addCapexSetGroup={fakeAddGroup}
        highlightArticle={jest.fn()}
        highlightArticleClear={jest.fn()}
        updateCapexGlobalValue={jest.fn()}
      />,
    );

    const addToggle: HTMLElement = screen.getByText(/добавить группу затрат/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText(
      'Введите название группы затрат',
    );
    const addGroupCancelButton: HTMLElement = screen.getByText('Отмена');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupCancelButton);
    expect(fakeAddGroup).toBeCalledTimes(0);
  });
});
