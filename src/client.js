'use strict';

import Fetcher from 'fetchr';

let fetcher = new Fetcher({
  xhrPath: '/proxy'
});

let form = document.querySelector('form');
let input = document.querySelector('input[type=text]');
let result = document.querySelector('pre');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  result.innerText = '';

  fetcher.read('address', { zipcode: input.value }, {}, function (err, data) {
    if (!err) {
      result.innerText = JSON.stringify(data, null, 2);

      // URLも書き換える（これであってるか不安）
      history.pushState({}, document.title, `/?zipcode=${input.value}`);
    }
  });
}, false);
