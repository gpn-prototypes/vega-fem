import * as React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import { ArticleOptionsDropdown } from '@/components/Shared/Article/ArticleOptionsDropdown/ArticleOptionsDropdown';
import Article from '@/types/Article';

let fakeArticle: Article;
beforeAll(() => {
  fakeArticle = {
    id: 1,
    name: 'fake_article',
    caption: 'fake article',
    value: [{ year: 2015, value: 100 }],
    unit: 'руб.',
  };
});

describe('ArticleOptionsDropdown', () => {
  test('рендерится корректно', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(
        <ArticleOptionsDropdown
          updateArticle={jest.fn()}
          deleteArticle={jest.fn()}
          article={fakeArticle}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
