import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, IconAdd, TextField } from '@gpn-prototypes/vega-ui';

import CapexExpenseSetGroup from '../../../../types/CapexExpenseSetGroup';
import CapexSet from '../../../../types/CapexSet';
import CapexSetGlobalValue from '../../../../types/CapexSetGlobalValue';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';

import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../../styles/GroupsContainer/GroupsContainer.css';

interface CapexSetWrapperProps {
  capexSet: CapexSet;
  reservedValueSet: CapexSetGlobalValue;
  updateCapexSet: (capexSet: any) => void;
  addCapexSetGroup: (capexSetGroup: CapexExpenseSetGroup) => void;
}

export const CapexSetWrapper = ({
  capexSet,
  reservedValueSet,
  updateCapexSet,
  addCapexSetGroup,
}: CapexSetWrapperProps) => {
  const [reserveValue, setReserveValue] = useState(
    reservedValueSet?.value ? reservedValueSet.value : 20,
  );
  // const [years, setYears] = useState(capexSet.years);
  // const [yearStart,setYearStart]=useState(capexSet.yearStart);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [
    groups,
    setGroups,
  ] = useState([] /* capexSet.capexExpenseGroupList */ as CapexExpenseSetGroup[]);
  const [groupsHelper, setGroupsHelper] = useState(false);

  useEffect(() => {
    // setYears(capexSet.years);
    // setYearStart(capexSet.yearStart);
    setGroups(capexSet?.capexExpenseGroupList ?? []);
    console.log('capexSetUpdated');
  }, [capexSet]);

  const toggleCapexSetGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewGroupName('');
  };

  const requestGroupAdd = (groupName: string) => {
    addCapexSetGroup({
      caption: groupName,
    } as CapexExpenseSetGroup);
    setGroupsHelper(true);
  };

  const addGroup = (event: any, groupName: string): void => {
    // добавление группы
    toggleCapexSetGroup(event);
    requestGroupAdd(groupName);
  };

  /*  const removeGroup = (group: CapexExpenseSetGroup): void => {
      // setGroups((prevGroups) => prevGroups.filter((prevGroup) => prevGroup.name !== group.name));
    }; */

  const onChangeTypoHandler = (e: any, setter: (value: any) => void) => {
    setter(e.e.target.value);
  };

  const requestSetUpdate = useCallback(
    () => {
      // TODO: запрос на обновление reservedValue
      /* updateCapexSet({
      caption: name,
      name,
      years,
      category,
      capexGroupList: groups,
    } as CapexSet); */
    },
    [
      /* updateCapexSet, name, years, category, groups */
    ],
  );

  useEffect(() => {
    // при изменении состояния меняется
    if (groupsHelper) {
      console.log('groupsHelper: ', groupsHelper);
      setGroups(capexSet.capexExpenseGroupList as CapexExpenseSetGroup[]);
      setGroupsHelper(false);
    }
  }, [groupsHelper, capexSet]);

  return (
    <div className={cnBlockWrapper()}>
      <div className={cnBlockWrapper('content')}>
        <Form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault(); // изменить типичное поведение кнопки
          }}
        >
          <Form.Row col="1" gap="m">
            <Form.Field>
              <Form.Label htmlFor="capexSetName">Величина резерва</Form.Label>
              <TextField
                id="capexSetName"
                width="full"
                placeholder="Величина резерва"
                value={reserveValue.toString()}
                rightSide="%"
                onBlur={() => requestSetUpdate()}
                onChange={(e) => onChangeTypoHandler(e, setReserveValue)}
              />
            </Form.Field>
          </Form.Row>
          <Form.Row col="1" gap="m">
            {(groups ?? []).length > 0 &&
              groups.map((group, index) => (
                <GroupWrapper key={keyGen(index)} group={group} /* removeGroup={removeGroup} */ />
              ))}
            {!isAddingGroup && (
              <Button
                label="Добавить группу затрат"
                iconLeft={IconAdd}
                view="ghost"
                onClick={(e) => toggleCapexSetGroup(e)}
              />
            )}
            {isAddingGroup && (
              <div>
                <Form.Row col="1" gap="m">
                  <Form.Field>
                    <TextField
                      width="full"
                      id="capexSetGroupName"
                      placeholder="Название группы затрат"
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
                  <Button label="Отмена" view="clear" onClick={toggleCapexSetGroup} />
                </Form.Row>
              </div>
            )}
          </Form.Row>
        </Form>
      </div>
    </div>
  );
};
