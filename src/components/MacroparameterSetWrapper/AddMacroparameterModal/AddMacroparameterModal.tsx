import React, { useState } from 'react';
import { Modal } from '@gpn-prototypes/vega-modal';
import {
  Button,
  Form,
  PossibleCloseEvent as CloseEvent,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';

import Macroparameter from '../../../../types/Macroparameter';

import { cnAddMacroparameterModal } from './cn-add-macroparameter-modal';

import './AddMacroparameterModal.css';

interface AddMacroparameterModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback: (macroparameter: Macroparameter) => void;
  macroparameter: Macroparameter;
}

export const AddMacroparameterModal = ({
  isOpen,
  close,
  callback,
  macroparameter,
}: AddMacroparameterModalProps) => {
  const [caption, setCaption] = useState(macroparameter.caption);
  const [unit, setUnit] = useState(macroparameter.unit);

  return (
    <Modal
      hasOverlay
      hasCloseButton
      onClose={close}
      isOpen={isOpen}
      rootSelector=".App"
      className={cnAddMacroparameterModal()}
    >
      <Modal.Header className={cnAddMacroparameterModal('header')}>
        <Text size="xs">Добавление новой статьи</Text>
      </Modal.Header>
      <Modal.Body>
        <Form.Row space="none" gap="none" className={cnAddMacroparameterModal('full-width-row')}>
          <Form.Field className={cnAddMacroparameterModal('full-width-field')}>
            <Form.Label>Название статьи</Form.Label>
            <TextField
              id="macroparameterSetName"
              size="s"
              width="full"
              value={caption}
              onChange={(e: any) => {
                setCaption(e.e.target.value);
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Label>Еденица измерения</Form.Label>
            <TextField
              id="unit"
              size="s"
              width="full"
              value={unit}
              onChange={(e: any) => {
                setUnit(e.e.target.value);
              }}
            />
          </Form.Field>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row className={cnAddMacroparameterModal('footer-row')}>
          <div />
          <div />
          <Button
            size="s"
            view="primary"
            label="Добавить"
            onClick={(e) => {
              callback({ caption, unit } as Macroparameter);
              close(e);
            }}
          />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
