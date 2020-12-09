import React, { useState } from 'react';
import { Button, Form, Modal, Text, usePortal } from '@gpn-prototypes/vega-ui';

import { cnDeleteArticleModal } from '../../Article/ArticleOptionsDropdown/DeleteArticleModal/cn-delete-article-modal';

import { PossibleCloseEvent } from '@/types';

export interface DeleteGroupModalProps<GroupType> {
  close: (e: PossibleCloseEvent) => void;
  isOpen: boolean;
  callback?: (group: GroupType) => void;
  group: GroupType;
}

export const DeleteGroupModal = <GroupType extends { id: string | number | undefined }>({
  isOpen,
  close,
  callback,
  group,
}: DeleteGroupModalProps<GroupType>): JSX.Element => {
  const [id] = useState(group?.id ? group.id : '');
  const { portal } = usePortal();

  const submitHandle = (e: any) => {
    if (callback) callback({ ...group, id });
    close(e);
  };

  return (
    <Modal
      hasOverlay
      hasCloseButton
      onClose={close}
      isOpen={isOpen}
      portal={portal}
      className={cnDeleteArticleModal()}
    >
      <Modal.Header className={cnDeleteArticleModal('header')}>
        <Text size="xs">Предупреждение</Text>
      </Modal.Header>
      <Modal.Body className={cnDeleteArticleModal('body')}>
        <Text
          as="p"
          align="left"
          // lineHeight="xs"
          size="s"
          // spacing="xs"
          type="p"
          view="primary"
          weight="regular"
          width="default"
        >
          Вы уверены, что хотите удалить данную группу?
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row className={cnDeleteArticleModal('footer-row')}>
          <div />
          <div />
          <Button size="s" view="primary" label="Удалить" onClick={(e) => submitHandle(e)} />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
