import React, { useState } from 'react';
import { Modal } from '@gpn-prototypes/vega-modal';
import { usePortal } from '@gpn-prototypes/vega-root';
import {
  Button,
  Form,
  PossibleCloseEvent as CloseEvent,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';

import { validateName } from '../../ErrorMessage/ValidateArticle';
import { /* ErrorList, */ Validation } from '../../ErrorMessage/Validation';

import { cnEditGroupModal } from './cn-edit-group-modal';

import './EditGroupModal.css';

export interface EditGroupModalProps<GroupType> {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback?: (group: GroupType) => void;
  group: GroupType;
  groupList: Array<GroupType>;
}

export const EditGroupModal = <GroupType extends { id: string | number; caption: string }>({
  isOpen,
  close,
  callback,
  group,
  groupList,
}: EditGroupModalProps<GroupType>) => {
  const [id] = useState(group?.id ? group.id : '');
  const [caption, setCaption] = useState<string | undefined>(group?.caption ? group.caption : '');

  const [firstControl, setFirstControl] = useState<boolean>(false);

  const { portal } = usePortal();

  const submitHandle = (e: any) => {
    if (callback) callback({ ...group, id, caption });
    close(e);
  };

  const handleGroupEvent = (e: any) => {
    if (e.key === 'Enter' /* && !setErrorHelper */) {
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

            <Validation
              validationFunction={validateName}
              linkedHook={setCaption}
              isDisabledParentForm={setFirstControl}
              itemsList={groupList}
            >
              <TextField
                id="groupSetName"
                size="s"
                width="full"
                placeholder="Введите название"
                maxLength={256}
                value={caption}
                onKeyDown={(e) => handleGroupEvent(e)}
              />
            </Validation>
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
            disabled={firstControl}
            onClick={(e) => submitHandle(e)}
          />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
