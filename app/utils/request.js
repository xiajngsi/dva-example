import agentUse from 'superagent-use'
import agent from 'superagent'
import _ from 'lodash'

const superagent = agentUse(agent)

const statusActions = {}

export const setStatusAction = (status, action, timeout = 0) => {
  statusActions[status] = { timeout, action }
}

function endPromise(req) {
  const _Promise = Promise

  return new _Promise((resolve, reject) => {
    req.end((err, res) => {
      if (res.status) {
        const statusAction = statusActions[res.status]
        if (!_.isEmpty(statusAction)) {
          if (statusAction.timeout > 0) {
            setTimeout(statusAction.action, statusAction.timeout)
          } else {
            statusAction.action()
          }
        }
      }
      const error = err || res.error
      if (error) {
        if (res) {
          error.status = res.status
          if (res.text !== undefined && res.text !== '') {
            error.message = res.text
          }
        }
        reject(error)
      } else {
        resolve(res)
      }
    })
  })
}

function then(...args) {
  const promise = endPromise(this)
  return promise.then(...args)
}

function _catch(...args) {
  const promise = endPromise(this)
  return promise.catch(...args)
}

/**
 * Adds req.then and req.catch methods
 * @param {Object} req
 * @return {Object} req
 */
function superagentPromisePlugin(req) {
  req.then = then
  req.catch = _catch
  return req
}

/**
 * Patches superagent so that every request has req.then and req.catch methods
 * @param {Object} superagent
 * @return {Object} superagent
 */
superagentPromisePlugin.patch = function patch(sa) {
  sa.Request.prototype.then = then
  sa.Request.prototype.catch = _catch
  return sa
}

superagent.use(superagentPromisePlugin)

export default superagent

// import fetch from 'dva/fetch';

// function parseJSON(response) {
//   return response.json();
// }

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default function request(url, options) {
//   return fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(data => ({ data }))
//     .catch(err => ({ err }));
// }
