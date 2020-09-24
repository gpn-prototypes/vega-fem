import React from 'react';
import { Dropdown } from '@gpn-prototypes/vega-dropdown';
import { Button, IconKebab } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';

import { Menu } from './Menu/Menu';

interface ArticleOptions {
  article: Article;
  updateArticle: (article: Article) => void;
  deleteArticle: (article: Article) => void;
}

export const ArticleOptionsDropdown = ({
  article,
  updateArticle,
  deleteArticle,
}: ArticleOptions) => {
  // const buttonRef = useRef(null);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Dropdown
        placement="bottom-end"
        isOpen={isOpen}
        onToggle={(nextState): void => {
          setIsOpen(nextState);
        }}
      >
        <Dropdown.Trigger>
          {({ toggle }): React.ReactNode => (
            <Button
              type="button"
              size="s"
              label="Опции"
              onlyIcon
              iconLeft={IconKebab}
              view="ghost"
              // innerRef={buttonRef}
              onClick={toggle}
            />
          )}
        </Dropdown.Trigger>
        <Dropdown.Menu>
          {(): React.ReactNode => (
            <Menu article={article} deleteArticle={deleteArticle} updateArticle={updateArticle} />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
