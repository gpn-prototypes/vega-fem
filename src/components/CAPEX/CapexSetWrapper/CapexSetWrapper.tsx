import React, { useEffect, useState } from 'react';
import { Button, Form, IconAdd, IconSelect, Text, TextField } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '../../../../types/CAPEX/CapexSet';
import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import { CapexTableContainer } from '../../../containers/CAPEX/CapexTableContainer';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { Collapsed } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper';
import { validateName } from '../../Shared/ErrorMessage/ValidateArticle';
import { Validation } from '../../Shared/ErrorMessage/Validation';

import { CapexGlobalValuesWrapper } from './CapexGlobalValuesWrapper';
import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../../styles/VegaFormCustom/VegaFormCustom.css';

export interface CapexSetWrapperProps {
  capexSet: CapexSet;
  addCapexSetGroup: (capexSetGroup: CapexExpenseSetGroup) => void;
  addCapex: (capex: Article, group: CapexExpenseSetGroup) => void;
  updateCapexGlobalValue: (reserveValue: CapexSetGlobalValue) => void;
  updateCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
  deleteCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
  requestChangeCapexGroup: (group: CapexExpenseSetGroup) => void;
  requestDeleteCapexGroup: (group: CapexExpenseSetGroup) => void;
  highlightArticle: (article: Article, group: MacroparameterSetGroup) => void;
  highlightArticleClear: () => void;
}

export const CapexSetWrapper = ({
  capexSet,
  updateCapexGlobalValue,
  addCapexSetGroup,
  addCapex,
  updateCapexValue,
  deleteCapexValue,
  requestChangeCapexGroup,
  requestDeleteCapexGroup,
  highlightArticle,
  highlightArticleClear,
}: CapexSetWrapperProps) => {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState<string | undefined>('');
  const [groups, setGroups] = useState(
    (capexSet?.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[],
  );
  const [globalValues, setGlobalValues] = useState(
    (capexSet?.capexGlobalValueList ?? []) as CapexSetGlobalValue[],
  );

  /* collapse/expand groups state */
  const [groupsCollapsed, setGroupsCollapsed] = useState([] as Collapsed[]);

  useEffect(() => {
    setGroups(capexSet?.capexExpenseGroupList ?? []);
    setGlobalValues(capexSet?.capexGlobalValueList ?? []);
    setGroupsCollapsed((prev) =>
      (capexSet?.capexExpenseGroupList ?? [])?.map(
        (group) =>
          ({
            id: group.id,
            collapsed: prev.filter((collapsed) => collapsed.id === group.id)[0]?.collapsed ?? true,
          } as Collapsed),
      ),
    );
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
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleCapexSetGroup(event);
    requestGroupAdd(groupName);
  };

  const isCollapsedCallback = (collapsed: Collapsed) => {
    setGroupsCollapsed((prev) =>
      prev?.map((prevCollapsedItem) => {
        if (prevCollapsedItem.id === collapsed.id) {
          return { id: prevCollapsedItem.id, collapsed: collapsed.collapsed } as Collapsed;
        }
        return prevCollapsedItem;
      }),
    );
  };

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
              className={`${cnVegaFormCustom()} ${cnBlockWrapper('content-column')}`}
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
              }}
            >
              <Form.Row gap="m" space="none" className={cnVegaFormCustom('content-body')}>
                {(globalValues ?? []).length > 0 &&
                  globalValues.map(
                    (globalValue: CapexSetGlobalValue, index: number) =>
                      index < 2 && (
                        <CapexGlobalValuesWrapper
                          key={keyGen(index)}
                          globalValue={globalValue}
                          updateCapexGlobalValue={updateCapexGlobalValue}
                        />
                      ),
                  )}
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
                        groupList={groups}
                        requestAddCapex={addCapex}
                        updateCapexValue={updateCapexValue}
                        deleteCapexValue={deleteCapexValue}
                        requestChangeCapexGroup={requestChangeCapexGroup}
                        requestDeleteCapexGroup={requestDeleteCapexGroup}
                        onArticleFocusCallback={highlightArticle}
                        highlightArticleClear={highlightArticleClear}
                        isCollapsed={
                          groupsCollapsed.filter((collapsed) => collapsed.id === group.id)[0]
                        }
                        isCollapsedCallback={isCollapsedCallback}
                      />
                    ))}
                </Form.Row>
              </Form.Row>
              <Form.Row col="1" gap="none" space="none" className={cnVegaFormCustom('footer')}>
                {!isAddingGroup && (
                  <Button
                    type="button"
                    size="s"
                    label="Добавить группу затрат"
                    iconLeft={IconAdd}
                    view="ghost"
                    onClick={(e) => toggleCapexSetGroup(e)}
                  />
                )}
                {isAddingGroup && (
                  <Form.Field>
                    <Form.Label size="s">Название группы затрат</Form.Label>
                    <Form.Row col="1" gap="none" className={cnVegaFormCustom('footer-text-field')}>
                      <Validation
                        validationFunction={validateName}
                        linkedHook={setNewGroupName}
                        isClear
                        itemsList={groups}
                      >
                        <TextField
                          id="capexSetNewGroupName"
                          size="s"
                          width="full"
                          value={newGroupName}
                          maxLength={257}
                          placeholder="Введите название группы затрат"
                          type="text"
                          // onChange={(event: any) => setNewGroupName(event.e.target.value)}
                        />
                      </Validation>
                    </Form.Row>
                    <Form.Row className={cnVegaFormCustom('footer-action')}>
                      <Button
                        size="s"
                        label="Добавить группу"
                        view="ghost"
                        disabled={!newGroupName?.length}
                        onClick={(e) => addGroup(e, newGroupName ?? '')}
                      />
                      <Button label="Отмена" size="s" view="clear" onClick={toggleCapexSetGroup} />
                    </Form.Row>
                  </Form.Field>
                )}
              </Form.Row>
            </Form>
            <CapexTableContainer capexSet={capexSet} />
          </>
        ) : (
          <div />
          // <CapexSetPlaceholder text="Выберите один из макроэкономических сценариев" />
        )}
      </div>
    </div>
  );
};
