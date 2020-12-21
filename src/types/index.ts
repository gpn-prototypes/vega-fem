export type PossibleCloseEvent = MouseEvent | KeyboardEvent | TouchEvent | Event | React.MouseEvent;

export type Identity = {
  getToken(): Promise<string>;
};
