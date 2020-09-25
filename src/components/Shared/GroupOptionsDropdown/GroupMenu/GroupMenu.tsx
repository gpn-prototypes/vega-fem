import React, { useState } from 'react';
import { IconAdd } from '@gpn-design/uikit/IconAdd';
import { IconEdit } from '@gpn-design/uikit/IconEdit';
import { IconTrash } from '@gpn-design/uikit/IconTrash';
import { Button, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
import { AddArticleModal } from '../AddArticleModal/AddArticleModal';
import { DeleteGroupModal } from '../DeleteGroupModal/DeleteGroupModal';
import { EditGroupModal } from '../EditGroupModal/EditGroupModal';

interface GroupMenuOptions<GroupType> {
  group: GroupType;
  onClose: () => void;
  requestAddArticle: (article: Article, group: GroupType) => void;
  requestChangeGroup?: (group: GroupType) => void;
  requestDeleteGroup: (group: GroupType) => void;
}

export const GroupMenu: any = <GroupType extends { id: string | number; caption: string }>({
  group,
  onClose,
  requestAddArticle,
  requestChangeGroup,
  requestDeleteGroup,
}: GroupMenuOptions<GroupType>): JSX.Element => {
  const { isOpen, close, open } = useModal();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const openAddGroupModal = (): void => {
    open();
    setIsAdd(true);
    setIsEdit(false);
    setIsDelete(false);
  };
  const openEditGroupModal = (): void => {
    open();
    setIsAdd(false);
    setIsEdit(true);
    setIsDelete(false);
  };
  const openDeleteGroupModal = (): void => {
    open();
    setIsAdd(false);
    setIsEdit(false);
    setIsDelete(true);
  };

  const addArticleToGroup = (article: Article): void => requestAddArticle(article, group);

  const closeHandler = () => {
    close();
    onClose();
  };

  return (
    <>
      <Button
        type="button"
        size="s"
        view="clear"
        label="Добавить статью"
        onClick={openAddGroupModal}
        iconLeft={IconAdd}
        onlyIcon
      />
      {requestChangeGroup ? (
        <Button
          type="button"
          size="s"
          view="clear"
          label="Переименовать"
          onClick={openEditGroupModal}
          iconLeft={IconEdit}
          onlyIcon
        />
      ) : (
        <></>
      )}
      <Button
        type="button"
        size="s"
        view="clear"
        label="Удалить"
        onClick={openDeleteGroupModal}
        iconLeft={IconTrash}
        onlyIcon
      />
      <AddArticleModal
        isOpen={isOpen && isAdd}
        close={closeHandler}
        article={{ caption: '', unit: '' } as Article}
        callback={addArticleToGroup}
      />
      <EditGroupModal<typeof group>
        isOpen={isOpen && isEdit}
        close={closeHandler}
        group={group}
        callback={requestChangeGroup}
      />
      <DeleteGroupModal<typeof group>
        isOpen={isOpen && isDelete}
        close={closeHandler}
        group={group}
        callback={requestDeleteGroup}
      />
    </>
  );
};
