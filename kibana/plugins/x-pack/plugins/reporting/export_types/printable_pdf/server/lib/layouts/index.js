import { LayoutTypes } from '../../../common/constants';
import { preserveLayoutFactory } from './preserve_layout';
import { printLayoutFactory } from './print';

export function getLayoutFactory(server) {
  return function getLayout(layoutParams) {
    if (layoutParams && layoutParams.id === LayoutTypes.PRESERVE_LAYOUT) {
      return preserveLayoutFactory(server, layoutParams);
    }

    // this is the default because some jobs won't have anything specified
    return printLayoutFactory(server, layoutParams);
  };
}
