import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import {
  AddArticleModal,
  AddArticleModalProps,
} from '@/components/Shared/GroupOptionsDropdown/AddArticleModal/AddArticleModal';

const renderComponent = (props: AddArticleModalProps): RenderResult =>
  render(<AddArticleModal {...props} />);

const findNameInput = (): HTMLElement => screen.getByPlaceholderText('Введите название статьи');
const findUnitInput = (): HTMLElement => screen.getByPlaceholderText('Введите единицы измерения');
const findSaveButton = (): HTMLElement => screen.getByText('Добавить');
const findCancelButton = (): HTMLElement => screen.getByText('Отмена');

describe('DeleteArticleModal', () => {
  test('рендерится с правильно подставленным Article', () => {
    renderComponent({
      close: jest.fn(),
      callback: jest.fn(),
      isOpen: true,
    });
    expect(findNameInput).not.toThrow();
    expect(findUnitInput).not.toThrow();
    expect(findSaveButton).not.toThrow();
    expect(findCancelButton).not.toThrow();
  });

  test('Создается с пустым unit', () => {
    const addEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: addEvent,
      isOpen: true,
    });

    const nameInput: HTMLElement = screen.getByPlaceholderText('Введите название статьи');
    const saveButton: HTMLElement = screen.getByText('Добавить');

    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'new article' } });
    expect(nameInput).toHaveValue('new article');
    fireEvent.click(saveButton);
    expect(addEvent).toBeCalledTimes(1);
  });
  test('Создается с пустым caption', () => {
    const addEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: addEvent,
      isOpen: true,
    });

    const unitInput: HTMLElement = screen.getByPlaceholderText('Введите единицы измерения');
    const saveButton: HTMLElement = screen.getByText('Добавить');

    expect(unitInput).toBeInTheDocument();
    fireEvent.change(unitInput, { target: { value: 'rub' } });
    expect(unitInput).toHaveValue('rub');
    fireEvent.click(saveButton);
    expect(addEvent).toBeCalledTimes(1);
  });
  test('Создается полностью заполненная статья', () => {
    const addEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: addEvent,
      isOpen: true,
    });

    const nameInput: HTMLElement = screen.getByPlaceholderText('Введите название статьи');
    const unitInput: HTMLElement = screen.getByPlaceholderText('Введите единицы измерения');
    const saveButton: HTMLElement = screen.getByText('Добавить');

    expect(nameInput).toBeInTheDocument();
    expect(unitInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'new article' } });
    fireEvent.change(unitInput, { target: { value: 'rub' } });
    expect(nameInput).toHaveValue('new article');
    expect(unitInput).toHaveValue('rub');
    fireEvent.click(saveButton);
    expect(addEvent).toBeCalledTimes(1);
  });
  test('Отмена изменений', () => {
    const addEvent = jest.fn();
    renderComponent({
      close: jest.fn(),
      callback: addEvent,
      isOpen: true,
    });

    const nameInput: HTMLElement = screen.getByPlaceholderText('Введите название статьи');
    const unitInput: HTMLElement = screen.getByPlaceholderText('Введите единицы измерения');
    const cancelButton: HTMLElement = screen.getByText('Отмена');

    expect(nameInput).toBeInTheDocument();
    expect(unitInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'new article' } });
    fireEvent.change(unitInput, { target: { value: 'rub' } });
    expect(nameInput).toHaveValue('new article');
    expect(unitInput).toHaveValue('rub');
    fireEvent.click(cancelButton);
    expect(addEvent).toBeCalledTimes(0);
  });
});
