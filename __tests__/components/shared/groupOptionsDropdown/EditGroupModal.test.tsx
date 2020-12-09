import * as React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  EditGroupModal,
  EditGroupModalProps,
} from '@/components/Shared/GroupOptionsDropdown/EditGroupModal/EditGroupModal';
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
  props: EditGroupModalProps<CapexExpenseSetGroup | OPEXGroup | MacroparameterSetGroup>,
): RenderResult => render(<EditGroupModal<any> {...props} />);

const findNameInput = (): HTMLElement => screen.getByPlaceholderText('Введите название');
const findSaveButton = (): HTMLElement => screen.getByText('Сохранить');
const findCancelButton = (): HTMLElement => screen.getByText('Отмена');

describe('EditGroupModal', () => {
  test('рендерится корректно', () => {
    expect(renderComponent).not.toThrow();
  });
  test('рендерится с правильно подставленным caption', () => {
    renderComponent({
      isOpen: true,
      group: fakeGroup,
      close: jest.fn(),
    });

    expect(findNameInput()).toHaveValue('Первоначальный взнос');
  });
  test('срабатывает ивент на изменение caption', () => {
    const fakeEditEvent = jest.fn();
    renderComponent({
      isOpen: true,
      group: fakeGroup,
      close: jest.fn(),
      callback: fakeEditEvent,
    });

    expect(findNameInput()).toHaveValue('Первоначальный взнос');
    fireEvent.change(findNameInput(), { target: { value: 'Новое имя' } });
    expect(findNameInput()).toHaveValue('Новое имя');
    fireEvent.click(findSaveButton());
    expect(fakeEditEvent).toBeCalledTimes(1);
  });
  test('срабатывает ивент на отмену изменения caption', () => {
    const fakeEditEvent = jest.fn();
    const fakeCancelEvent = jest.fn();
    renderComponent({
      isOpen: true,
      group: fakeGroup,
      close: fakeCancelEvent,
      callback: fakeEditEvent,
    });

    expect(findNameInput()).toHaveValue('Первоначальный взнос');
    fireEvent.change(findNameInput(), { target: { value: 'Новое имя' } });
    expect(findNameInput()).toHaveValue('Новое имя');
    fireEvent.click(findCancelButton());
    expect(fakeEditEvent).toBeCalledTimes(0);
    expect(fakeCancelEvent).toBeCalledTimes(1);
  });
});
