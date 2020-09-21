import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Article, { ArticleValues } from '../../../types/Article';
import MacroparameterSet from '../../../types/Macroparameters/MacroparameterSet';
import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import { requestUpdateMacroparameterYearValue } from '../../actions/Macroparameters/updateMacroparameterYearValue';
import { FolderComponent } from '../../components/Table2/FolderComponent/FolderComponent';
import {
  Table2,
  TableArticle,
  TableArticleValue,
  TableGroup,
} from '../../components/Table2/Table2';

interface MacroparameterTableContainerProps {
  macroparameterSet: MacroparameterSet;
}

export const MacroparameterTableContainer = ({
  macroparameterSet,
}: MacroparameterTableContainerProps) => {
  const dispatch = useDispatch();

  const focusedArticleSelector = (state: any) => state.highlightReducer.focusedArticle;
  const focusedArticle: { article: Article; group: MacroparameterSetGroup } = useSelector(
    focusedArticleSelector,
  );

  const [yearsColumns, setYearsColumns] = useState([] as string[]);
  const [groupsList, setGroupsList] = useState([] as TableGroup[]);
  const [containerHeight, setContainerHeight] = useState(0);

  const [convertedFocusedArticle, setConvertedFocusedArticle] = useState(
    {} as { article: TableArticle; group: TableGroup },
  );

  const calculateYearsRange = useCallback((start: number, range: number): string[] => {
    const result: string[] = [];
    for (let i = start; i < start + range; i += 1) {
      result.push(i.toString());
    }
    return result;
  }, []);

  const convertToTableArticles = useCallback((nonPreparedArticles: Article[]): TableArticle[] => {
    const result: TableArticle[] = [];
    if (nonPreparedArticles.length) {
      nonPreparedArticles.forEach((article: Article) => {
        result.push({
          id: article.id,
          caption: article?.caption,
          value: article.value as TableArticleValue[],
          unit: article.unit,
        } as TableArticle);
      });
    }
    return result;
  }, []);

  const convertToTableGroups = useCallback(
    (nonPreparedGroups: MacroparameterSetGroup[]): TableGroup[] => {
      const result: TableGroup[] = [];
      if (nonPreparedGroups.length) {
        nonPreparedGroups.forEach((group: MacroparameterSetGroup) => {
          result.push({
            id: group?.id,
            caption: group?.caption,
            articleList: convertToTableArticles(group?.macroparameterList || []),
          } as TableGroup);
        });
      }
      return result;
    },
    [convertToTableArticles],
  );

  const updateMacroparameterYearValue = useCallback(
    (article: TableArticle, group: TableGroup, value: TableArticleValue) => {
      dispatch(
        requestUpdateMacroparameterYearValue(
          { ...article } as Article,
          {
            macroparameterList: group.articleList,
            id: group.id,
          } as MacroparameterSetGroup,
          { ...value } as ArticleValues,
        ),
      );
    },
    [dispatch],
  );

  const calcHeight = useCallback((): number => {
    const rowHeight = 30;
    let result: number = rowHeight;
    for (let i = 0; i < groupsList.length; i += 1) {
      result += rowHeight + groupsList[i].articleList.length * rowHeight;
    }
    return result;
  }, [groupsList]);

  useEffect(() => {
    setYearsColumns(
      calculateYearsRange(+(macroparameterSet.yearStart || 0), +(macroparameterSet.years || 0)),
    );
    setGroupsList(convertToTableGroups(macroparameterSet?.macroparameterGroupList || []));
  }, [macroparameterSet, calculateYearsRange, convertToTableGroups]);

  useEffect(() => {
    setContainerHeight(calcHeight());
  }, [groupsList, calcHeight]);

  useEffect(() => {
    setConvertedFocusedArticle({
      article: convertToTableArticles([focusedArticle?.article || {}])[0],
      group: convertToTableGroups([focusedArticle?.group || {}])[0],
    });
  }, [focusedArticle, convertToTableArticles, convertToTableGroups]);

  return (
    <Table2
      leftSideComponent={
        /* eslint-disable-line */<FolderComponent
          headerText="Заголовок"
          groups={groupsList}
          containerHeight={containerHeight}
          focusedArticle={convertedFocusedArticle}
        />
      }
      valuesColumns={yearsColumns}
      groups={groupsList}
      additionalColumns={[
        {
          label: 'Ед. измерения',
          value: 'unit',
        },
      ]}
      updateValueCallback={updateMacroparameterYearValue}
      containerHeight={containerHeight}
    />
  );
};
