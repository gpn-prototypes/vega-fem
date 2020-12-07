import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

import { GroupWrapper } from '@/components/CAPEX/CapexSetWrapper/GroupWrapper';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
// import {render,screen,fireEvent} from "@testing-library/react";

let fakeGroup: CapexExpenseSetGroup;

beforeEach(() => {
  fakeGroup = {
    id: '1',
    name: 'oneTimePaymentGroup',
    caption: 'Первоначальный взнос',
    valueTotal: 1001000.0,
    capexExpenseList: [
      {
        id: '1',
        name: 'oneTimePaymentValue',
        caption: 'Значение разового платежа',
        valueTotal: 1000000.0,
      },
      {
        id: '2',
        name: 'secondTimePaymentValue',
        caption: 'Значение второго платежа',
        valueTotal: 1000,
      },
    ],
  };
});

describe('GroupWrapper', () => {
  test('рендерится без ошибок', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(
        // <GroupWrapper group={fakeGroup} requestAddCapex={jest.fn()} updateCapexValue={jest.fn()} />,
        <GroupWrapper
          group={fakeGroup}
          deleteCapexValue={jest.fn()}
          requestAddCapex={jest.fn()}
          requestChangeCapexGroup={jest.fn()}
          requestDeleteCapexGroup={jest.fn()}
          updateCapexValue={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('корректно рендерится при остутствии элементов в группе', () => {
    render(
      <GroupWrapper
        group={{ ...fakeGroup, capexExpenseList: [] }}
        deleteCapexValue={jest.fn()}
        requestAddCapex={jest.fn()}
        requestChangeCapexGroup={jest.fn()}
        requestDeleteCapexGroup={jest.fn()}
        updateCapexValue={jest.fn()}
      />,
    );
    expect(screen.getByText(/Пока не добавлена ни одна статья/i)).toBeInTheDocument();
  });
  /*  test('работает добавление статьи', () => {
    const fakeAdd = jest.fn();//TODO:fix integration test to

    render(<GroupWrapper group={fakeGroup} requestAddCapex={fakeAdd} updateCapexValue={() => {
    }}/>);

    const addArticleButton=screen.getByTitle(/добавить статью/i);
    fireEvent.click(addArticleButton);
    expect()
  }); */
});
