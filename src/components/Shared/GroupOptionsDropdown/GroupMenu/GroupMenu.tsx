import React, { useState } from 'react';
import { Button, useModal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';
import CapexExpenseSetGroup from '../../../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSetGroup from '../../../../../types/Macroparameters/MacroparameterSetGroup';
import { OPEXGroup } from '../../../../../types/OPEX/OPEXGroup';
import { AddArticleModal } from '../AddArticleModal/AddArticleModal';
import { DeleteGroupModal } from '../DeleteGroupModal/DeleteGroupModal';
import { EditGroupModal } from '../EditGroupModal/EditGroupModal';

interface GroupMenuOptions {
  group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup;
  requestAddArticle: (
    article: Article,
    group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup,
  ) => void;
  requestChangeGroup: (group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup) => void;
  requestDeleteGroup: (group: CapexExpenseSetGroup | MacroparameterSetGroup | OPEXGroup) => void;
}

export const GroupMenu: any = ({
  group,
  requestAddArticle,
  requestChangeGroup,
  requestDeleteGroup,
}: GroupMenuOptions) => {
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
      <Button
        type="button"
        size="s"
        view="clear"
        label="Переименовать"
        onClick={openEditGroupModal}
      />
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
        <EditGroupModal isOpen={isOpen} close={close} group={group} callback={requestChangeGroup} />
      ) : (
        <></>
      )}
      {isDelete ? (
        <DeleteGroupModal
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
