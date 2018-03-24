import Joi from 'joi';

export function profileRoute(server, commonRouteConfig) {

  server.route({
    path: '/api/searchprofiler/profile',
    method: 'POST',
    config: {
      ...commonRouteConfig,
      validate: {
        payload: Joi.object().keys({
          query: Joi.object().required(),
          index: Joi.string().required(),
          type: Joi.string().optional()
        }).required()    //Joi validation
      }
    },
    handler: (request, reply) => {

      const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
      let parsed = request.payload.query;
      parsed.profile = true;
      parsed = JSON.stringify(parsed, null, 2);

      const body = {
        index: request.payload.index,
        type: request.payload.type,
        body: parsed
      };

      callWithRequest(request, 'search', body).then((resp) => {
        reply({
          ok: true,
          resp: resp
        });
      }).catch((err) => {
        reply({
          ok: false,
          err: err
        });
      });
    }
  });

}