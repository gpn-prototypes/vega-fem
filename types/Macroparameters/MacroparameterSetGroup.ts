import Article from '../Article';

export default interface MacroparameterSetGroup {
  id?: string | number;
  name?: string;
  caption?: string;
  macroparameterList?: Article[];
}
