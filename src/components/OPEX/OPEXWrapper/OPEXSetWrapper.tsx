import React, { useEffect, useState } from 'react';
import { Checkbox } from '@gpn-design/uikit/Checkbox';
import { IconAdd } from '@gpn-design/uikit/IconAdd';
import { IconSelect } from '@gpn-design/uikit/IconSelect';
import { Button, Form, Text, TextField } from '@gpn-prototypes/vega-ui';

import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import OPEXSet from '../../../../types/OPEX/OPEXSet';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { FEMTable } from '../../FEMTable/FEMTable';

import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';

interface OPEXWrapperProps {
  OPEXSetInstance: OPEXSet;
}

export const OPEXSetWrapper = ({ OPEXSetInstance }: OPEXWrapperProps) => {
  const [SDF, setSDF] = useState(OPEXSetInstance?.sdf as boolean);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const toggleGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewGroupName('');
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleGroup(event);
    // requestGroupAdd(groupName);
  };

  useEffect(() => {
    setSDF(OPEXSetInstance?.sdf);
  }, [OPEXSetInstance]);

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
            <Form.Row gap="none" space="none" className={cnVegaFormCustom('groups-row')}>
              {OPEXSetInstance?.hasAutoexport && (
                <GroupWrapper
                  group={OPEXSetInstance?.autoexport}
                  groupName="Автовывоз"
                  isPreset={OPEXSetInstance?.hasAutoexport}
                />
              )}
              {OPEXSetInstance?.hasMkos && (
                <GroupWrapper
                  group={OPEXSetInstance?.mkos}
                  groupName="Аренда МКОС"
                  isPreset={OPEXSetInstance?.hasMkos}
                />
              )}
              {(OPEXSetInstance?.opexCaseList ?? []).map((caseItem: OPEXGroup, index: number) => (
                <GroupWrapper key={keyGen(index)} group={caseItem} />
              ))}
            </Form.Row>
          </Form.Row>
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
                      value={newGroupName}
                      onChange={(event: any) => setNewGroupName(event.e.target.value)}
                    />
                  </Form.Field>
                </Form.Row>
                <Form.Row className={cnVegaFormCustom('footer-action')}>
                  <Button
                    size="s"
                    label="Добавить кейс"
                    view="ghost"
                    disabled={!newGroupName.length}
                    onClick={(e) => addGroup(e, newGroupName)}
                  />
                  <Button size="s" label="Отмена" view="clear" onClick={toggleGroup} />
                </Form.Row>
              </div>
            )}
          </Form.Row>
        </Form>
        <FEMTable
          entity={OPEXSetInstance}
          secondaryColumn="unit"
          headers={['', 'Статья', 'Eд. измерения']}
        />
      </div>
    </div>
  );
};
