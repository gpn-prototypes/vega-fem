import { useState } from 'react';

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      /* TODO: */
      onChange: (event: any) => {
        setValue(event.e.target.value);
      },
    },
  };
};
