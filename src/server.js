'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import Fetcher from 'fetchr';
import addressFetcher from './fetchers/address';

// 先ほど作った郵便番号検索のFetcherを登録
Fetcher.registerFetcher(addressFetcher);

let app = express();
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use('/proxy', Fetcher.middleware());

app.get('/', function (req, res) {
  let zipcode = req.query.zipcode || '';

  let renderHtml = (err, data) => {
    // 検索フォームがあるだけのページ
    let html = `
    <!DOCTYPE html>
    <body>
      <h1>郵便番号検索</h1>
      <form>
        <input name="zipcode" type="text" value="${ zipcode }" />
        <button type="submit">検索</button>
      </form>

      <h2>結果</h2>
      <pre>${ data ? JSON.stringify(data, null, 2) : ''}</pre>

      <script src="/client.bundle.js"></script>
    </body>
    `;

    res.set('Content-Type', 'text/html');
    res.send(html);
  }

  // queryにzipcodeが設定されている場合は検索
  if (zipcode) {
    let fetcher = new Fetcher({
      xhrPath: '/proxy' // middlewareを設定したパス
    });
    let params = { zipcode: req.query.zipcode };
    let config = {};

    return fetcher.read('address', params, config, renderHtml);
  }

  renderHtml();
});

app.listen(3000);
