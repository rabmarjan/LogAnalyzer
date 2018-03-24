import crypto from 'crypto';

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function validateMonitoringLicense(id, license) {
  if (!id || !license) {
    return false;
  }

  const hash = sha256(`${license.status}${license.uid}${license.type}${license.expiry_date_in_millis}${id}`);
  return hash === license.hkey;
}
