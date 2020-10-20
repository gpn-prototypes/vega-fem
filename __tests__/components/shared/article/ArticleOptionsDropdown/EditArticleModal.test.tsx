import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  EditArticleModal,
  EditArticleModalProps,
} from '../../../../../src/components/Shared/Article/ArticleOptionsDropdown/EditArticleModal/EditArticleModal';
import Article from '../../../../../types/Article';

let fakeArticle: Article;
beforeEach(() => {
  fakeArticle = {
    id: 1,
    name: 'fake_article',
    caption: 'fake article',
    value: [{ year: 2015, value: 100 }],
    unit: 'руб.',
  };
});

const renderComponent = (props: EditArticleModalProps): RenderResult =>
  render(<EditArticleModal {...props} />);

const findNameInput = (): HTMLElement => screen.getByDisplayValue('fake_article');
const findCaptionInput = (): HTMLElement => screen.getByDisplayValue('fake article');
const findUnitInput = (): HTMLElement => screen.getByDisplayValue('руб.');
const findSaveButton = (): HTMLElement => screen.getByText('Сохранить');
const findCancelButton = (): HTMLElement => screen.getByText('Отмена');

describe('DeleteArticleModal', () => {
  test('рендерится с правильно подставленным Article', () => {
    renderComponent({
      close: jest.fn(),
      callback: jest.fn(),
      isOpen: true,
      article: fakeArticle,
    });
    expect(findNameInput).not.toThrow();
    expect(findCaptionInput).not.toThrow();
    expect(findUnitInput).not.toThrow();
    expect(findSaveButton).not.toThrow();
    expect(findCancelButton).not.toThrow();
  });

  test('Правильно изменяется name', () => {
    const changeEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: changeEvent,
      isOpen: true,
      article: fakeArticle,
    });

    const nameInput: HTMLElement = screen.getByDisplayValue('fake_article');
    const saveButton: HTMLElement = screen.getByText('Сохранить');

    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'new_name' } });
    expect(nameInput).toHaveValue('new_name');
    fireEvent.click(saveButton);
    expect(changeEvent).toBeCalledTimes(1);
  });
  test('Правильно изменяется caption', () => {
    const changeEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: changeEvent,
      isOpen: true,
      article: fakeArticle,
    });

    const captionInput: HTMLElement = screen.getByDisplayValue('fake article');
    const saveButton: HTMLElement = screen.getByText('Сохранить');

    expect(captionInput).toBeInTheDocument();
    fireEvent.change(captionInput, { target: { value: 'new caption' } });
    expect(captionInput).toHaveValue('new caption');
    fireEvent.click(saveButton);
    expect(changeEvent).toBeCalledTimes(1);
  });
  test('Правильно изменяется unit', () => {
    const changeEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: changeEvent,
      isOpen: true,
      article: fakeArticle,
    });

    const unitInput: HTMLElement = screen.getByDisplayValue('руб.');
    const saveButton: HTMLElement = screen.getByText('Сохранить');

    expect(unitInput).toBeInTheDocument();
    fireEvent.change(unitInput, { target: { value: '$' } });
    expect(unitInput).toHaveValue('$');
    fireEvent.click(saveButton);
    expect(changeEvent).toBeCalledTimes(1);
  });
  test('Отмена изменений', () => {
    const changeEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: changeEvent,
      isOpen: true,
      article: fakeArticle,
    });

    const nameInput: HTMLElement = screen.getByDisplayValue('fake_article');
    const captionInput: HTMLElement = screen.getByDisplayValue('fake article');
    const unitInput: HTMLElement = screen.getByDisplayValue('руб.');
    const cancelButton: HTMLElement = screen.getByText('Отмена');

    fireEvent.change(nameInput, { target: { value: 'new_name' } });
    fireEvent.change(captionInput, { target: { value: 'new caption' } });
    fireEvent.change(unitInput, { target: { value: '$' } });
    expect(nameInput).toHaveValue('new_name');
    expect(captionInput).toHaveValue('new caption');
    expect(unitInput).toHaveValue('$');
    fireEvent.click(cancelButton);
    expect(changeEvent).toBeCalledTimes(0);
  });
});
