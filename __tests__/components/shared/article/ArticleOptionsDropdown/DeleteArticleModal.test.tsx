import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  DeleteArticleModal,
  DeleteArticleModalProps,
} from '../../../../../src/components/Shared/Article/ArticleOptionsDropdown/DeleteArticleModal/DeleteArticleModal';
import Article from '../../../../../types/Article';

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

const renderComponent = (props: DeleteArticleModalProps): RenderResult =>
  render(<DeleteArticleModal {...props} />);

const findDeleteButton = (): HTMLElement => screen.getByText('Удалить');
const findCancelButton = (): HTMLElement => screen.getByText('Отмена');

describe('DeleteArticleModal', () => {
  test('рендерится с правильно подставленным Article', () => {
    renderComponent({
      close: jest.fn(),
      callback: jest.fn(),
      isOpen: true,
      article: fakeArticle,
    });
    expect(findDeleteButton).not.toThrow();
    expect(findCancelButton).not.toThrow();
  });

  test('Срабатывает ивент удаления', () => {
    const deleteEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: deleteEvent,
      isOpen: true,
      article: fakeArticle,
    });

    const deleteButton: HTMLElement = screen.getByText('Удалить');

    fireEvent.click(deleteButton);
    expect(deleteEvent).toBeCalledTimes(1);
  });

  test('Отмена удаления', () => {
    const cancelEvent = jest.fn();
    const deleteEvent = jest.fn();
    renderComponent({
      close: cancelEvent,
      callback: deleteEvent,
      isOpen: true,
      article: fakeArticle,
    });

    const cancelButton: HTMLElement = screen.getByText('Отмена');

    fireEvent.click(cancelButton);
    expect(deleteEvent).toBeCalledTimes(0);
    expect(cancelEvent).toBeCalledTimes(1);
  });
});
