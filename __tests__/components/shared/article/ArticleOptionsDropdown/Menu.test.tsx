import * as React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import { Menu, MenuOptions } from '@/components/Shared/Article/ArticleOptionsDropdown/Menu/Menu';
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
const renderComponent = (props: MenuOptions): RenderResult => render(<Menu {...props} />);

const findEditButton = (): HTMLElement => screen.getByText('Редактировать');
const findDeleteButton = (): HTMLElement => screen.getByText('Удалить');

describe('Menu', () => {
  test('рендерится корректно', () => {
    renderComponent({
      article: fakeArticle,
      onClose: jest.fn(),
    });
    expect(findEditButton).not.toThrow();
    expect(findDeleteButton).not.toThrow();
  });
  test('Открывается Edit модальное окно', () => {
    renderComponent({
      article: fakeArticle,
      onClose: jest.fn(),
    });

    const editButton: HTMLElement = screen.getByText('Редактировать');

    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    const editModal: HTMLElement = screen.getByText('Редактирование статьи');
    expect(editModal).toBeInTheDocument();
  });
  test('Открывается Delete модальное окно', () => {
    renderComponent({
      article: fakeArticle,
      onClose: jest.fn(),
    });

    const deleteButton: HTMLElement = screen.getByText('Удалить');

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    const deleteModal: HTMLElement = screen.getByText('Предупреждение');
    expect(deleteModal).toBeInTheDocument();
  });
});
