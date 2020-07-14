import React, { useState } from 'react';
import { Select } from '@gpn-design/uikit/__internal__/src/components/Select';
import { Checkbox } from '@gpn-design/uikit/Checkbox';
import { Button, Form, IconAdd, IconSelect, Text, TextField } from '@gpn-prototypes/vega-ui';

import { useInput } from '../../hooks/useInput';
import { cnBlockWrapper } from '../../styles/BlockWrapper/cn-block-wrapper';

export const MacroparameterSetWrapper = () => {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const { value, bind: bindValue, setValue } = useInput('');

  const macroparameterSetCategoryOptions = [
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '4',
    },
  ];

  const emptyHandler = () => {
    return null;
  };

  const addMacroparameterSetGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(true);
    setValue(value);
  };

  const toggleMacroparameterSetGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setValue(value);
  };

  return (
    <div className={cnBlockWrapper()}>
      <div className={cnBlockWrapper('title-wrapper')}>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            color: 'var(--color-typo-primary)',
            opacity: '0.75',
          }}
          className={cnBlockWrapper('title')}
        >
          <Text as="span" size="xs" className={cnBlockWrapper('title-text')}>
            Макропараметры
          </Text>
          <IconSelect size="s" className={cnBlockWrapper('title-icon')} />
        </div>
      </div>
      <div className={cnBlockWrapper('content')}>
        <div>
          <Form>
            <Form.Row col="2" gap="m">
              <Form.Field>
                <Form.Legend size="s" space="s">
                  <Text>Название сценария</Text>
                </Form.Legend>
                <TextField id="macroparameterSetName" placeholder="Название сценария" />
              </Form.Field>
              <Form.Field>
                <Form.Legend size="s" space="s">
                  <Text>Количество лет</Text>
                </Form.Legend>
                <TextField id="macroparameterSetYears" placeholder="Количество лет" />
              </Form.Field>
              <Form.Field>
                <Form.Legend size="s" space="s">
                  <Text>Вид оценки</Text>
                </Form.Legend>
                <Select
                  options={macroparameterSetCategoryOptions}
                  name="macroparameterSetCategory"
                  onClearValue={emptyHandler}
                  onChange={emptyHandler}
                />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="macroparameterSetIsTemplate" size="s" space="s">
                  <Checkbox
                    name="macroparameterSetIsTemplate"
                    label="Для всех проектов"
                    step={4}
                    checked
                    onChange={emptyHandler}
                  />
                </Form.Label>
              </Form.Field>
            </Form.Row>
            <Form.Row col="1" gap="m">
              {!isAddingGroup && (
                <Button
                  label="Добавить группу статей"
                  iconLeft={IconAdd}
                  onClick={(e) => addMacroparameterSetGroup(e)}
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
                        {...bindValue}
                      />
                    </Form.Field>
                  </Form.Row>
                  <Form.Row col="2" gap="m">
                    <Button label="Добавить группу" />
                    <Button label="Отмена" onClick={toggleMacroparameterSetGroup} />
                  </Form.Row>
                </div>
              )}
            </Form.Row>
          </Form>
        </div>
      </div>
    </div>
  );
};
