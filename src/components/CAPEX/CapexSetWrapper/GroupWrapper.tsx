import React, { useState } from 'react';
import { Button, Form, IconAdd, IconSelect, Text, TextField } from '@gpn-prototypes/vega-ui';

import CapexExpense, { CapexExpenseValues } from '../../../../types/CapexExpense';
import CapexExpenseSetGroup from '../../../../types/CapexExpenseSetGroup';
import keyGen from '../../../helpers/keyGenerator';
import { cnGroupsContainer } from '../../../styles/GroupsContainer/cn-groups-container';

import { CapexWrapper } from './CapexWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../../styles/GroupsContainer/GroupsContainer.css';

interface CapexSetWrapperGroupProps {
  group: CapexExpenseSetGroup;
  // removeGroup: (group: CapexExpenseSetGroup) => void;
  // /!* requestSetUpdate: () => void; *!/
}

export const GroupWrapper = ({
  group,
}: //  removeGroup /* , requestSetUpdate */,
CapexSetWrapperGroupProps) => {
  const [isAddingCapex, setIsAddingCapex] = useState(false);
  const [newCapexName, setNewCapexName] = useState('');
  const [capexes, setCapexes] = useState(group.capexExpenseList as CapexExpense[]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const editCapexes = (capex: CapexExpense): void => {
    setCapexes((prevCapexes) => [...prevCapexes, capex]);
  };

  const toggleCapex = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingCapex(!isAddingCapex);
    setNewCapexName('');
  };

  const addCapex = (event: any, capexName: string): void => {
    editCapexes({
      name: capexName,
      caption: capexName,
      value: [] as CapexExpenseValues[],
    });
    toggleCapex(event);
  };

  /*  const removeCapex = (capex: CapexExpense): void => {
        setCapexes((prevCapexes) =>
          prevCapexes.filter(
            (prevCapex) => prevCapex.name !== capex.name,
          ),
        );
      }; */

  return (
    <div className={cnGroupsContainer()}>
      <div className={cnGroupsContainer('header')}>
        <div
          className={cnGroupsContainer('header-name', { collapse: isCollapsed })}
          onClick={() => setIsCollapsed(!isCollapsed)}
          role="presentation"
        >
          <IconSelect size="xs" />
          <Text as="span">{group.caption}</Text>
        </div>
        <div className={cnGroupsContainer('header-actions')}>
          <Button
            onlyIcon
            size="xs"
            view="ghost"
            iconLeft={IconAdd}
            // onClick={() => removeGroup(group)}
          />
        </div>
      </div>
      {capexes?.length > 0 && (
        <div className={cnGroupsContainer('body', { hidden: isCollapsed })}>
          {capexes.map((capex, index) => (
            <CapexWrapper
              key={keyGen(index)}
              capex={capex}
              // removeCapex={removeCapex}
            />
          ))}
        </div>
      )}
      <div className={cnGroupsContainer('footer', { hidden: isCollapsed })}>
        {!isAddingCapex && (
          <div
            className={cnGroupsContainer('footer-action')}
            role="presentation"
            onClick={toggleCapex}
          >
            <IconAdd size="s" />
            <Text as="span">Добавить статью</Text>
          </div>
        )}
        {isAddingCapex && (
          <div className={cnGroupsContainer('footer-new-item')}>
            <Form.Row col="1" gap="m">
              <Form.Field>
                <TextField
                  width="full"
                  placeholder="Название статьи"
                  type="text"
                  maxLength={150}
                  value={newCapexName}
                  onChange={(event: any) => setNewCapexName(event.e.target.value)}
                />
              </Form.Field>
            </Form.Row>
            <Form.Row col="2" gap="m">
              <Button
                label="Добавить статью"
                view="ghost"
                disabled={!newCapexName.length}
                onClick={(e) => addCapex(e, newCapexName)}
              />
              <Button label="Отмена" view="clear" onClick={toggleCapex} />
            </Form.Row>
          </div>
        )}
      </div>
    </div>
  );
};
