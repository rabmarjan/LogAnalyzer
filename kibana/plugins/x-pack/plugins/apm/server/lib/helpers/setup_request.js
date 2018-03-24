import moment from 'moment';

export function setupRequest(req, reply) {
  const { server } = req;
  const config = server.config();
  const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
  const { start, end } = getAsTimestamp(req.query.start, req.query.end);

  reply({
    start,
    end,
    client: callWithRequest.bind(null, req),
    config
  });
}

export function getAsTimestamp(start, end) {
  const startTs = moment.utc(start);
  const endTs = moment.utc(end);
  return { start: startTs.valueOf(), end: endTs.valueOf() };
}
