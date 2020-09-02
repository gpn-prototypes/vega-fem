import React from 'react';
import { Button, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
// import {EditArticleModal} from "../EditArticleModal/EditArticleModal";
import { DeleteArticleModal } from '../DeleteArticleModal/DeleteArticleModal';

interface MenuOptions {
  article: Article;
  updateArticle?: (article: Article) => void;
  deleteArticle?: (article: Article) => void;
}
/* declare type ModalDelete = {
  isOpenDelete: boolean;
  openDelete: () => void;
  closeDelete: () => void;
};
export declare function useModalDelete({ initialOpen }?: {
  initialOpen?: boolean | undefined;
}): ModalDelete; */

export const Menu: any = ({ article, updateArticle, deleteArticle }: MenuOptions) => {
  const { isOpen, close, open } = useModal();
  // const {isOpenDelete, closeDelete, openDelete} = useModalDelete();

  /*  const openEditArticleModal = (): void => {
    open();
  }; */
  const openDeleteArticleModal = (): void => {
    open();
  };

  /*  const editArticleHandlerCallback = (article: Article): void => {
    if (updateArticle) {
      updateArticle(
        {...article} as Article,
      );
    }
  }; */

  return (
    <>
      <Button
        type="button"
        size="s"
        view="clear"
        label="Редактировать"
        // onClick={openEditArticleModal}
      />
      <Button
        type="button"
        size="s"
        view="clear"
        label="Удалить"
        onClick={openDeleteArticleModal}
      />
      {/* <EditArticleModal
        isOpen={isOpen}
        close={close}
        article={article}
        callback={editArticleHandlerCallback}
      /> */}
      <DeleteArticleModal
        isOpen={isOpen}
        close={close}
        article={article}
        callback={deleteArticle}
      />
    </>
  );
};
