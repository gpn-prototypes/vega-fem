import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { requestUpdateCapexYearValue } from '@/actions/capex/updateCapexYearValue';
import { FolderComponent } from '@/components/Table2/FolderComponent/FolderComponent';
import { Table2, TableArticle, TableArticleValue, TableGroup } from '@/components/Table2/Table2';
import Article, { ArticleValues } from '@/types/Article';
import CapexExpenseSetGroup from '@/types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '@/types/CAPEX/CapexSet';

interface CapexTableContainerProps {
  capexSet: CapexSet;
}

export const CapexTableContainer = ({ capexSet }: CapexTableContainerProps) => {
  const dispatch = useDispatch();

  const focusedArticleSelector = (state: any) => state.highlightReducer.focusedArticle;
  const focusedArticle: { article: Article; group: CapexExpenseSetGroup } = useSelector(
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
          valueTotal: article.valueTotal,
        } as TableArticle);
      });
    }
    return result;
  }, []);

  const convertToTableGroups = useCallback(
    (nonPreparedGroups: CapexExpenseSetGroup[]): TableGroup[] => {
      const result: TableGroup[] = [];
      if (nonPreparedGroups.length) {
        nonPreparedGroups.forEach((group: CapexExpenseSetGroup) => {
          result.push({
            id: group?.id,
            caption: group?.caption,
            articleList: convertToTableArticles(group?.capexExpenseList || []),
            valueTotal: group.valueTotal,
            totalValueByYear: group.totalValueByYear,
          } as TableGroup);
        });
      }
      return result;
    },
    [convertToTableArticles],
  );

  const updateCapexExpenseYearValue = useCallback(
    (article: TableArticle, group: TableGroup, value: TableArticleValue) => {
      dispatch(
        requestUpdateCapexYearValue(
          { ...article } as Article,
          {
            capexExpenseList: group.articleList,
            id: group.id,
          } as CapexExpenseSetGroup,
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
    setYearsColumns(calculateYearsRange(+(capexSet.yearStart || 0), +(capexSet.years || 0)));
    setGroupsList(convertToTableGroups(capexSet?.capexExpenseGroupList || []));
  }, [capexSet, calculateYearsRange, convertToTableGroups]);

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
          headerText="Статья"
          groups={groupsList}
          containerHeight={containerHeight}
          focusedArticle={convertedFocusedArticle}
        />
      }
      valuesColumns={yearsColumns}
      groups={groupsList}
      additionalColumns={[
        {
          label: 'Суммарное',
          value: 'valueTotal',
        },
      ]}
      updateValueCallback={updateCapexExpenseYearValue}
      containerHeight={containerHeight}
      fillGroupsRow
      fillGroupsRowField="totalValueByYear"
    />
  );
};
