import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  MacroparameterSetWrapper,
  MacroparameterSetWrapperProps,
} from '../../../../src/components/Macroparameters/MacroparameterSetWrapper/MacroparameterSetWrapper';
import MacroparameterSet from '../../../../types/Macroparameters/MacroparameterSet';

jest.mock('../../../../src/containers/Macroparameters/MacroparameterTableContainer', () => {
  return {
    MacroparameterTableContainer: () => {
      return <div />;
    },
  };
});

let fakeMacroparameterSet: MacroparameterSet;
let fakeRenderProps: MacroparameterSetWrapperProps;
beforeAll(() => {
  fakeMacroparameterSet = {
    id: '1',
    name: 'Набор_Макропараметров_20_2В',
    caption: 'Набор Макропараметров 20.2В',
    years: 19,
    yearStart: 2015,
    category: 'SET_CATEGORY_REAL',
    allProjects: false,
    macroparameterGroupList: [
      {
        id: '1',
        name: 'Курсы_основных_валют',
        caption: 'Курсы основных валют',
        macroparameterList: [
          {
            id: '1',
            name: 'Курс_доллара_реальный',
            caption: 'Курс доллара реальный',
            unit: '₽/$',
          },
          {
            id: '2',
            name: 'Курс_евро_реальный',
            caption: 'Курс евро реальный',
            unit: '₽/€',
          },
        ],
      },
      {
        id: '2',
        name: 'Цена_на_нефть_-_РЕАЛЬНЫЕ_ЦЕНЫ',
        caption: 'Цена на нефть - РЕАЛЬНЫЕ ЦЕНЫ',
        macroparameterList: [
          {
            id: '1',
            name: 'Цена_на_нефть_Brent_в_реальном_выражении',
            caption: 'Цена на нефть Brent в реальном выражении',
            unit: '$/барр.',
          },
          {
            id: '2',
            name: 'Цена_на_нефть_Urals,_среднее_значение_MED_и_NWE_Rotterdam,_в_реальном_выражении',
            caption:
              'Цена на нефть Urals, среднее значение MED и NWE Rotterdam, в реальном выражении',
            unit: '$/барр.',
          },
        ],
      },
    ],
  };
});
beforeEach(() => {
  fakeRenderProps = {
    macroparameterSet: fakeMacroparameterSet,
    macroparameterSetList: [],
    updateMacroparameterSet: jest.fn(),
    addMacroparameterSetGroup: jest.fn(),
    addMacroparameter: jest.fn(),
    updateMacroparameterValue: jest.fn(),
    deleteMacroparameterValue: jest.fn(),
    requestChangeMacroparameterGroup: jest.fn(),
    requestDeleteMacroparameterGroup: jest.fn(),
    highlightArticle: jest.fn(),
    highlightArticleClear: jest.fn(),
  };
});

const renderComponent = (props: MacroparameterSetWrapperProps): RenderResult =>
  render(<MacroparameterSetWrapper {...props} />);

const findScenarioNameInput = (): HTMLElement =>
  screen.getByDisplayValue(fakeMacroparameterSet.caption ?? '');
const findYearsInput = (): HTMLElement =>
  screen.getByDisplayValue(`${fakeMacroparameterSet.years ?? 0}`);
const findCategorySelect = (): HTMLElement => screen.getByPlaceholderText('Реальная');
const findYearsStartSelect = (): HTMLElement =>
  screen.getByDisplayValue(`${fakeMacroparameterSet.yearStart ?? 0}`);
const findCheckbox = (): HTMLElement => screen.getByLabelText('Для всех проектов');

describe('MacroparameterSetWrapper', () => {
  test('snapshot test', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(
        <MacroparameterSetWrapper
          macroparameterSet={fakeMacroparameterSet}
          macroparameterSetList={[]}
          updateMacroparameterSet={jest.fn()}
          addMacroparameterSetGroup={jest.fn()}
          addMacroparameter={jest.fn()}
          updateMacroparameterValue={jest.fn()}
          deleteMacroparameterValue={jest.fn()}
          requestChangeMacroparameterGroup={jest.fn()}
          requestDeleteMacroparameterGroup={jest.fn()}
          highlightArticle={jest.fn()}
          highlightArticleClear={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('renders correctly', () => {
    renderComponent(fakeRenderProps);
    expect(findScenarioNameInput()).toBeInTheDocument();
    expect(findYearsInput()).toBeInTheDocument();
    expect(findCategorySelect()).toBeInTheDocument();
    expect(findYearsStartSelect()).toBeInTheDocument();
    expect(findCheckbox()).toBeInTheDocument();
  });
  // TODO: fix this test
  /*  test('Изменение названия сценария вызывает функцию', () => {
    const fakeCallback = jest.fn();
    renderComponent({ ...fakeRenderProps, updateMacroparameterSet: fakeCallback });

    const scenarioNameInput: HTMLElement = screen.getByDisplayValue(
      fakeMacroparameterSet.caption ?? '',
    );

    fireEvent.change(scenarioNameInput, { target: { value: 'Новый набор' } });
    expect(scenarioNameInput).toHaveAttribute('value', 'Новый набор');
    fireEvent.blur(scenarioNameInput);
    expect(fakeCallback).toBeCalledTimes(1);
  }); */
  test('Изменение количества лет вызывает функцию', () => {
    const fakeCallback = jest.fn();
    renderComponent({ ...fakeRenderProps, updateMacroparameterSet: fakeCallback });

    const yearsInput: HTMLElement = screen.getByPlaceholderText(`Количество лет`);

    fireEvent.change(yearsInput, { target: { value: '20' } });
    expect(yearsInput).toHaveAttribute('value', '20');
    fireEvent.blur(yearsInput);
    expect(fakeCallback).toBeCalledTimes(1);
  });
  // TODO:mock selects?
  /* test('Изменение вида оценки вызывает функцию', () => {
    const fakeCallback = jest.fn();
    renderComponent({...fakeRenderProps, updateMacroparameterSet: fakeCallback});

    const categorySelect: HTMLElement = screen.getByDisplayValue('Реальная');

    fireEvent.change(categorySelect, {target: {value: 'SET_CATEGORY_NOMINAL',label:'Номинальная'}});
    expect(categorySelect).toHaveAttribute('value', 'SET_CATEGORY_NOMINAL');
    fireEvent.blur(categorySelect);
    expect(fakeCallback).toBeCalledTimes(1);
  }); */
  test('изменение чекбокса вызывает колбэк', () => {
    const fakeCallback = jest.fn();
    renderComponent({ ...fakeRenderProps, updateMacroparameterSet: fakeCallback });

    fireEvent.click(findCheckbox());
    expect(fakeCallback).toBeCalledTimes(1);
  });
  test('срабатывают ивенты на добавление группы', () => {
    const fakeAddGroup = jest.fn();
    renderComponent({ ...fakeRenderProps, addMacroparameterSetGroup: fakeAddGroup });

    const addToggle: HTMLElement = screen.getByText(/Добавить группу статей/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText(
      'Введите название группы статей',
    );
    const addGroupButton: HTMLElement = screen.getByText('Добавить группу');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupButton);
    expect(fakeAddGroup).toBeCalledTimes(1);
  });

  test('отмена добавления группы', () => {
    const fakeAddGroup = jest.fn();
    renderComponent({ ...fakeRenderProps, addMacroparameterSetGroup: fakeAddGroup });

    const addToggle: HTMLElement = screen.getByText(/добавить группу статей/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText(
      'Введите название группы статей',
    );
    const addGroupCancelButton: HTMLElement = screen.getByText('Отмена');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupCancelButton);
    expect(fakeAddGroup).toBeCalledTimes(0);
  });
});
