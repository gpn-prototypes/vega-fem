import React, { useState } from 'react';
import { Button, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
import { cnArticleOptionsDropdown } from '../cn-article-options-dropdown';
import { DeleteArticleModal } from '../DeleteArticleModal/DeleteArticleModal';
import { EditArticleModal } from '../EditArticleModal/EditArticleModal';

interface MenuOptions {
  article: Article;
  onClose: () => void;
  updateArticle?: (article: Article) => void;
  deleteArticle?: (article: Article) => void;
}

export const Menu: any = ({ article, updateArticle, deleteArticle, onClose }: MenuOptions) => {
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

  const closeHandler = () => {
    close();
    onClose();
  };

  return (
    <>
      <Button
        className={cnArticleOptionsDropdown('menuItem')}
        type="button"
        size="s"
        view="clear"
        label="Редактировать"
        onClick={openEditArticleModal}
      />
      <Button
        className={cnArticleOptionsDropdown('menuItem')}
        type="button"
        size="s"
        view="clear"
        label="Удалить"
        onClick={openDeleteArticleModal}
      />
      <EditArticleModal
        isOpen={isOpen && isEdit}
        close={closeHandler}
        article={article}
        callback={editArticleHandlerCallback}
      />
      <DeleteArticleModal
        isOpen={isOpen && isDelete}
        close={closeHandler}
        article={article}
        callback={deleteArticle}
      />
    </>
  );
};
