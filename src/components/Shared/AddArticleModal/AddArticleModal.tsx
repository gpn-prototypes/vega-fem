import React, { useState } from 'react';
import { Modal } from '@gpn-prototypes/vega-modal';
import {
  Button,
  Form,
  PossibleCloseEvent as CloseEvent,
  Text,
  TextField,
} from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';

import { cnAddArticleModal } from './cn-add-article-modal';

import './AddArticleModal.css';

interface AddArticleModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback?: (article: Article) => void;
  article: Article;
}

export const AddArticleModal = ({ isOpen, close, callback, article }: AddArticleModalProps) => {
  const [caption, setCaption] = useState(article.caption);
  const [unit, setUnit] = useState(article.unit);

  const submitHandle = (e: any) => {
    if (callback) callback({ caption, unit } as Article);
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
      className={cnAddArticleModal()}
    >
      <Modal.Header className={cnAddArticleModal('header')}>
        <Text size="xs">Добавление новой статьи</Text>
      </Modal.Header>
      <Modal.Body>
        <Form.Row space="none" gap="none" className={cnAddArticleModal('full-width-row')}>
          <Form.Field className={cnAddArticleModal('full-width-field')}>
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
            <Form.Label>Единица измерения</Form.Label>
            <TextField
              id="unit"
              size="s"
              width="full"
              value={unit}
              onChange={(e: any) => {
                setUnit(e.e.target.value);
              }}
              onKeyDown={(e) => handleArticleEvent(e)}
            />
          </Form.Field>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row className={cnAddArticleModal('footer-row')}>
          <div />
          <div />
          <Button size="s" view="primary" label="Добавить" onClick={(e) => submitHandle(e)} />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
