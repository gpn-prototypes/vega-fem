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

import Article from '../../../../../types/Article';
import { validateName, validateUnit } from '../../ErrorMessage/ValidateArticle';
import { Validation } from '../../ErrorMessage/Validation';

import { cnAddArticleModal } from './cn-add-article-modal';

import './AddArticleModal.css';

export interface AddArticleModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback?: (article: Article) => void;
  // article: Article;
}

export const AddArticleModal = ({ isOpen, close, callback }: AddArticleModalProps) => {
  const [caption, setCaption] = useState<string | undefined>('');
  const [unit, setUnit] = useState<string | undefined>('');
  const { portal } = usePortal();

  const [firstControl, setFirstControl] = useState<boolean>(false);
  const [secondControl, setSecondControl] = useState<boolean>(false);

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
      portal={portal}
      className={cnAddArticleModal()}
    >
      <Modal.Header className={cnAddArticleModal('header')}>
        <Text size="xs">Добавление новой статьи</Text>
      </Modal.Header>
      <Modal.Body>
        <Form.Row space="none" gap="none" className={cnAddArticleModal('full-width-row')}>
          <Form.Field className={cnAddArticleModal('full-width-field')}>
            <Form.Label>Название статьи</Form.Label>
            <Validation
              validationFunction={validateName}
              linkedHook={setCaption}
              isDisabledParentForm={setFirstControl}
              isClear
            >
              <TextField
                id="articleModalNewArticleName"
                size="s"
                width="full"
                placeholder="Введите название статьи"
                maxLength={257}
                value={caption}
                onKeyDown={(e) => handleArticleEvent(e)}
              />
            </Validation>
          </Form.Field>
          <Form.Field>
            <Form.Label>Единица измерения</Form.Label>
            <Validation
              validationFunction={validateUnit}
              linkedHook={setUnit}
              isDisabledParentForm={setSecondControl}
            >
              <TextField
                id="articleModalUnit"
                size="s"
                width="full"
                placeholder="Введите единицы измерения"
                maxLength={21}
                value={unit}
                onKeyDown={(e) => handleArticleEvent(e)}
              />
            </Validation>
          </Form.Field>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Form.Row className={cnAddArticleModal('footer-row')}>
          <div />
          <div />
          <Button
            size="s"
            view="primary"
            label="Добавить"
            onClick={(e) => submitHandle(e)}
            disabled={firstControl || secondControl}
          />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
