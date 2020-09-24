import React, { useState } from 'react';
import { Button, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
import { DeleteArticleModal } from '../DeleteArticleModal/DeleteArticleModal';
import { EditArticleModal } from '../EditArticleModal/EditArticleModal';

interface MenuOptions {
  article: Article;
  updateArticle?: (article: Article) => void;
  deleteArticle?: (article: Article) => void;
}

export const Menu: any = ({ article, updateArticle, deleteArticle }: MenuOptions) => {
  const { isOpen, close, open } = useModal();

  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const openEditArticleModal = (): void => {
    open();
    setIsEdit(true);
    setIsDelete(false);
  };
  const openDeleteArticleModal = (): void => {
    open();
    setIsEdit(false);
    setIsDelete(true);
  };

  const editArticleHandlerCallback = (newArticle: Article): void => {
    if (updateArticle) {
      updateArticle({ ...newArticle } as Article);
    }
  };

  return (
    <>
      <Button
        type="button"
        size="s"
        view="clear"
        label="Редактировать"
        onClick={openEditArticleModal}
      />
      <Button
        type="button"
        size="s"
        view="clear"
        label="Удалить"
        onClick={openDeleteArticleModal}
      />
      {isEdit ? (
        <EditArticleModal
          isOpen={isOpen}
          close={close}
          article={article}
          callback={editArticleHandlerCallback}
        />
      ) : (
        <></>
      )}
      {isDelete ? (
        <DeleteArticleModal
          isOpen={isOpen}
          close={close}
          article={article}
          callback={deleteArticle}
        />
      ) : (
        <></>
      )}
    </>
  );
};
