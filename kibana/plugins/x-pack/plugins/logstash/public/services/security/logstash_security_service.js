export class LogstashSecurityService {
  constructor(xpackInfoService) {
    this.xpackInfoService = xpackInfoService;
  }

  get isSecurityEnabled() {
    return Boolean(this.xpackInfoService.get(`features.security`));
  }
}
