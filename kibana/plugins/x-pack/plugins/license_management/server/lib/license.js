const getLicensePath = (acknowledge) => `/_xpack/license${ acknowledge ? '?acknowledge=true' : ''}`;

export async function putLicense(req, xpackInfo) {
  const { acknowledge } = req.query;
  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('admin');
  const options = {
    method: 'POST',
    path: getLicensePath(acknowledge),
    body: req.payload
  };
  try {
    const response = await callWithRequest(req, 'transport.request', options);
    const { acknowledged, license_status: licenseStatus } = response;
    if (acknowledged && licenseStatus === 'valid') {
      await xpackInfo.refreshNow();
    }
    return response;
  } catch (error) {
    return error.body;
  }
}
