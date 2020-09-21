import React, { useEffect, useState } from 'react';
import { Checkbox } from '@gpn-design/uikit/Checkbox';
import { IconAdd } from '@gpn-design/uikit/IconAdd';
import { IconSelect } from '@gpn-design/uikit/IconSelect';
import { Button, Form, Text, TextField } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../../../types/OPEX/OPEXSetType';
import Role from '../../../../types/role';
import { OPEXArrangementTableContainer } from '../../../containers/OPEX/OPEXArrangementTableContainer';
import { OPEXEconomyTableContainer } from '../../../containers/OPEX/OPEXEconomyTableContainer';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { Collapsed } from '../../Macroparameters/MacroparameterSetWrapper/GroupWrapper/GroupWrapper';

import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';

interface OPEXWrapperProps {
  OPEXSetInstance: OPEXSetType;
  OPEXChangeAutoexport: (OPEXAutoexport: OPEXGroup) => void;
  OPEXDeleteAutoexport: (OPEXAutoexport: OPEXGroup) => void;
  OPEXChangeAutoexportExpense: (article: Article) => void;
  OPEXDeleteAutoexportExpense: (article: Article) => void;
  OPEXChangeMKOS: (OPEXMKOS: OPEXGroup) => void;
  OPEXDeleteMKOS: (OPEXMKOS: OPEXGroup) => void;
  OPEXChangeMKOSExpense: (article: Article) => void;
  OPEXDeleteMKOSExpense: (article: Article) => void;
  OPEXCreateCase: (newCase: OPEXGroup) => void;
  OPEXDeleteCase: (newCase: OPEXGroup) => void;
  OPEXChangeCase: (newCase: OPEXGroup) => void;
  OPEXChangeCaseExpense: (article: Article, group: OPEXGroup) => void;
  OPEXDeleteCaseExpense: (article: Article, group: OPEXGroup) => void;
  OPEXAddCaseExpense: (article: Article, group: OPEXGroup) => void;
  OPEXAddAutoexportExpense: (article: Article) => void;
  OPEXAddMKOSExpense: (article: Article) => void;
  OPEXUpdateSdf: (sdf: boolean) => void;
  selectedRole: Role;
  highlightArticle: (article: Article, group: MacroparameterSetGroup) => void;
  highlightArticleClear: () => void;
}

export const OPEXSetWrapper = ({
  OPEXSetInstance,
  OPEXChangeAutoexport,
  OPEXDeleteAutoexport,
  OPEXChangeAutoexportExpense,
  OPEXDeleteAutoexportExpense,
  OPEXChangeMKOS,
  OPEXDeleteMKOS,
  OPEXChangeMKOSExpense,
  OPEXDeleteMKOSExpense,
  OPEXCreateCase,
  OPEXDeleteCase,
  OPEXChangeCase,
  OPEXChangeCaseExpense,
  OPEXDeleteCaseExpense,
  OPEXAddCaseExpense,
  OPEXAddAutoexportExpense,
  OPEXAddMKOSExpense,
  OPEXUpdateSdf,
  selectedRole,
  highlightArticle,
  highlightArticleClear,
}: OPEXWrapperProps) => {
  const [SDF, setSDF] = useState(OPEXSetInstance?.sdf as boolean);
  const [SDFHelper, setSDFHelper] = useState(false);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [isEconomic, setIsEconomic] = useState(selectedRole.name === 'Экономика');

  /* collapse/expand groups state */
  const [groupsCollapsed, setGroupsCollapsed] = useState([] as Collapsed[]);

  useEffect(() => {
    setIsEconomic(selectedRole.name === 'Экономика');
  }, [selectedRole]);

  const toggleGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewCaseName('');
  };

  const requestCaseAdd = (groupName: string) => {
    OPEXCreateCase({
      yearStart: 2020,
      yearEnd: 2030,
      opexExpenseList: [],
      caption: groupName,
    } as OPEXGroup);
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleGroup(event);
    requestCaseAdd(groupName);
  };

  useEffect(() => {
    setSDF(OPEXSetInstance?.sdf);
    setGroupsCollapsed((prev) =>
      (OPEXSetInstance?.opexCaseList ?? [])?.map(
        (group) =>
          ({
            id: group.id,
            collapsed: prev.filter((collapsed) => collapsed.id === group.id)[0]?.collapsed ?? true,
          } as Collapsed),
      ),
    );
  }, [OPEXSetInstance]);

  useEffect(() => {
    if (SDFHelper) {
      setSDFHelper(false);
      OPEXUpdateSdf(SDF);
    }
  }, [SDF, SDFHelper, OPEXUpdateSdf]);

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
            OPEX
          </Text>
          <IconSelect size="xs" className={cnBlockWrapper('title-icon')} />
        </div>
      </div>
      <div className={cnBlockWrapper('content')}>
        <Form
          className={`${cnVegaFormCustom()} ${cnBlockWrapper('content-column')}`}
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
          }}
        >
          <Form.Row gap="none" space="none" className={cnVegaFormCustom('content-body')}>
            {isEconomic && (
              <Form.Row
                gap="m"
                space="none"
                className={cnVegaFormCustom('form-row', { width: 'full-width' })}
              >
                <Form.Field>
                  <Form.Label htmlFor="OPEXSetSDF" className={cnVegaFormCustom('label-checkbox')}>
                    <Checkbox
                      size="m"
                      name="macroparameterSetIsTemplate"
                      label="Учитывать в СДФ для калькуляции OPEX водозаб. скважины"
                      checked={SDF}
                      onChange={() => {
                        setSDF((prevSDF: boolean) => !prevSDF);
                        setSDFHelper(true);
                      }}
                    />
                  </Form.Label>
                </Form.Field>
              </Form.Row>
            )}
            <Form.Row gap="none" space="none" className={cnVegaFormCustom('groups-row')}>
              {!isEconomic && OPEXSetInstance?.hasAutoexport && (
                <GroupWrapper
                  group={{ ...OPEXSetInstance?.autoexport, ...{ id: '1' } }}
                  groupName="Автовывоз"
                  isPreset={OPEXSetInstance?.hasAutoexport}
                  updateGroup={OPEXChangeAutoexport}
                  removeGroup={OPEXDeleteAutoexport}
                  updateArticle={OPEXChangeAutoexportExpense}
                  deleteArticle={OPEXDeleteAutoexportExpense}
                  addArticle={OPEXAddAutoexportExpense}
                  onArticleFocusCallback={highlightArticle}
                  highlightArticleClear={highlightArticleClear}
                />
              )}
              {!isEconomic && OPEXSetInstance?.hasMkos && (
                <GroupWrapper
                  group={{ ...OPEXSetInstance?.mkos, ...{ id: '2' } }}
                  groupName="Аренда МКОС"
                  isPreset={OPEXSetInstance?.hasMkos}
                  updateGroup={OPEXChangeMKOS}
                  removeGroup={OPEXDeleteMKOS}
                  updateArticle={OPEXChangeMKOSExpense}
                  deleteArticle={OPEXDeleteMKOSExpense}
                  addArticle={OPEXAddMKOSExpense}
                  onArticleFocusCallback={highlightArticle}
                  highlightArticleClear={highlightArticleClear}
                />
              )}
              {isEconomic &&
                (OPEXSetInstance?.opexCaseList ?? []).map((caseItem: OPEXGroup, index: number) => (
                  <GroupWrapper
                    key={keyGen(index)}
                    group={caseItem}
                    removeGroup={OPEXDeleteCase}
                    changeGroupName={OPEXChangeCase}
                    updateArticle={(article: Article) => OPEXChangeCaseExpense(article, caseItem)}
                    deleteArticle={(article: Article) => OPEXDeleteCaseExpense(article, caseItem)}
                    addArticle={OPEXAddCaseExpense}
                    isCollapsed={
                      groupsCollapsed.filter((collapsed) => collapsed.id === caseItem.id)[0]
                    }
                    isCollapsedCallback={isCollapsedCallback}
                    onArticleFocusCallback={highlightArticle}
                    highlightArticleClear={highlightArticleClear}
                  />
                ))}
            </Form.Row>
          </Form.Row>
          {isEconomic && (
            <Form.Row col="1" gap="none" space="none" className={cnVegaFormCustom('footer')}>
              {!isAddingGroup && (
                <Button
                  size="s"
                  label="Добавить кейс"
                  iconLeft={IconAdd}
                  view="ghost"
                  onClick={(e) => toggleGroup(e)}
                />
              )}
              {isAddingGroup && (
                <div>
                  <Text as="span" view="secondary" size="s">
                    Название кейса
                  </Text>
                  <Form.Row col="1" gap="none" className={cnVegaFormCustom('footer-text-field')}>
                    <Form.Field>
                      <TextField
                        size="s"
                        width="full"
                        id="OPEXNewGroupName"
                        type="text"
                        maxLength={256}
                        value={newCaseName}
                        onChange={(event: any) => setNewCaseName(event.e.target.value)}
                      />
                    </Form.Field>
                  </Form.Row>
                  <Form.Row className={cnVegaFormCustom('footer-action')}>
                    <Button
                      size="s"
                      label="Добавить кейс"
                      view="ghost"
                      disabled={!newCaseName.length}
                      onClick={(e) => addGroup(e, newCaseName)}
                    />
                    <Button size="s" label="Отмена" view="clear" onClick={toggleGroup} />
                  </Form.Row>
                </div>
              )}
            </Form.Row>
          )}
        </Form>
        {!isEconomic && (
          <OPEXArrangementTableContainer
            autoexport={OPEXSetInstance?.autoexport}
            mkos={OPEXSetInstance?.mkos}
          />
        )}
        {isEconomic && <OPEXEconomyTableContainer opexCaseList={OPEXSetInstance.opexCaseList} />}
      </div>
    </div>
  );
};
