import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import { GroupOptionsDropdown } from '../../../../src/components/Shared/GroupOptionsDropdown/GroupOptionsDropdown';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';

let fakeGroup: CapexExpenseSetGroup;

beforeAll(() => {
  fakeGroup = {
    id: '1',
    name: 'oneTimePaymentGroup',
    caption: 'Первоначальный взнос',
  };
});

describe('GroupOptionsDropdown', () => {
  test('рендерится корректно', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(
        <GroupOptionsDropdown
          group={fakeGroup}
          requestAddArticle={jest.fn()}
          requestChangeGroup={jest.fn()}
          requestDeleteGroup={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
