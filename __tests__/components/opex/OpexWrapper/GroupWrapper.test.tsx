import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { GroupWrapper, GroupWrapperProps } from '@/components/OPEX/OPEXWrapper/GroupWrapper';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

let fakeGroup: OPEXGroup;
let defaultProps: GroupWrapperProps;

beforeAll(() => {
  fakeGroup = {
    id: '1',
    name: 'opex',
    caption: 'OPEXCaption',
    yearStart: 2010,
    yearEnd: 2015,
    opexExpenseList: [
      {
        id: '1',
        name: 'firstArticle',
        caption: 'first article',
        unit: '₽/$',
        value: 54.9,
      },
      {
        id: '2',
        name: 'secondArticle',
        caption: 'second article',
        unit: '₽/€',
        value: 63.2,
      },
    ],
  };
  defaultProps = {
    group: fakeGroup,
    groupName: fakeGroup.caption,
    removeGroup: jest.fn(),
    addArticle: jest.fn(),
    deleteArticle: jest.fn(),
    updateArticle: jest.fn(),
  };
});

const renderComponent = (props: GroupWrapperProps) => render(<GroupWrapper {...props} />);

const findGroup = (): HTMLElement =>
  screen.getByText(fakeGroup?.caption ? fakeGroup.caption : 'OPEXCaption');
const findArticle = (): HTMLElement => screen.getByTestId('groupWrapper-body');
// const findYearInput = (): HTMLElement => screen.getByDisplayValue(`${fakeGroup?.yearEnd ? fakeGroup.yearEnd : 2015}`);

describe('Opex GroupWrapper', () => {
  test('renders correctly with non empty opexExpenseList', () => {
    renderComponent(defaultProps);
    expect(findGroup()).toBeInTheDocument();
    expect(
      screen.getByText(
        fakeGroup?.opexExpenseList[0].caption
          ? fakeGroup.opexExpenseList[0].caption
          : 'first article',
      ),
    ).toBeInTheDocument();
  });

  test('renders correctly with empty opexExpenseList', () => {
    renderComponent({ ...defaultProps, group: { ...fakeGroup, opexExpenseList: [] } });
    expect(findGroup()).toBeInTheDocument();
    expect(screen.getByText('Пустой кейс')).toBeInTheDocument();
  });

  test('renders correctly with collapsed:false', () => {
    renderComponent({ ...defaultProps, isCollapsed: { id: 1, collapsed: false } });
    expect(findGroup()).toBeInTheDocument();
    expect(findArticle()).not.toHaveClass('GroupWrapper__body_hidden');
  });

  test('renders correctly with collapsed:true', () => {
    renderComponent({ ...defaultProps, isCollapsed: { id: 1, collapsed: true } });
    expect(findGroup()).toBeInTheDocument();
    expect(findArticle()).toHaveClass('GroupWrapper__body_hidden');
  });

  test('collapsing correctly', () => {
    const fakeCollapseEvent = jest.fn();
    renderComponent({
      ...defaultProps,
      isCollapsed: { id: 1, collapsed: true },
      isCollapsedCallback: fakeCollapseEvent,
    });

    expect(findArticle()).toHaveClass('GroupWrapper__body_hidden');
    fireEvent.click(findGroup());
    expect(findArticle()).not.toHaveClass('GroupWrapper__body_hidden');
  });

  /* test('Предустановленные группы рендерятся корректно', () => {
    renderComponent({ ...defaultProps, groupName: 'Автовывоз', isPreset: true });

    expect(
      screen.getByDisplayValue(`${fakeGroup?.yearEnd ? fakeGroup.yearEnd : 2015}`),
    ).toBeInTheDocument();
    expect(findArticle()).toBeInTheDocument();
  }); */
  // TODO: поправить тест после исправления селекта
  /* test('Срабатывает ивент на изменение года окончания', () => {
    const mockCallback = jest.fn();
    renderComponent({
      ...defaultProps,
      groupName: 'Автовывоз',
      isPreset: true,
      updateGroup: mockCallback
    });

    expect(findYearInput()).toBeInTheDocument();
    fireEvent.change(findYearInput(), {target: {value: '2025'}});
    expect(mockCallback).toBeCalledTimes(1);
  }); */
});
