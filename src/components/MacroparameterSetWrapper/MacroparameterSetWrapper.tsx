import React, { useCallback, useEffect, useState } from 'react';
import { Select } from '@gpn-design/uikit/__internal__/src/components/Select';
import { Checkbox } from '@gpn-design/uikit/Checkbox';
import { Button, Form, IconAdd, IconSelect, Text, TextField } from '@gpn-prototypes/vega-ui';

import MacroparameterSet from '../../../types/MacroparameterSet';
import MacroparameterSetGroup from '../../../types/MacroparameterSetGroup';
import macroparameterSetCategoryOptions from '../../constants/MacroparameterSetCategoryOptions';
import keyGen from '../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../styles/BlockWrapper/cn-block-wrapper';

import { GroupWrapper } from './GroupWrapper';

import '../../styles/BlockWrapper/BlockWrapper.css';
import '../../styles/GroupsContainer/GroupsContainer.css';

interface MacroparameterSetWrapperProps {
  macroparameterSet: MacroparameterSet;
  updateMacroparameterSet: (macroparameterSet: any) => void;
  addMacroparameterSetGroup: (macroparameterSetGroup: MacroparameterSetGroup) => void;
}

export const MacroparameterSetWrapper = ({
  macroparameterSet,
  updateMacroparameterSet,
  addMacroparameterSetGroup,
}: MacroparameterSetWrapperProps) => {
  const [asTemplate, setAsTemplate] = useState(false);

  const [name, setName] = useState(macroparameterSet.caption);
  const [years, setYears] = useState(macroparameterSet.years);
  const [category, setCategory] = useState(macroparameterSet.category);
  /* help to call requestSetUpdate with updated category after Select choice */
  const [categoryHelper, setCategoryHelper] = useState(false);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState(
    macroparameterSet.macroparameterGroupList as MacroparameterSetGroup[],
  );
  const [groupsHelper, setGroupsHelper] = useState(false);

  useEffect(() => {
    setName(macroparameterSet.caption);
    setYears(macroparameterSet.years);
    setCategory(macroparameterSet.category);
    setGroups(macroparameterSet.macroparameterGroupList ?? []);
    console.log('macroparameterSetUpdated')
  }, [macroparameterSet]);

  const toggleMacroparameterSetGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewGroupName('');
  };

  const requestGroupAdd = (groupName: string) => {
    addMacroparameterSetGroup({
      name: groupName,
      caption: groupName,
    } as MacroparameterSetGroup);
    setGroupsHelper(true);
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleMacroparameterSetGroup(event);
    requestGroupAdd(groupName);
    // editGroups({name: groupName, caption: groupName, macroparameterList: [] as Macroparameter[]});
  };

  /* const editGroups = (group: MacroparameterSetGroup): void => {
    setGroups((prevGroups) => [...prevGroups, group]);
  }; */

  const removeGroup = (group: MacroparameterSetGroup): void => {
    setGroups((prevGroups) => prevGroups.filter((prevGroup) => prevGroup.name !== group.name));
  };

  const onChangeTypoHandler = (e: any, setter: (value: any) => void) => {
    setter(e.e.target.value);
  };

  const requestSetUpdate = useCallback(() => {
    updateMacroparameterSet({
      caption: name,
      name,
      years,
      category,
      macroparameterGroupList: groups,
    } as MacroparameterSet);
  }, [updateMacroparameterSet, name, years, category, groups]);

  useEffect(() => {
    if (categoryHelper) {
      requestSetUpdate();
      setCategoryHelper(false);
    }
  }, [category, categoryHelper, requestSetUpdate]);

  useEffect(() => {
    if (groupsHelper) {
      console.log('groupsHelper: ', groupsHelper);
      setGroups(macroparameterSet.macroparameterGroupList as MacroparameterSetGroup[]);
      setGroupsHelper(false);
    }
  }, [groupsHelper, macroparameterSet]);

  return (
    <div className={cnBlockWrapper()}>
      <div className={cnBlockWrapper('title-wrapper')}>
        <div className={cnBlockWrapper('title')}>
          <Text as="span" size="xs" className={cnBlockWrapper('title-text')}>
            Макропараметры
          </Text>
          <IconSelect size="xs" className={cnBlockWrapper('title-icon')} />
        </div>
      </div>
      <div className={cnBlockWrapper('content')}>
        <Form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
          }}
        >
          <Form.Row col="2" gap="m">
            <Form.Field>
              <Form.Label>Название сценария</Form.Label>
              <TextField
                id="macroparameterSetName"
                width="full"
                placeholder="Название сценария"
                value={name}
                onBlur={() => requestSetUpdate()}
                onChange={(e) => onChangeTypoHandler(e, setName)}
              />
            </Form.Field>
            <Form.Field>
              <Form.Label>Количество лет</Form.Label>
              <TextField
                id="macroparameterSetYears"
                width="full"
                placeholder="Количество лет"
                value={years?.toString()}
                onBlur={() => requestSetUpdate()}
                onChange={(e) => onChangeTypoHandler(e, setYears)}
              />
            </Form.Field>
            <Form.Field>
              <Form.Label>Вид оценки</Form.Label>
              <Select
                options={macroparameterSetCategoryOptions}
                name="macroparameterSetCategory"
                value={category}
                onClearValue={() => null}
                onChange={(selectValue: any) => {
                  setCategory(selectValue);
                  setCategoryHelper(true);
                }}
              />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="macroparameterSetIsTemplate">
                <Checkbox
                  name="macroparameterSetIsTemplate"
                  label="Для всех проектов"
                  checked={asTemplate}
                  onChange={() => setAsTemplate((prevAsTemplate) => !prevAsTemplate)}
                />
              </Form.Label>
            </Form.Field>
          </Form.Row>
          <Form.Row col="1" gap="m">
            {(groups ?? []).length > 0 &&
              groups.map((group, index) => (
                <GroupWrapper key={keyGen(index)} group={group} removeGroup={removeGroup} />
              ))}
            {!isAddingGroup && (
              <Button
                label="Добавить группу статей"
                iconLeft={IconAdd}
                view="ghost"
                onClick={(e) => toggleMacroparameterSetGroup(e)}
              />
            )}
            {isAddingGroup && (
              <div>
                <Form.Row col="1" gap="m">
                  <Form.Field>
                    <TextField
                      width="full"
                      id="macroparameterSetGroupName"
                      placeholder="Название группы статей"
                      type="text"
                      maxLength={150}
                      value={newGroupName}
                      onChange={(event: any) => setNewGroupName(event.e.target.value)}
                    />
                  </Form.Field>
                </Form.Row>
                <Form.Row col="2" gap="m">
                  <Button
                    label="Добавить группу"
                    view="ghost"
                    disabled={!newGroupName.length}
                    onClick={(e) => addGroup(e, newGroupName)}
                  />
                  <Button label="Отмена" view="clear" onClick={toggleMacroparameterSetGroup} />
                </Form.Row>
              </div>
            )}
          </Form.Row>
        </Form>
      </div>
    </div>
  );
};
