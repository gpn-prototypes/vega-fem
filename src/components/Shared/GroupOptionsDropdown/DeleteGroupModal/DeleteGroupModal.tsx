import React, { useState } from 'react';
import { Modal } from '@gpn-prototypes/vega-modal';
import { Button, Form, PossibleCloseEvent as CloseEvent, Text } from '@gpn-prototypes/vega-ui';

import CapexExpenseSetGroup from '../../../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '../../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../../types/OPEX/OPEXGroup';

interface DeleteGroupModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback?: (group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup) => void;
  group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup;
}

export const DeleteGroupModal = ({ isOpen, close, callback, group }: DeleteGroupModalProps) => {
  const [id] = useState(group.id);

  const submitHandle = (e: any) => {
    if (callback) callback({ id });
    close(e);
  };

  return (
    <Modal hasOverlay hasCloseButton onClose={close} isOpen={isOpen} rootSelector=".App">
      <Modal.Header>
        <Text size="xs">Предупреждение</Text>
      </Modal.Header>
      <Modal.Body>
        <Text
          as="p"
          align="left"
          lineHeight="xs"
          size="s"
          spacing="xs"
          type="p"
          view="primary"
          weight="regular"
          width="default"
        >
          Вы уверены, что хотите удалить данную группу?
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row>
          <div />
          <div />
          <Button size="s" view="primary" label="Удалить" onClick={(e) => submitHandle(e)} />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
