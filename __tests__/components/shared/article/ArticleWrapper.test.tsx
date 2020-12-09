import React from 'react';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';

import { ArticleWrapper, ArticleWrapperProps } from '@/components/Shared/Article/ArticleWrapper';
import Article from '@/types/Article';

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

const renderComponent = (props: ArticleWrapperProps): RenderResult =>
  render(<ArticleWrapper {...props} />);

const findCaptionLabel = (): HTMLElement => screen.getByTestId('label');
const findInput = (): HTMLElement => screen.getByTestId('input');

describe('ArticleWrapper', () => {
  test('рендерится без ошибок', () => {
    expect(renderComponent).not.toThrow();
  });

  test('рендерится с правильно подставленным Article', () => {
    renderComponent({
      article: fakeArticle,
      updateArticleValueCallback: jest.fn(),
      deleteArticleCallback: jest.fn(),
      updateArticleCallback: jest.fn(),
    });

    expect(findCaptionLabel).not.toThrow();
    expect(findInput).not.toThrow();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByText('руб.')).toBeInTheDocument();
  });

  test('изменение значения', () => {
    const fakeUpdate = jest.fn();

    render(
      <ArticleWrapper
        article={fakeArticle}
        updateArticleValueCallback={fakeUpdate}
        deleteArticleCallback={jest.fn()}
        updateArticleCallback={jest.fn()}
      />,
    );

    const valueInput: HTMLElement =
      screen.getByPlaceholderText(/Значение/i) || screen.getByDisplayValue(/100/);

    fireEvent.change(valueInput, { target: { value: 150 } });
    expect(valueInput).toHaveAttribute('value', '150');
    fireEvent.blur(valueInput);
    expect(fakeUpdate).toBeCalledTimes(1);
  });
});
