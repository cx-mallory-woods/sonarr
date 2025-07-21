import React from 'react';
import NumberInput, { NumberInputProps } from './NumberInput';

function FloatInput(props: Omit<NumberInputProps, 'isFloat'>) {
  return <NumberInput {...props} isFloat={true} />;
}

export default FloatInput;
