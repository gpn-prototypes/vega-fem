import React from 'react';
import { Dropdown } from '@gpn-prototypes/vega-dropdown';
import { Button, IconKebab } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';

import { GroupMenu } from './GroupMenu/GroupMenu';

interface GroupOptions<GroupType> {
  group: GroupType;
  requestAddArticle: (article: Article, group: GroupType) => void;
  requestChangeGroup?: (group: GroupType) => void;
  requestDeleteGroup: (group: GroupType) => void;
}

export const GroupOptionsDropdown = <GroupType,>({
  group,
  requestAddArticle,
  requestChangeGroup,
  requestDeleteGroup,
}: GroupOptions<GroupType>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dropdown
      placement="bot-start"
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
