import { LayoutTypes } from '../../common/constants';

export const preserveLayout = {
  getJobParams() {
    const el = document.querySelector('[data-shared-items-container]');
    const bounds = el.getBoundingClientRect();

    return {
      id: LayoutTypes.PRESERVE_LAYOUT,
      dimensions: {
        height: bounds.height,
        width: bounds.width,
      }
    };
  }
};
