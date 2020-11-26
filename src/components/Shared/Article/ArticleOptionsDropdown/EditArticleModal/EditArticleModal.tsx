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

import Article from '../../../../../../types/Article';
import {
  validateDescription,
  validateName,
  validateUnit,
} from '../../../ErrorMessage/ValidateArticle';
import { Validation } from '../../../ErrorMessage/Validation';

import { cnEditArticleModal } from './cn-edit-article-modal';

import './EditArticleModal.css';

export interface EditArticleModalProps {
  close: (e: CloseEvent | React.SyntheticEvent) => void;
  isOpen: boolean;
  callback?: (article: Article) => void;
  article: Article;
  articleList: Article[];
}

export const EditArticleModal = ({
  isOpen,
  close,
  callback,
  article,
  articleList,
}: EditArticleModalProps) => {
  const [id] = useState(article.id);
  const [caption, setCaption] = useState(article.caption);
  const [unit, setUnit] = useState(article.unit);
  const [name, setName] = useState(article.name);

  /*  const [errorHelper, setErrorHelper] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorList>(''); */

  const { portal } = usePortal();

  const [firstControl, setFirstControl] = useState<boolean>(false);
  const [secondControl, setSecondControl] = useState<boolean>(false);
  const [thirdControl, setThirdControl] = useState<boolean>(false);

  const submitHandle = (e: any) => {
    if (callback) callback({ id, name, caption, unit } as Article);
    close(e);
  };

  const handleArticleEvent = (e: any) => {
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
              itemsList={articleList}
              validationFunction={validateName}
              linkedHook={setCaption}
              className={cnEditArticleModal('text-field')}
              isDisabledParentForm={setFirstControl}
            >
              <TextField
                id="articleSetName"
                size="s"
                width="full"
                value={caption}
                maxLength={257}
                // onChange={(e: any) => editValues(e, validateName, setCaption)}
                // state={errorHelper ? 'alert' : undefined}
              />
            </Validation>
          </Form.Field>
          <Form.Field className={cnEditArticleModal('full-width-field')}>
            <Form.Label>Описание</Form.Label>
            <Form.Row className={cnEditArticleModal('text-field')}>
              <Validation
                validationFunction={validateDescription}
                linkedHook={setName}
                className={cnEditArticleModal('text-field')}
                isDisabledParentForm={setSecondControl}
              >
                <TextField
                  id="articleSetCaption"
                  size="s"
                  width="full"
                  value={name}
                  maxLength={257}
                  // onChange={(e: any) => editValues(e, validateDescription, setName)}
                  onKeyDown={(e) => handleArticleEvent(e)}
                />
              </Validation>
            </Form.Row>
          </Form.Field>
          <Form.Field>
            <Form.Label>Единица измерения</Form.Label>
            <Validation
              validationFunction={validateUnit}
              linkedHook={setUnit}
              className={cnEditArticleModal('text-field')}
              isDisabledParentForm={setThirdControl}
            >
              <TextField
                id="unit"
                size="s"
                width="default"
                value={unit}
                maxLength={21}
                // onChange={(e: any) => editValues(e, validateUnit, setUnit)}
                onKeyDown={(e) => handleArticleEvent(e)}
              />
            </Validation>
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
            disabled={firstControl || secondControl || thirdControl}
            onClick={(e) => submitHandle(e)}
          />
          <Button size="s" view="ghost" label="Отмена" onClick={close} />
        </Form.Row>
      </Modal.Footer>
    </Modal>
  );
};
