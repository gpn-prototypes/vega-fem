import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, IconAdd, IconSelect, Text, TextField } from '@gpn-prototypes/vega-ui';

import CapexExpense from '../../../../types/CapexExpense';
import CapexExpenseSetGroup from '../../../../types/CapexExpenseSetGroup';
import CapexSet from '../../../../types/CapexSet';
import CapexSetGlobalValue from '../../../../types/CapexSetGlobalValue';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { FEMTable } from '../../FEMTable/FEMTable';

import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../../styles/VegaFormCustom/VegaFormCustom.css';

interface CapexSetWrapperProps {
  capexSet: CapexSet;
  reservedValueSet: CapexSetGlobalValue;
  addCapexSetGroup: (capexSetGroup: CapexExpenseSetGroup) => void;
  addCapex: (capex: CapexExpense, group: CapexExpenseSetGroup) => void;
  updateCapexGlobalValue: (reserveValue: CapexSetGlobalValue) => void;
  updateCapexValue: (capex: CapexExpense, group: CapexExpenseSetGroup) => void;
}

export const CapexSetWrapper = ({
  capexSet,
  reservedValueSet,
  updateCapexGlobalValue,
  addCapexSetGroup,
  addCapex,
  updateCapexValue,
}: CapexSetWrapperProps) => {
  const [reserveValue, setReserveValue] = useState(reservedValueSet.value);
  const [reserveValueId, setReserveValueId] = useState(reservedValueSet.id);
  // const [years, setYears] = useState(capexSet.years);
  // const [yearStart,setYearStart]=useState(capexSet.yearStart);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState(
    (capexSet?.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[],
  );

  useEffect(() => {
    if (reservedValueSet?.value) {
      setReserveValue(reservedValueSet.value);
    }
    if (reservedValueSet?.id) {
      setReserveValueId(reservedValueSet.id);
    }
    setGroups(capexSet?.capexExpenseGroupList ?? []);
  }, [reserveValueId, reservedValueSet, capexSet]);

  const toggleCapexSetGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewGroupName('');
  };

  const requestGroupAdd = (groupName: string) => {
    addCapexSetGroup({
      caption: groupName,
    } as CapexExpenseSetGroup);
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleCapexSetGroup(event);
    requestGroupAdd(groupName);
  };

  const onChangeTypoHandler = (e: any, setter: (value: any) => void) => {
    setter(e.e.target.value);
  };

  const requestSetGlobalValue = useCallback(() => {
    // TODO: запрос на обновление reservedValue
    console.log('reserveValue: ', reserveValue);
    updateCapexGlobalValue({
      id: reserveValueId,
      value: reserveValue,
    } as CapexSetGlobalValue);
  }, [updateCapexGlobalValue, reserveValue, reserveValueId]);

  return (
    <div className={cnBlockWrapper()}>
      <div className={cnBlockWrapper('title-wrapper')}>
        <div className={cnBlockWrapper('title')}>
          <Text as="span" size="xs" className={cnBlockWrapper('title-text')}>
            CAPEX
          </Text>
          <IconSelect size="xs" className={cnBlockWrapper('title-icon')} />
        </div>
      </div>
      <div className={cnBlockWrapper('content')}>
        {capexSet && !(Object.keys(capexSet).length === 0) ? (
          <>
            <Form
              className={cnVegaFormCustom()}
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
              }}
            >
              <Form.Row gap="m" space="none" className={cnVegaFormCustom('content-body')}>
                <Form.Row gap="m" space="none" className={cnVegaFormCustom('form-row')}>
                  <Form.Field>
                    <Form.Label htmlFor="capexSetReservedValue">Величина резерва</Form.Label>
                    <TextField
                      id="capexSetReservedValue"
                      size="s"
                      width="full"
                      value={reserveValue?.toString()}
                      rightSide="%"
                      onBlur={() => requestSetGlobalValue()}
                      onChange={(e) => onChangeTypoHandler(e, setReserveValue)}
                    />
                  </Form.Field>
                </Form.Row>
                <Form.Row
                  col="1"
                  gap="none"
                  space="none"
                  className={cnVegaFormCustom('groups-row')}
                >
                  {(groups ?? []).length > 0 &&
                    groups.map((group, index) => (
                      <GroupWrapper
                        key={keyGen(index)}
                        group={group}
                        requestAddCapex={addCapex}
                        updateCapexValue={updateCapexValue}
                      />
                    ))}
                </Form.Row>
              </Form.Row>
              <Form.Row col="1" gap="none" space="none" className={cnVegaFormCustom('footer')}>
                {!isAddingGroup && (
                  <Button
                    size="s"
                    label="Добавить группу затрат"
                    iconLeft={IconAdd}
                    view="ghost"
                    onClick={(e) => toggleCapexSetGroup(e)}
                  />
                )}
                {isAddingGroup && (
                  <div>
                    <Text as="span" view="secondary" size="s">
                      Название группы затрат
                    </Text>
                    <Form.Row col="1" gap="none" className={cnVegaFormCustom('footer-text-field')}>
                      <Form.Field>
                        <TextField
                          size="s"
                          width="full"
                          id="capexSetGroupName"
                          type="text"
                          maxLength={150}
                          value={newGroupName}
                          onChange={(event: any) => setNewGroupName(event.e.target.value)}
                        />
                      </Form.Field>
                    </Form.Row>
                    <Form.Row className={cnVegaFormCustom('footer-action')}>
                      <Button
                        size="s"
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
            <FEMTable
              entity={capexSet}
              secondaryColumn="valueTotal"
              headers={['', 'Статья', 'Суммарное']}
            />
          </>
        ) : (
          <div />
          // <CapexSetPlaceholder text="Выберите один из макроэкономических сценариев" />
        )}
      </div>
    </div>
  );
};
