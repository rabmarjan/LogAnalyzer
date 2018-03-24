import { SubscriptionRegistration as PresentationComponent } from './subscription_registration';
import { connect } from 'react-redux';
import { couldUpgrade } from '../../../store/reducers/licenseManagement';

const mapStateToProps = (state) => {
  return { couldUpgrade: couldUpgrade(state) };
};

export const SubscriptionRegistration = connect(mapStateToProps)(PresentationComponent);
