import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { autoexportChangeExpenseYearValue } from '@/actions/OPEX/autoexport/changeAutoexportExpenseYearValue';
import { MKOSChangeExpenseYearValue } from '@/actions/OPEX/MKOS/changeMKOSExpenseYearValue';
import { FolderComponent } from '@/components/Table2/FolderComponent/FolderComponent';
import { Table2, TableArticle, TableArticleValue, TableGroup } from '@/components/Table2/Table2';
import Article, { ArticleValues } from '@/types/Article';
import { OPEXGroup, OPEXPresetGroup } from '@/types/OPEX/OPEXGroup';

interface OPEXArrangementTableContainerProps {
  autoexport?: OPEXPresetGroup;
  mkos?: OPEXPresetGroup;
}

const OPEXArrangementTableContainer = ({
  autoexport,
  mkos,
}: OPEXArrangementTableContainerProps) => {
  const dispatch = useDispatch();

  const focusedArticleSelector = (state: any) => state.highlightReducer.focusedArticle;
  const focusedArticle: { article: Article; group: OPEXGroup } = useSelector(
    focusedArticleSelector,
  );

  const [yearsColumns, setYearsColumns] = useState([] as string[]);
  const [groupsList, setGroupsList] = useState([] as TableGroup[]);
  const [containerHeight, setContainerHeight] = useState(0);

  const [convertedFocusedArticle, setConvertedFocusedArticle] = useState(
    {} as { article: TableArticle; group: TableGroup },
  );

  const calculateYearsRange = useCallback((start: number, end: number): string[] => {
    const result: string[] = [];
    for (let i = start; i <= end; i += 1) {
      result.push(i.toString());
    }
    return result;
  }, []);

  const convertToTableArticles = useCallback((nonPreparedArticles: Article[]): TableArticle[] => {
    const result: TableArticle[] = [];
    if (nonPreparedArticles.length) {
      nonPreparedArticles.forEach((article: Article) => {
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
          id: '1',
          caption: 'Автовывоз',
          articleList: convertToTableArticles(nonPrepearedGroupsAutoexport?.opexExpenseList || []),
        } as TableGroup);
      }

      if (nonPrepearedGroupsMkos) {
        result.push({
          id: '2',
          caption: 'Аренда МКОС',
          articleList: convertToTableArticles(nonPrepearedGroupsMkos?.opexExpenseList || []),
          // TODO: change logic
          useSecondaryUpdateMethod: true,
        } as TableGroup);
      }
      return result;
    },
    [convertToTableArticles],
  );

  const updateAutoexportExpenseYearValue = useCallback(
    (article: TableArticle, group: TableGroup, value: TableArticleValue) => {
      dispatch(
        autoexportChangeExpenseYearValue({ ...article } as Article, { ...value } as ArticleValues),
      );
    },
    [dispatch],
  );

  const updateMKOSExpenseYearValue = useCallback(
    (article: TableArticle, group: TableGroup, value: TableArticleValue) => {
      dispatch(
        MKOSChangeExpenseYearValue({ ...article } as Article, { ...value } as ArticleValues),
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
    setGroupsList(
      convertToTableGroups((autoexport ?? {}) as OPEXPresetGroup, (mkos ?? {}) as OPEXPresetGroup),
    );
  }, [autoexport, mkos, calculateYearsRange, convertToTableGroups]);

  useEffect(() => {
    setContainerHeight(calcHeight());
  }, [groupsList, calcHeight]);

  useEffect(() => {
    setConvertedFocusedArticle({
      article: convertToTableArticles([focusedArticle?.article])[0],
      group: convertToTableGroups(
        focusedArticle?.group?.id === '1' ? focusedArticle?.group : undefined,
        focusedArticle?.group?.id === '2' ? focusedArticle?.group : undefined,
      )[0],
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
      updateValueCallback={updateAutoexportExpenseYearValue}
      secondaryUpdateValueCallback={updateMKOSExpenseYearValue}
      containerHeight={containerHeight}
    />
  );
};

export default OPEXArrangementTableContainer;
