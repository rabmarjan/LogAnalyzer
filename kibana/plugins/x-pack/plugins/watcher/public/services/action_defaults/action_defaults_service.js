export class XpackWatcherActionDefaultsService {
  constructor(config, registry) {
    this.config = config;
    this.registry = registry;
  }

  getDefaults = (watchType, actionType) => {
    const reg = this.registry;
    const match = reg.find(registryEntry => registryEntry.watchType === watchType && registryEntry.actionType === actionType);

    return match ? match.getDefaults(this.config, watchType) : {};
  }
}
