export function JobParamsProvider() {
  return async function (controller) {
    const title = controller.getSharingTitle();
    const type = controller.getSharingType();
    const sharingData = await controller.getSharingData();

    return {
      title,
      type,
      ...sharingData
    };
  };
}
