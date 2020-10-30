import React, { useState } from 'react';
import { Button, Form, Modal, Text, TextField, usePortal } from '@gpn-prototypes/vega-ui';

import { ErrorList, ErrorMessage } from '../../ErrorMessage/ErrorMessage';
import { validateArticle } from '../../ErrorMessage/ValidateArticle';

import { cnEditGroupModal } from './cn-edit-group-modal';

import './EditGroupModal.css';

import { PossibleCloseEvent } from '@/types';

export interface EditGroupModalProps<GroupType> {
  close: (e: PossibleCloseEvent) => void;
  isOpen: boolean;
  callback?: (group: GroupType) => void;
  group: GroupType;
}

export const EditGroupModal = <GroupType extends { id: string | number; caption: string }>({
  isOpen,
  close,
  callback,
  group,
}: EditGroupModalProps<GroupType>) => {
  const [id] = useState(group?.id ? group.id : '');
  const [caption, setCaption] = useState<string | undefined>(group?.caption ? group.caption : '');

  const [errorHelper, setErrorHelper] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorList>('');

  const { portal } = usePortal();

  const submitHandle = (e: any) => {
    if (callback) callback({ ...group, id, caption });
    close(e);
  };

  const handleGroupEvent = (e: any) => {
    if (e.key === 'Enter' && !setErrorHelper) {
      submitHandle(e);
    } else if (e.key === 'Escape') {
      close(e);
    }
  };

  const editValues = (
    e: any,
    setCallback: React.Dispatch<React.SetStateAction<string | undefined>>,
  ): void => {
    const validateResult = validateArticle({ value: e.e.target.value });
    setErrorHelper(validateResult.isError);
    setErrorMessage(validateResult.errorMsg);
    setCallback(e.e.target.value);
  };

  return (
    <Modal
      hasOverlay
      hasCloseButton
      onClose={close}
      isOpen={isOpen}
      portal={portal}
      className={cnEditGroupModal()}
    >
      <Modal.Header className={cnEditGroupModal('header')}>
        <Text size="xs">Переименование группы</Text>
      </Modal.Header>
      <Modal.Body>
        <Form.Row space="none" gap="none" className={cnEditGroupModal('full-width-row')}>
          <Form.Field className={cnEditGroupModal('full-width-field')}>
            <Form.Label>Название группы</Form.Label>
            <Form.Row className={cnEditGroupModal('text-field')}>
              <TextField
                id="groupSetName"
                size="s"
                width="full"
                placeholder="Введите название"
                value={caption}
                onChange={(e: any) => editValues(e, setCaption)}
                onKeyDown={(e) => handleGroupEvent(e)}
                state={errorHelper ? 'alert' : undefined}
              />
              {errorHelper && <ErrorMessage errorMsg={errorMessage} />}
            </Form.Row>
          </Form.Field>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row className={cnEditGroupModal('footer-row')}>
          <div />
          <div />
          <Button
            size="s"
            view="primary"
            label="Сохранить"
            disabled={errorHelper}
            onClick={(e) => submitHandle(e)}
          />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
