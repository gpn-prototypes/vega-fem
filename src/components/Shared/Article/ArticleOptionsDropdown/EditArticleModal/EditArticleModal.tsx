import React, { useState } from 'react';
import { Button, Form, Modal, Text, TextField, usePortal } from '@gpn-prototypes/vega-ui';

import { cnAddArticleModal } from '../../../GroupOptionsDropdown/AddArticleModal/cn-add-article-modal';
import Article from '../../../../../../types/Article';
import { validateArticle } from '../../../ErrorMessage/ValidateArticle';
import { ErrorList, Validation } from '../../../ErrorMessage/Validation';

import { cnEditArticleModal } from './cn-edit-article-modal';

import './EditArticleModal.css';

import { PossibleCloseEvent } from '@/types';
import Article from '@/types/Article';

export interface EditArticleModalProps {
  close: (e: PossibleCloseEvent) => void;
  isOpen: boolean;
  callback?: (article: Article) => void;
  article: Article;
}

export const EditArticleModal = ({ isOpen, close, callback, article }: EditArticleModalProps) => {
  const [id] = useState(article.id);
  const [caption, setCaption] = useState(article.caption);
  const [unit, setUnit] = useState(article.unit);
  const [name, setName] = useState(article.name);

  const [errorHelper, setErrorHelper] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorList>('');

  const { portal } = usePortal();

  const submitHandle = (e: any) => {
    if (callback) callback({ id, name, caption, unit } as Article);
    close(e);
  };

  const handleArticleEvent = (e: any) => {
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
      className={cnEditArticleModal()}
    >
      <Modal.Header className={cnEditArticleModal('header')}>
        <Text size="xs">Редактирование статьи</Text>
      </Modal.Header>
      <Modal.Body>
        <Form.Row space="none" gap="none" className={cnEditArticleModal('full-width-row')}>
          <Form.Field className={cnEditArticleModal('full-width-field')}>
            <Form.Label>Название статьи</Form.Label>
            <Validation
              isError={errorHelper}
              errorMsg={errorMessage}
              className={cnEditArticleModal('text-field')}
            >
              <TextField
                id="articleSetName"
                size="s"
                width="full"
                value={caption}
                onChange={(e: any) => editValues(e, setCaption)}
                state={errorHelper ? 'alert' : undefined}
              />
            </Validation>
          </Form.Field>
          <Form.Field className={cnEditArticleModal('full-width-field')}>
            <Form.Label>Описание</Form.Label>
            <Form.Row className={cnEditArticleModal('text-field')}>
              <TextField
                id="articleSetCaption"
                size="s"
                width="full"
                value={name}
                onChange={(e: any) => setName(e.e.target.value)}
                onKeyDown={(e) => handleArticleEvent(e)}
              />
            </Form.Row>
          </Form.Field>
          <Form.Field>
            <Form.Label>Единица измерения</Form.Label>
            <TextField
              id="unit"
              size="s"
              width="default"
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
        <Form.Row className={cnEditArticleModal('footer-row')}>
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
