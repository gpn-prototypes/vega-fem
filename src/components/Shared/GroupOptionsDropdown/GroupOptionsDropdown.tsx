import React from 'react';
import { Dropdown } from '@gpn-prototypes/vega-dropdown';
import { Button, IconKebab } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';

import { GroupMenu } from './GroupMenu/GroupMenu';

interface GroupOptions {
  group: OPEXGroup | CapexExpenseSetGroup | MacroparameterSetGroup;
  requestAddArticle: (
    article: Article,
    group: OPEXGroup | CapexExpenseSetGroup | MacroparameterSetGroup,
  ) => void;
  requestChangeGroup: (group: OPEXGroup | CapexExpenseSetGroup | MacroparameterSetGroup) => void;
  requestDeleteGroup: (group: OPEXGroup | CapexExpenseSetGroup | MacroparameterSetGroup) => void;
}

export const GroupOptionsDropdown = ({
  group,
  requestAddArticle,
  requestChangeGroup,
  requestDeleteGroup,
}: GroupOptions) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dropdown
      placement="top-start"
      isOpen={isOpen}
      onToggle={(nextState): void => {
        setIsOpen(nextState);
      }}
    >
      <Dropdown.Trigger>
        {({ toggle }): React.ReactNode => (
          <Button
            type="button"
            size="s"
            label="Опции"
            onlyIcon
            iconLeft={IconKebab}
            view="ghost"
            onClick={toggle}
          />
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {(): React.ReactNode => (
          <GroupMenu
            group={group}
            requestAddArticle={requestAddArticle}
            requestChangeGroup={requestChangeGroup}
            requestDeleteGroup={requestDeleteGroup}
          />
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
