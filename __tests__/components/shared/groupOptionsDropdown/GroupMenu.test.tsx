import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  GroupMenu,
  GroupMenuOptions,
} from '@/components/Shared/GroupOptionsDropdown/GroupMenu/GroupMenu';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '@/types/OPEX/OPEXGroup';

let fakeGroup: CapexExpenseSetGroup;

beforeAll(() => {
  fakeGroup = {
    id: '1',
    name: 'oneTimePaymentGroup',
    caption: 'Первоначальный взнос',
  };
});

const renderComponent = (
  props: GroupMenuOptions<CapexExpenseSetGroup | OPEXGroup | MacroparameterSetGroup>,
): RenderResult => render(<GroupMenu<any> {...props} />);

const findAddButton = (): HTMLElement => screen.getByTitle('Добавить статью');
const findEditButton = (): HTMLElement => screen.getByTitle('Переименовать');
const findDeleteButton = (): HTMLElement => screen.getByTitle('Удалить');

const findAddModal = (): HTMLElement => screen.getByText('Добавление новой статьи');
const findEditModal = (): HTMLElement => screen.getByText('Переименование группы');
const findDeleteModal = (): HTMLElement => screen.getByText('Предупреждение');

describe('GroupMenu', () => {
  test('рендерится корректно', () => {
    expect(renderComponent).not.toThrow();
  });
  test('открытие модального окна на добавление статьи', () => {
    renderComponent({
      group: fakeGroup,
      onClose: jest.fn(),
      requestAddArticle: jest.fn(),
      requestChangeGroup: jest.fn(),
      requestDeleteGroup: jest.fn(),
    });
    fireEvent.click(findAddButton());
    expect(findAddModal()).toBeInTheDocument();
  });
  test('открытие модального окна на редактирование статьи', () => {
    renderComponent({
      group: fakeGroup,
      onClose: jest.fn(),
      requestAddArticle: jest.fn(),
      requestChangeGroup: jest.fn(),
      requestDeleteGroup: jest.fn(),
    });
    fireEvent.click(findEditButton());
    expect(findEditModal()).toBeInTheDocument();
  });
  test('открытие модального окна на удаление статьи', () => {
    renderComponent({
      group: fakeGroup,
      onClose: jest.fn(),
      requestAddArticle: jest.fn(),
      requestChangeGroup: jest.fn(),
      requestDeleteGroup: jest.fn(),
    });
    fireEvent.click(findDeleteButton());
    expect(findDeleteModal()).toBeInTheDocument();
  });
});
