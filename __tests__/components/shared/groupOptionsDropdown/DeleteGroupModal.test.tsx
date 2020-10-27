import * as React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  DeleteGroupModal,
  DeleteGroupModalProps,
} from '../../../../src/components/Shared/GroupOptionsDropdown/DeleteGroupModal/DeleteGroupModal';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';

let fakeGroup: CapexExpenseSetGroup;

beforeAll(() => {
  fakeGroup = {
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
  };
});
// TODO: change any
const renderComponent = (
  props: DeleteGroupModalProps<CapexExpenseSetGroup | OPEXGroup | MacroparameterSetGroup>,
): RenderResult => render(<DeleteGroupModal<any> {...props} />);

const findDeleteButton = (): HTMLElement => screen.getByText('Удалить');
const findCancelButton = (): HTMLElement => screen.getByText('Отмена');

describe('DeleteGroupModal', () => {
  test('рендерится корректно', () => {
    expect(renderComponent).not.toThrow();
  });
  test('срабатывает удаление', () => {
    const fakeDeleteEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      isOpen: true,
      group: fakeGroup,
      callback: fakeDeleteEvent,
    });

    fireEvent.click(findDeleteButton());
    expect(fakeDeleteEvent).toBeCalledTimes(1);
  });
  test('срабатывает отмена удаления', () => {
    const fakeDeleteEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      isOpen: true,
      group: fakeGroup,
      callback: fakeDeleteEvent,
    });

    fireEvent.click(findCancelButton());
    expect(fakeDeleteEvent).toBeCalledTimes(0);
  });
});
