const XPACK_INFO_SIG_KEY = 'xpackMain.infoSignature';

export function XPackInfoSignatureProvider($window) {
  return {
    get() {
      return $window.sessionStorage.getItem(XPACK_INFO_SIG_KEY);
    },
    set(updatedXPackInfoSignature) {
      $window.sessionStorage.setItem(XPACK_INFO_SIG_KEY, updatedXPackInfoSignature);
    },
    clear() {
      $window.sessionStorage.removeItem(XPACK_INFO_SIG_KEY);
    }
  };
}
