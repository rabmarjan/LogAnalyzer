import { print } from './print';
import { preserveLayout } from './preserve_layout';
import { LayoutTypes } from '../../common/constants';

export function getLayout(name) {
  switch (name) {
    case LayoutTypes.PRINT:
      return print;
    case LayoutTypes.PRESERVE_LAYOUT:
      return preserveLayout;
    default:
      throw new Error(`Unexpected layout of ${name}`);
  }
}