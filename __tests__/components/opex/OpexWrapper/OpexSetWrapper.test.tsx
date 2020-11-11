import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  OPEXSetWrapper,
  OPEXWrapperProps,
} from '../../../../src/components/OPEX/OPEXWrapper/OPEXSetWrapper';
import OPEXSetType from '../../../../types/OPEX/OPEXSetType';

jest.mock(
  '../../../../src/containers/OPEX/OPEXArrangementTableContainer',
  () => 'opex-arrangement-table',
);
jest.mock('../../../../src/containers/OPEX/OPEXEconomyTableContainer', () => 'opex-economy-table');

let defaultOPEXWrapperProps: OPEXWrapperProps;
let economicDefaultOPEXWrapperProps: OPEXWrapperProps;
let fakeOPEXSetType: OPEXSetType;

beforeAll(() => {
  fakeOPEXSetType = {
    sdf: true,
    hasAutoexport: true,
    autoexport: {
      yearStart: 2015,
      yearEnd: 2018,
      opexExpenseList: [
        {
          id: '1',
          name: 'additionalCosts',
          caption: 'Дополнительные затраты на автовывоз',
          unit: 'тыс. ₽',
          valueTotal: 400,
        },
      ],
    },
    hasMkos: true,
    mkos: {
      yearStart: 2015,
      yearEnd: 2030,
      opexExpenseList: [
        {
          id: '1',
          name: 'numberOfDays',
          caption: 'Количество дней использования МКОС за год',
          unit: 'дней',
          valueTotal: 5840,
        },
      ],
    },
    opexCaseList: [
      {
        id: '1',
        name: 'oil',
        caption: 'Нефтяной',
        yearStart: 2015,
        yearEnd: 2030,
        opexExpenseList: [],
      },
      {
        id: '2',
        name: 'gas',
        caption: 'Газовый',
        yearStart: 2015,
        yearEnd: 2030,
        opexExpenseList: [],
      },
    ],
  };
  defaultOPEXWrapperProps = {
    OPEXSetInstance: fakeOPEXSetType,
    OPEXChangeAutoexport: jest.fn(),
    OPEXDeleteAutoexport: jest.fn(),
    OPEXChangeAutoexportExpense: jest.fn(),
    OPEXDeleteAutoexportExpense: jest.fn(),
    OPEXChangeMKOS: jest.fn(),
    OPEXDeleteMKOS: jest.fn(),
    OPEXChangeMKOSExpense: jest.fn(),
    OPEXDeleteMKOSExpense: jest.fn(),
    OPEXCreateCase: jest.fn(),
    OPEXDeleteCase: jest.fn(),
    OPEXChangeCase: jest.fn(),
    OPEXChangeCaseExpense: jest.fn(),
    OPEXDeleteCaseExpense: jest.fn(),
    OPEXAddCaseExpense: jest.fn(),
    OPEXAddAutoexportExpense: jest.fn(),
    OPEXAddMKOSExpense: jest.fn(),
    OPEXUpdateSdf: jest.fn(),
    selectedRole: { name: 'Обустройство' },
    highlightArticle: jest.fn(),
    highlightArticleClear: jest.fn(),
  };

  economicDefaultOPEXWrapperProps = {
    ...defaultOPEXWrapperProps,
    selectedRole: { name: 'Экономика' },
  };
});

const renderComponent = (props: OPEXWrapperProps): RenderResult =>
  render(<OPEXSetWrapper {...props} />);

const findAutoexport = (): HTMLElement => screen.getByText('Автовывоз');
const findMKOS = (): HTMLElement => screen.getByText('Аренда МКОС');

describe('OpexSetWrapper обустройство', () => {
  test('snapshot test', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(<OPEXSetWrapper {...defaultOPEXWrapperProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with hasAutoexport=true,hasMkos=true', () => {
    renderComponent({
      ...defaultOPEXWrapperProps,
      OPEXSetInstance: { ...fakeOPEXSetType },
    });
    expect(findAutoexport).not.toThrow();
    expect(findMKOS).not.toThrow();
  });
  test('renders correctly with hasAutoexport=false,hasMkos=true', () => {
    renderComponent({
      ...defaultOPEXWrapperProps,
      OPEXSetInstance: { ...fakeOPEXSetType, hasAutoexport: false },
    });
    expect(findAutoexport).toThrow();
    expect(findMKOS).not.toThrow();
  });
  test('renders correctly with hasAutoexport=true,hasMkos=false', () => {
    renderComponent({
      ...defaultOPEXWrapperProps,
      OPEXSetInstance: { ...fakeOPEXSetType, hasMkos: false },
    });
    expect(findAutoexport).not.toThrow();
    expect(findMKOS).toThrow();
  });
  test('renders correctly with hasAutoexport=false,hasMkos=false', () => {
    renderComponent({
      ...defaultOPEXWrapperProps,
      OPEXSetInstance: { ...fakeOPEXSetType, hasAutoexport: false, hasMkos: false },
    });
    expect(findAutoexport).toThrow();
    expect(findMKOS).toThrow();
  });
});

const findSdfCheckbox = (): HTMLElement => screen.getByLabelText(/СДФ/);

describe('OpexSetWrapper Эконопмика', () => {
  test('snapshot test', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(<OPEXSetWrapper {...economicDefaultOPEXWrapperProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('срабатывает ивент на изменение sdf', () => {
    const fakeCallback = jest.fn();
    renderComponent({ ...economicDefaultOPEXWrapperProps, OPEXUpdateSdf: fakeCallback });
    expect(findSdfCheckbox()).toBeInTheDocument();
    expect(fakeCallback).toBeCalledTimes(0);
    fireEvent.click(findSdfCheckbox());
    expect(fakeCallback).toBeCalledTimes(1);
  });

  test('срабатывают ивенты на добавление группы', () => {
    const fakeAddGroup = jest.fn();
    renderComponent({ ...economicDefaultOPEXWrapperProps, OPEXCreateCase: fakeAddGroup });

    const addToggle: HTMLElement = screen.getByText(/Добавить кейс/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText('Введите название кейса');
    const addGroupButton: HTMLElement = screen.getByText('Добавить кейс');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupButton);
    expect(fakeAddGroup).toBeCalledTimes(1);
  });

  test('отмена добавления группы', () => {
    const fakeAddGroup = jest.fn();
    renderComponent({ ...economicDefaultOPEXWrapperProps, OPEXCreateCase: fakeAddGroup });

    const addToggle: HTMLElement = screen.getByText(/добавить кейс/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText('Введите название кейса');
    const addGroupCancelButton: HTMLElement = screen.getByText('Отмена');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupCancelButton);
    expect(fakeAddGroup).toBeCalledTimes(0);
  });
});
