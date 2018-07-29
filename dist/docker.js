'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var inspectContainer = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(containerId) {
    var _ref2, stdout, Config, params;

    return _regenerator2.default.wrap(function (_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!containerId) {
              _context.next = 10;
              break;
            }

            _context.next = 3;
            return exec(`docker inspect ${containerId}`);

          case 3:
            _ref2 = _context.sent;
            stdout = _ref2.stdout;
            Config = JSON.parse(stdout)[0].Config;

            if (!Config) {
              _context.next = 9;
              break;
            }

            params = {
              service: Config.Labels['com.docker.compose.service'],
              id: containerId
            };
            return _context.abrupt('return', params);

          case 9:
            return _context.abrupt('return', { service: '' });

          case 10:
            return _context.abrupt('return', { service: '' });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
var exec = util.promisify(require('child_process').exec);
var Promise = require('bluebird');

module.exports.containers = function () {
  return new Promise(function (resolve, reject) {
    exec('docker ps -q').then(function (response) {
      var rawContainers = response.stdout.split('\n');
      var containerPromises = rawContainers.map(function (container) {
        return inspectContainer(container);
      });
      Promise.all(containerPromises).then(function (payload) {
        resolve(payload);
      }).catch(function (error) {
        reject(error);
      });
    }).catch(function (error) {
      reject(error);
    });
  });
};