module.exports = ParamList;

const _ = require('lodash');
const camelCase = require('camelcase');

function ParamList(vals) {
  const self = this;

  _.forOwn(vals, function (param, oldKey) {
    const name = camelCase(oldKey);
    self[name] = param;

    if (name !== oldKey) param.name = oldKey;
    if (param.default) {
      param.nameWithDefault = '[' + param.name + '=' + param.default + ']';
    } else {
      param.nameWithDefault = name;
    }

    param.toJSON = function () {
      return _.pick(param, 'name', 'type', 'default', 'options', 'required');
    };

  });
}
