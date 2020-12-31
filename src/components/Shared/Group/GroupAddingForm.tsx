import React, { useState } from 'react';
import { Button, Form, IconAdd, Text, TextField } from '@gpn-prototypes/vega-ui';

import { cnVegaFormCustom } from '@/styles/VegaFormCustom/cn-vega-form-custom';

export interface GroupAddingFormProps {
  onAdd: (groupName: string) => void;
  toggleButtonLabel: string;
  addButtonLabel: string;
  title: string;
  placeholder: string;
}

export const GroupAddingForm: React.FC<GroupAddingFormProps> = ({
  onAdd,
  toggleButtonLabel,
  addButtonLabel,
  title,
  placeholder,
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const handleGroupNameChange = ({ value }: any) => setNewGroupName(value);

  const toggleAdding = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewGroupName('');
  };

  const handleAdd = (event: any) => {
    onAdd(newGroupName);
    toggleAdding(event);
  };

  return (
    <>
      {!isAddingGroup ? (
        <Button
          type="button"
          size="s"
          label={toggleButtonLabel}
          iconLeft={IconAdd}
          view="ghost"
          onClick={toggleAdding}
        />
      ) : (
        <div>
          <Text as="span" view="secondary" size="s">
            {title}
          </Text>
          <Form.Row col="1" gap="none" className={cnVegaFormCustom('footer-text-field')}>
            <Form.Field>
              <TextField
                size="s"
                width="full"
                id="macroparameterSetGroupName"
                type="text"
                placeholder={placeholder}
                maxLength={256}
                value={newGroupName}
                onChange={handleGroupNameChange}
              />
            </Form.Field>
          </Form.Row>
          <Form.Row className={cnVegaFormCustom('footer-action')}>
            <Button
              size="s"
              label={addButtonLabel}
              view="ghost"
              disabled={!newGroupName?.length}
              onClick={handleAdd}
            />
            <Button size="s" label="Отмена" view="clear" onClick={toggleAdding} />
          </Form.Row>
        </div>
      )}
    </>
  );
};
