import React, { useState } from 'react';
import {
  Button,
  Form,
  IconAdd,
  IconClose,
  IconSelect,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';

import Macroparameter, { MacroparameterValues } from '../../../types/Macroparameter';
import MacroparameterSetGroup from '../../../types/MacroparameterSetGroup';
import keyGen from '../../helpers/keyGenerator';
import { cnGroupsContainer } from '../../styles/GroupsContainer/cn-groups-container';

import { MacroparameterWrapper } from './MacroparameterWrapper';

import '../../styles/BlockWrapper/BlockWrapper.css';
import '../../styles/GroupsContainer/GroupsContainer.css';

interface MacroparameterSetWrapperGroupProps {
  group: MacroparameterSetGroup;
  removeGroup: (group: MacroparameterSetGroup) => void;
  /* requestSetUpdate: () => void; */
}

export const GroupWrapper = ({
  group,
  removeGroup /* , requestSetUpdate */,
}: MacroparameterSetWrapperGroupProps) => {
  const [isAddingMacroparameter, setIsAddingMacroparameter] = useState(false);
  const [newMacroparameterName, setNewMacroparameterName] = useState('');
  const [macroparameters, setMacroparameters] = useState(
    group.macroparameterList as Macroparameter[],
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  const editMacroparameters = (macroparameter: Macroparameter): void => {
    setMacroparameters((prevMacroparameters) => [...prevMacroparameters, macroparameter]);
  };

  const toggleMacroparameter = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingMacroparameter(!isAddingMacroparameter);
    setNewMacroparameterName('');
  };

  const addMacroparameter = (event: any, macroparameterName: string): void => {
    editMacroparameters({
      name: macroparameterName,
      caption: macroparameterName,
      value: [] as MacroparameterValues[],
    });
    toggleMacroparameter(event);
  };

  const removeMacroparameter = (macroparameter: Macroparameter): void => {
    setMacroparameters((prevMacroparameters) =>
      prevMacroparameters.filter(
        (prevMacroparameter) => prevMacroparameter.name !== macroparameter.name,
      ),
    );
  };

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
            iconLeft={IconClose}
            onClick={() => removeGroup(group)}
          />
        </div>
      </div>
      {macroparameters.length > 0 && (
        <div className={cnGroupsContainer('body', { hidden: isCollapsed })}>
          {macroparameters.map((macroparameter, index) => (
            <MacroparameterWrapper
              key={keyGen(index)}
              macroparameter={macroparameter}
              removeMacroparameter={removeMacroparameter}
            />
          ))}
        </div>
      )}
      <div className={cnGroupsContainer('footer', { hidden: isCollapsed })}>
        {!isAddingMacroparameter && (
          <div
            className={cnGroupsContainer('footer-action')}
            role="presentation"
            onClick={toggleMacroparameter}
          >
            <IconAdd size="s" />
            <Text as="span">Добавить статью</Text>
          </div>
        )}
        {isAddingMacroparameter && (
          <div className={cnGroupsContainer('footer-new-item')}>
            <Form.Row col="1" gap="m">
              <Form.Field>
                <TextField
                  width="full"
                  placeholder="Название статьи"
                  type="text"
                  maxLength={150}
                  value={newMacroparameterName}
                  onChange={(event: any) => setNewMacroparameterName(event.e.target.value)}
                />
              </Form.Field>
            </Form.Row>
            <Form.Row col="2" gap="m">
              <Button
                label="Добавить статью"
                view="ghost"
                disabled={!newMacroparameterName.length}
                onClick={(e) => addMacroparameter(e, newMacroparameterName)}
              />
              <Button label="Отмена" view="clear" onClick={toggleMacroparameter} />
            </Form.Row>
          </div>
        )}
      </div>
    </div>
  );
};
