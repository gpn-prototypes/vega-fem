import React from 'react';
import { Button, Dropdown, IconKebab, usePortal } from '@gpn-prototypes/vega-ui';

import Article from '../../../../../types/Article';

import { Menu } from './Menu/Menu';
import { cnArticleOptionsDropdown } from './cn-article-options-dropdown';

import './ArticleOptionsDropdown.css';

export interface ArticleOptions {
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
  const { portal } = usePortal();

  return (
    <>
      <Dropdown
        placement="bottom-start"
        portal={portal}
        isOpen={isOpen}
        onToggle={(nextState): void => {
          setIsOpen(nextState);
        }}
      >
        <Dropdown.Trigger>
          {({ toggle, props: { ref, ...triggerProps } }): React.ReactNode => (
            <Button
              type="button"
              size="s"
              label="Опции"
              onlyIcon
              iconLeft={IconKebab}
              view="ghost"
              ref={ref}
              onClick={toggle}
              {...triggerProps}
            />
          )}
        </Dropdown.Trigger>
        <Dropdown.Menu>
          {({ props: menuProps }): React.ReactNode => (
            <div className={cnArticleOptionsDropdown('menu')} {...menuProps}>
              <Menu
                onClose={() => setIsOpen(false)}
                article={article}
                deleteArticle={deleteArticle}
                updateArticle={updateArticle}
              />
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
