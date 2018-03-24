import { management } from 'ui/management';
import { BASE_PATH } from '../common/constants';

management.getSection('elasticsearch').register('license_management', {
  visible: true,
  display: 'License Management',
  order: 4,
  url: `#${BASE_PATH}home`
});

