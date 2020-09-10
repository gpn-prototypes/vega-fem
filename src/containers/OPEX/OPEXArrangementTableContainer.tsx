import React, { useCallback, useEffect, useState } from 'react';

import Article from '../../../types/Article';
import { OPEXPresetGroup } from '../../../types/OPEX/OPEXGroup';
import { FolderComponent } from '../../components/Table2/FolderComponent/FolderComponent';
import {
  Table2,
  TableArticle,
  TableArticleValue,
  TableGroup,
} from '../../components/Table2/Table2';

interface OPEXArrangementTableContainerProps {
  autoexport?: OPEXPresetGroup;
  mkos?: OPEXPresetGroup;
}

export const OPEXArrangementTableContainer = ({
  autoexport,
  mkos,
}: OPEXArrangementTableContainerProps) => {
  // const dispatch = useDispatch();

  /* const focusedArticleSelector = (state: any) => state.highlightReducer.focusedArticle;
  const focusedArticle: { article: Article; group: MacroparameterSetGroup } = useSelector(
    focusedArticleSelector,
  ); */

  const [yearsColumns, setYearsColumns] = useState([] as string[]);
  const [groupsList, setGroupsList] = useState([] as TableGroup[]);
  const [containerHeight, setContainerHeight] = useState(0);

  /* const [convertedFocusedArticle, setConvertedFocusedArticle] = useState(
    {} as { article: TableArticle; group: TableGroup },
  ); */

  const calculateYearsRange = useCallback((start: number, end: number): string[] => {
    const result: string[] = [];
    for (let i = start; i <= end; i += 1) {
      result.push(i.toString());
    }
    return result;
  }, []);

  const convertToTableArticles = useCallback((nonPrepearedArticles: Article[]): TableArticle[] => {
    const result: TableArticle[] = [];
    if (nonPrepearedArticles.length) {
      nonPrepearedArticles.forEach((article: Article) => {
        if (article) {
          result.push({
            id: article.id,
            caption: article?.caption,
            value: article.value as TableArticleValue[],
            unit: article.unit,
          } as TableArticle);
        }
      });
    }
    return result;
  }, []);

  const convertToTableGroups = useCallback(
    (
      nonPrepearedGroupsAutoexport?: OPEXPresetGroup,
      nonPrepearedGroupsMkos?: OPEXPresetGroup,
    ): TableGroup[] => {
      const result: TableGroup[] = [];

      if (nonPrepearedGroupsAutoexport) {
        result.push({
          caption: 'Автовывоз',
          articleList: convertToTableArticles(nonPrepearedGroupsAutoexport?.opexExpenseList || []),
        } as TableGroup);
      }

      if (nonPrepearedGroupsMkos) {
        result.push({
          caption: 'Аренда МКОС',
          articleList: convertToTableArticles(nonPrepearedGroupsMkos?.opexExpenseList || []),
        } as TableGroup);
      }

      return result;
    },
    [convertToTableArticles],
  );

  /* const updateMacroparameterYearValue = useCallback(
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
  ); */

  const calcHeight = useCallback((): number => {
    const rowHeight = 30;
    let result: number = rowHeight;
    for (let i = 0; i < groupsList.length; i += 1) {
      result += rowHeight + groupsList[i].articleList.length * rowHeight;
    }
    return result;
  }, [groupsList]);

  useEffect(() => {
    const autoexportRange = autoexport
      ? calculateYearsRange(autoexport?.yearStart || 0, autoexport?.yearEnd || 0)
      : [Infinity, -Infinity];
    const mkosRange = mkos
      ? calculateYearsRange(mkos?.yearStart, mkos?.yearEnd || 0)
      : [Infinity, -Infinity];

    setYearsColumns(
      calculateYearsRange(
        Math.min(+autoexportRange[0], +mkosRange[0]),
        Math.max(+autoexportRange[autoexportRange.length - 1], +mkosRange[mkosRange.length - 1]),
      ),
    );
    setGroupsList(convertToTableGroups(autoexport, mkos));
  }, [autoexport, mkos, calculateYearsRange, convertToTableGroups]);

  useEffect(() => {
    setContainerHeight(calcHeight());
  }, [groupsList, calcHeight]);

  /* useEffect(() => {
    setConvertedFocusedArticle({
      article: convertToTableArticles([focusedArticle?.article || {}])[0],
      group: convertToTableGroups([focusedArticle?.group || {}])[0],
    });
  }, [focusedArticle, convertToTableArticles, convertToTableGroups]); */

  return (
    <Table2
      leftSideComponent={
        /* eslint-disable-line */<FolderComponent
          headerText="Заголовок"
          groups={groupsList}
          containerHeight={containerHeight}
          // focusedArticle={convertedFocusedArticle}
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
      // updateValueCallback={updateMacroparameterYearValue}
      containerHeight={containerHeight}
    />
  );
};
