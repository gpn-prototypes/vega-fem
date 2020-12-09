import React from 'react';
import { Button, Dropdown, IconKebab } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';

import { GroupMenu } from './GroupMenu/GroupMenu';
import { cnGroupOptionsDropdown } from './cn-group-options-dropdown';

import './GroupOptionsDropdown.css';

export interface GroupOptions<GroupType> {
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
      placement="bottom-start"
      isOpen={isOpen}
      onToggle={(nextState): void => {
        setIsOpen(nextState);
      }}
    >
      <Dropdown.Trigger>
        {({ toggle, props: { ref, ...triggerProps } }): React.ReactNode => (
          <Button
            type="button"
            size="s"
            label="Опции"
            onlyIcon
            iconLeft={IconKebab}
            view="ghost"
            ref={ref}
            onClick={toggle}
            {...triggerProps}
          />
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {({ props: menuProps }): React.ReactNode => (
          <div className={cnGroupOptionsDropdown('menu')} {...menuProps}>
            <GroupMenu
              onClose={() => setIsOpen(false)}
              group={group}
              requestAddArticle={requestAddArticle}
              requestChangeGroup={requestChangeGroup}
              requestDeleteGroup={requestDeleteGroup}
            />
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
