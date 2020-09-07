import React, { useState } from 'react';
import { Modal } from '@gpn-prototypes/vega-modal';
import {
  Button,
  Form,
  PossibleCloseEvent as CloseEvent,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';

import CapexExpenseSetGroup from '../../../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '../../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../../types/OPEX/OPEXGroup';

import { cnEditGroupModal } from './cn-edit-group-modal';

import './EditGroupModal.css';

interface EditGroupModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback?: (group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup) => void;
  group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup;
}

export const EditGroupModal = ({ isOpen, close, callback, group }: EditGroupModalProps) => {
  const [id] = useState(group.id);
  const [caption, setCaption] = useState(group.caption);

  const submitHandle = (e: any) => {
    if (callback) callback({ id, caption });
    close(e);
  };

  const handleArticleEvent = (e: any) => {
    if (e.key === 'Enter') {
      submitHandle(e);
    } else if (e.key === 'Escape') {
      close(e);
    }
  };
  return (
    <Modal
      hasOverlay
      hasCloseButton
      onClose={close}
      isOpen={isOpen}
      rootSelector=".App"
      className={cnEditGroupModal()}
    >
      <Modal.Header className={cnEditGroupModal('header')}>
        <Text size="xs">Переименование группы</Text>
      </Modal.Header>
      <Modal.Body>
        <Form.Row space="none" gap="none" className={cnEditGroupModal('full-width-row')}>
          <Form.Field className={cnEditGroupModal('full-width-field')}>
            <Form.Label>Название группы</Form.Label>
            <TextField
              id="groupSetName"
              size="s"
              width="full"
              value={caption}
              onChange={(e: any) => {
                setCaption(e.e.target.value);
              }}
              onKeyDown={(e) => handleArticleEvent(e)}
            />
          </Form.Field>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row className={cnEditGroupModal('footer-row')}>
          <div />
          <div />
          <Button size="s" view="primary" label="Сохранить" onClick={(e) => submitHandle(e)} />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
