'use strict';
import qs from 'querystring';
import request from 'superagent';

const ZIPCODE_SEARCH_API = "http://search.olp.yahooapis.jp/OpenLocalPlatform/V1/zipCodeSearch";
const APP_ID = "dj0zaiZpPXFKMDZwWFJ4a3R2YSZzPWNvbnN1bWVyc2VjcmV0Jng9ZTc-";

export default {
  name: 'address',

  /**
   * @param req      expressのreq
   * @param resource よくわからん
   * @param params   呼び出す時に渡す
   * @param config　 呼び出す時に渡す
   * @param callback コールバック
   */
  read(req, resource, params, config, callback) {

    let query = qs.stringify({
      appid: APP_ID,
      query: params.zipcode,
      output: 'json'
    });

    request
    .get(`${ZIPCODE_SEARCH_API}?${query}`)
    .end(function (err, res) {
      if (err) return callback(err, null);

      let result = res.body;
      let address = false;

      if (result.ResultInfo && result.ResultInfo.Count == 1) {
        address = result.Feature[0];
      }

      callback(null, { address: address });
    });
  }
}
