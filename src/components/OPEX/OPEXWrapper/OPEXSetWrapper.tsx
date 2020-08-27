import React, { useEffect, useState } from 'react';
import { Checkbox } from '@gpn-design/uikit/Checkbox';
import { IconAdd } from '@gpn-design/uikit/IconAdd';
import { IconSelect } from '@gpn-design/uikit/IconSelect';
import { Button, Form, Text, TextField } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import OPEXSetType from '../../../../types/OPEX/OPEXSetType';
import Role from '../../../../types/role';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { Table } from '../../FEMTable/Table';

import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';

interface OPEXWrapperProps {
  OPEXSetInstance: OPEXSetType;
  OPEXChangeAutoexport: (OPEXAutoexport: OPEXGroup) => void;
  OPEXChangeAutoexportExpense: (article: Article) => void;
  OPEXChangeMKOS: (OPEXMKOS: OPEXGroup) => void;
  OPEXChangeMKOSExpense: (article: Article) => void;
  OPEXCreateCase: (newCase: OPEXGroup) => void;
  OPEXChangeCaseExpense: (article: Article, group: OPEXGroup) => void;
  OPEXAddCaseExpense: (article: Article, group: OPEXGroup) => void;
  OPEXAddAutoexportExpense: (article: Article) => void;
  OPEXAddMKOSExpense: (article: Article) => void;
  selectedRole: Role;
}

export const OPEXSetWrapper = ({
  OPEXSetInstance,
  OPEXChangeAutoexport,
  OPEXChangeAutoexportExpense,
  OPEXChangeMKOS,
  OPEXChangeMKOSExpense,
  OPEXCreateCase,
  OPEXChangeCaseExpense,
  OPEXAddCaseExpense,
  OPEXAddAutoexportExpense,
  OPEXAddMKOSExpense,
  selectedRole,
}: OPEXWrapperProps) => {
  const [SDF, setSDF] = useState(OPEXSetInstance?.sdf as boolean);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [isEconomic, setIsEconomic] = useState(selectedRole.name === 'Экономика');

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
  }, [OPEXSetInstance]);

  const tableData = () => {
    if (isEconomic) {
      return { ...{ opexCaseList: OPEXSetInstance.opexCaseList } };
    }
    return { ...{ autoexport: OPEXSetInstance.autoexport }, ...{ mkos: OPEXSetInstance.mkos } };
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
                      onChange={() => setSDF((prevSDF: boolean) => !prevSDF)}
                    />
                  </Form.Label>
                </Form.Field>
              </Form.Row>
            )}
            <Form.Row gap="none" space="none" className={cnVegaFormCustom('groups-row')}>
              {!isEconomic && OPEXSetInstance?.hasAutoexport && (
                <GroupWrapper
                  group={OPEXSetInstance?.autoexport}
                  groupName="Автовывоз"
                  isPreset={OPEXSetInstance?.hasAutoexport}
                  updateGroup={OPEXChangeAutoexport}
                  updateArticle={OPEXChangeAutoexportExpense}
                  addArticle={OPEXAddAutoexportExpense}
                />
              )}
              {!isEconomic && OPEXSetInstance?.hasMkos && (
                <GroupWrapper
                  group={OPEXSetInstance?.mkos}
                  groupName="Аренда МКОС"
                  isPreset={OPEXSetInstance?.hasMkos}
                  updateGroup={OPEXChangeMKOS}
                  updateArticle={OPEXChangeMKOSExpense}
                  addArticle={OPEXAddMKOSExpense}
                />
              )}
              {isEconomic &&
                (OPEXSetInstance?.opexCaseList ?? []).map((caseItem: OPEXGroup, index: number) => (
                  <GroupWrapper
                    key={keyGen(index)}
                    group={caseItem}
                    updateArticle={(article: Article) => OPEXChangeCaseExpense(article, caseItem)}
                    addArticle={OPEXAddCaseExpense}
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
                        id="macroparameterSetGroupName"
                        type="text"
                        maxLength={150}
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
        <Table
          entity={tableData()}
          secondaryColumn={isEconomic ? 'valueTotal' : 'unit'}
          headers={isEconomic ? ['', 'Статья', 'Суммарное'] : ['', 'Значение', 'Eд. измерения']}
        />
      </div>
    </div>
  );
};
