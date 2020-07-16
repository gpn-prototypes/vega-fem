import { useState } from 'react';

export const useInput = (initialValue: string | undefined) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: (): void => setValue(initialValue),
    bind: {
      value,
      /* TODO: replace any to event type */
      onChange: (event: any): void => {
        setValue(event.e.target.value);
      },
    },
  };
};
