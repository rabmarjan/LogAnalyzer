export class IgnoreSSLErrorsBehavior {
  constructor(client) {
    this._client = client;
  }

  async initialize() {
    const { Security } = this._client;
    await Security.enable();
    await Security.setOverrideCertificateErrors({ override: true });
    Security.certificateError(({ eventId }) => {
      Security.handleCertificateError({ eventId, action: 'continue' });
    });
  }
}
