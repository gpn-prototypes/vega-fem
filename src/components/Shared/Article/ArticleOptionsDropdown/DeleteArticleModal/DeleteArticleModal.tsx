import React, { useState } from 'react';
import { Button, Form, Modal, Text, usePortal } from '@gpn-prototypes/vega-ui';

import { cnDeleteArticleModal } from './cn-delete-article-modal';

import './DeleteArticleModal.css';

import { PossibleCloseEvent } from '@/types';
import Article from '@/types/Article';

export interface DeleteArticleModalProps {
  close: (e: PossibleCloseEvent) => void;
  isOpen: boolean;
  callback?: (article: Article) => void;
  article: Article;
}

export const DeleteArticleModal = ({
  isOpen,
  close,
  callback,
  article,
}: DeleteArticleModalProps) => {
  const [id] = useState(article.id);
  const { portal } = usePortal();

  const submitHandle = (e: any) => {
    if (callback) callback({ id } as Article);
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
          Вы уверены, что хотите удалить данную статью?
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
