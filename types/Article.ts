export default interface Article {
  id?: string | number;
  name?: string;
  caption?: string;
  valueTotal?: number;
  value?: ArticleValues[] | number;
  unit?: string;
}

export interface ArticleValues {
  year?: number;
  value: number;
}
