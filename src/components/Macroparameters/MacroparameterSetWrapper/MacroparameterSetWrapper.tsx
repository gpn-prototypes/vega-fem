import React, { useCallback, useEffect, useState } from 'react';
import {
  BasicSelect,
  Button,
  Checkbox,
  Form,
  IconAdd,
  IconSelect,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';

import { Collapsed, GroupWrapper } from './GroupWrapper/GroupWrapper';
import { MacroparameterSetPlaceholder } from './MacroparameterSetPlaceholder/MacroparameterSetPlaceholder';

import '@/styles/BlockWrapper/BlockWrapper.css';
import '@/styles/VegaFormCustom/VegaFormCustom.css';

import { MacroparameterTableContainer } from '@/containers/Macroparameters/MacroparameterTableContainer';
import macroparameterSetCategoryOptions from '@/helpers/MacroparameterSetCategoryOptions';
import { yearsRangeOptions } from '@/helpers/nearYearsRange';
import { cnBlockWrapper } from '@/styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '@/styles/VegaFormCustom/cn-vega-form-custom';
import Article from '@/types/Article';
import MacroparameterSet from '@/types/Macroparameters/MacroparameterSet';
import MacroparameterSetGroup from '@/types/Macroparameters/MacroparameterSetGroup';
import SelectOptions from '@/types/SelectOptions';

const yearsOptions = yearsRangeOptions(5, 10);

export interface MacroparameterSetWrapperProps {
  macroparameterSet: MacroparameterSet;
  updateMacroparameterSet: (macroparameterSet: any) => void;
  addMacroparameterSetGroup: (macroparameterSetGroup: MacroparameterSetGroup) => void;
  addMacroparameter: (macroparameter: Article, group: MacroparameterSetGroup) => void;
  updateMacroparameterValue: (macroparameter: Article, group: MacroparameterSetGroup) => void;
  deleteMacroparameterValue: (macroparameter: Article, group: MacroparameterSetGroup) => void;
  requestChangeMacroparameterGroup: (group: MacroparameterSetGroup) => void;
  requestDeleteMacroparameterGroup: (group: MacroparameterSetGroup) => void;
  highlightArticle: (article: Article, group: MacroparameterSetGroup) => void;
  highlightArticleClear: () => void;
}

export const MacroparameterSetWrapper = ({
  macroparameterSet,
  updateMacroparameterSet,
  addMacroparameterSetGroup,
  addMacroparameter,
  updateMacroparameterValue,
  deleteMacroparameterValue,
  requestChangeMacroparameterGroup,
  requestDeleteMacroparameterGroup,
  highlightArticle,
  highlightArticleClear,
}: MacroparameterSetWrapperProps) => {
  const [allProjects, setAllProjects] = useState(macroparameterSet.allProjects);
  const [allProjectsHelper, setAllProjectsHelper] = useState(false);

  const [name, setName] = useState(macroparameterSet.caption);
  const [years, setYears] = useState(macroparameterSet.years);

  const [yearStart, setYearStart] = useState(macroparameterSet.yearStart);
  /* help to call requestSetUpdate with updated yearStart after Select choice */
  const [yearStartHelper, setYearStartHelper] = useState(false);

  const [category, setCategory] = useState(macroparameterSet.category);
  /* help to call requestSetUpdate with updated category after Select choice */
  const [categoryHelper, setCategoryHelper] = useState(false);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState(
    macroparameterSet.macroparameterGroupList as MacroparameterSetGroup[],
  );

  /* collapse/expand groups state */
  const [groupsCollapsed, setGroupsCollapsed] = useState([] as Collapsed[]);

  useEffect(() => {
    setAllProjects(macroparameterSet.allProjects);
    setName(macroparameterSet.caption);
    setYears(macroparameterSet.years);
    setYearStart(macroparameterSet.yearStart);
    setCategory(macroparameterSet.category);
    setGroups(macroparameterSet.macroparameterGroupList ?? []);
    setGroupsCollapsed((prev) =>
      (macroparameterSet?.macroparameterGroupList ?? [])?.map(
        (group) =>
          ({
            id: group.id,
            collapsed: prev.filter((collapsed) => collapsed.id === group.id)[0]?.collapsed ?? true,
          } as Collapsed),
      ),
    );
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
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleMacroparameterSetGroup(event);
    requestGroupAdd(groupName);
  };

  const removeGroup = (group: MacroparameterSetGroup): void => {
    setGroups((prevGroups) => prevGroups.filter((prevGroup) => prevGroup.name !== group.name));
  };

  const onChangeTypoHandler = (e: any, setter: (value: any) => void) => {
    setter(e.e.target.value);
  };

  const loseFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  const requestSetUpdate = useCallback(() => {
    updateMacroparameterSet({
      caption: name,
      name,
      years,
      category,
      macroparameterGroupList: groups,
      yearStart,
      allProjects,
    } as MacroparameterSet);
  }, [updateMacroparameterSet, name, years, category, groups, yearStart, allProjects]);

  useEffect(() => {
    if (categoryHelper) {
      requestSetUpdate();
      setCategoryHelper(false);
    }
  }, [categoryHelper, requestSetUpdate]);

  useEffect(() => {
    if (yearStartHelper) {
      requestSetUpdate();
      setYearStartHelper(false);
    }
  }, [yearStartHelper, setYearStartHelper, requestSetUpdate]);

  useEffect(() => {
    if (allProjectsHelper) {
      setAllProjectsHelper(false);
      requestSetUpdate();
    }
  }, [allProjects, allProjectsHelper, requestSetUpdate]);

  const handleGroupNameChange = ({ value }: any) => setNewGroupName(value);

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
            Макропараметры
          </Text>
          <IconSelect size="xs" className={cnBlockWrapper('title-icon')} />
        </div>
      </div>
      <div className={cnBlockWrapper('content')}>
        {!(Object.keys(macroparameterSet).length === 0) ? (
          <>
            <Form
              className={`${cnVegaFormCustom()} ${cnBlockWrapper('content-column')}`}
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
              }}
            >
              <Form.Row gap="none" space="none" className={cnVegaFormCustom('content-body')}>
                <Form.Row gap="m" space="none" className={cnVegaFormCustom('form-row')}>
                  <Form.Field>
                    <Form.Label space="xs">Название сценария</Form.Label>
                    <TextField
                      id="macroparameterSetName"
                      size="s"
                      width="full"
                      value={name}
                      onBlur={() => requestSetUpdate()}
                      onChange={(e) => onChangeTypoHandler(e, setName)}
                      onKeyDown={(e) => loseFocus(e)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Label space="xs">Количество лет</Form.Label>
                    <TextField
                      id="macroparameterSetYears"
                      size="s"
                      width="full"
                      value={years?.toString()}
                      onBlur={() => requestSetUpdate()}
                      onChange={(e) => onChangeTypoHandler(e, setYears)}
                      onKeyDown={(e) => loseFocus(e)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Label space="xs">Вид оценки</Form.Label>
                    <BasicSelect
                      options={macroparameterSetCategoryOptions}
                      id="macroparameterSetCategory"
                      value={macroparameterSetCategoryOptions.find((i) => i.value === category)}
                      getOptionLabel={(item: SelectOptions) => item.label}
                      onChange={(selectValue: SelectOptions | null) => {
                        setCategory(selectValue?.value);
                        setCategoryHelper(true);
                      }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Label space="xs">Стартовый год</Form.Label>
                    <BasicSelect
                      options={yearsOptions}
                      id="macroparameterSetYearStart"
                      value={yearsOptions.find((i) => i.value === yearStart?.toString())}
                      getOptionLabel={(item: SelectOptions) => item.label}
                      onChange={(selectValue: SelectOptions | null) => {
                        setYearStart(selectValue ? +selectValue.value : undefined);
                        setYearStartHelper(true);
                      }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Label
                      htmlFor="macroparameterSetIsTemplate"
                      className={cnVegaFormCustom('label-checkbox')}
                    >
                      <Checkbox
                        size="m"
                        name="macroparameterSetIsTemplate"
                        label="Для всех проектов"
                        checked={allProjects}
                        onChange={() => {
                          setAllProjects((prevAllProjects) => !prevAllProjects);
                          setAllProjectsHelper(true);
                        }}
                      />
                    </Form.Label>
                  </Form.Field>
                </Form.Row>
                <Form.Row gap="none" space="none" className={cnVegaFormCustom('groups-row')}>
                  {(groups ?? []).length > 0 &&
                    groups.map((group, index) => (
                      <GroupWrapper
                        key={group.id}
                        group={group}
                        removeGroup={removeGroup}
                        requestAddMacroparameter={addMacroparameter}
                        updateMacroparameterValue={updateMacroparameterValue}
                        deleteMacroparameterValue={deleteMacroparameterValue}
                        requestChangeMacroparameterGroup={requestChangeMacroparameterGroup}
                        requestDeleteMacroparameterGroup={requestDeleteMacroparameterGroup}
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
                    label="Добавить группу статей"
                    iconLeft={IconAdd}
                    view="ghost"
                    onClick={(e) => toggleMacroparameterSetGroup(e)}
                  />
                )}
                {isAddingGroup && (
                  <div>
                    <Text as="span" view="secondary" size="s">
                      Название группы статей
                    </Text>
                    <Form.Row col="1" gap="none" className={cnVegaFormCustom('footer-text-field')}>
                      <Form.Field>
                        <TextField
                          size="s"
                          width="full"
                          id="macroparameterSetGroupName"
                          type="text"
                          placeholder="Введите название группы статей"
                          maxLength={256}
                          value={newGroupName}
                          onChange={handleGroupNameChange}
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
                      <Button
                        size="s"
                        label="Отмена"
                        view="clear"
                        onClick={toggleMacroparameterSetGroup}
                      />
                    </Form.Row>
                  </div>
                )}
              </Form.Row>
            </Form>
            <MacroparameterTableContainer macroparameterSet={macroparameterSet} />
          </>
        ) : (
          <MacroparameterSetPlaceholder text="Выберите один из макроэкономических сценариев" />
        )}
      </div>
    </div>
  );
};
