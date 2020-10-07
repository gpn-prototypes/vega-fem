import React, { useState } from 'react';
import { Modal } from '@gpn-prototypes/vega-modal';
import { usePortal } from '@gpn-prototypes/vega-root';
import { Button, Form, PossibleCloseEvent as CloseEvent, Text } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../../types/Article';

import { cnDeleteArticleModal } from './cn-delete-article-modal';

import './DeleteArticleModal.css';

interface DeleteArticleModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
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
