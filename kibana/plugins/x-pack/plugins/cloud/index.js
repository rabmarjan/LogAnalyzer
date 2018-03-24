
export const cloud = (kibana) => {
  return new kibana.Plugin({
    id: 'cloud',
    configPrefix: 'xpack.cloud',
    require: ['kibana', 'elasticsearch', 'xpack_main'],

    uiExports: {
      injectDefaultVars(server, options) {
        return {
          isCloudEnabled: !!options.id,
          cloudId: options.id,
        };
      }
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        id: Joi.string(),
      }).default();
    },
  });
};
