import React, { useState } from 'react';
import { Button, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
import { AddArticleModal } from '../AddArticleModal/AddArticleModal';
import { DeleteGroupModal } from '../DeleteGroupModal/DeleteGroupModal';
import { EditGroupModal } from '../EditGroupModal/EditGroupModal';

interface GroupMenuOptions<GroupType> {
  group: GroupType;
  requestAddArticle: (article: Article, group: GroupType) => void;
  requestChangeGroup?: (group: GroupType) => void;
  requestDeleteGroup: (group: GroupType) => void;
}

export const GroupMenu: any = <GroupType extends { id: string | number; caption: string }>({
  group,
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

  return (
    <>
      <Button
        type="button"
        size="s"
        view="clear"
        label="Добавить статью"
        onClick={openAddGroupModal}
      />
      {requestChangeGroup ? (
        <Button
          type="button"
          size="s"
          view="clear"
          label="Переименовать"
          onClick={openEditGroupModal}
        />
      ) : (
        <></>
      )}
      <Button type="button" size="s" view="clear" label="Удалить" onClick={openDeleteGroupModal} />
      {isAdd ? (
        <AddArticleModal
          isOpen={isOpen}
          close={close}
          article={{ caption: '', unit: '' } as Article}
          callback={addArticleToGroup}
        />
      ) : (
        <></>
      )}
      {isEdit ? (
        <EditGroupModal<typeof group>
          isOpen={isOpen}
          close={close}
          group={group}
          callback={requestChangeGroup}
        />
      ) : (
        <></>
      )}
      {isDelete ? (
        <DeleteGroupModal<typeof group>
          isOpen={isOpen}
          close={close}
          group={group}
          callback={requestDeleteGroup}
        />
      ) : (
        <></>
      )}
    </>
  );
};
