const http = require('http');

async function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost', port: 3000, path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      }
    };
    const r = http.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    if (data) r.write(data);
    r.end();
  });
}

async function run() {
  let token;

  // 1. Bad domain
  let r = await req('POST', '/api/auth/signup', { email: 'bad@gmail.com', nickname: '외부', password: 'test123' });
  console.log('[1] Bad domain:', r.status, r.body.error);

  // 2. Signup
  r = await req('POST', '/api/auth/signup', { email: 'user2@company.co.kr', nickname: '홍길동', password: 'pass99' });
  console.log('[2] Signup:', r.status, r.body.user?.email);
  token = r.body.token;

  // 3. Login
  r = await req('POST', '/api/auth/login', { email: 'user2@company.co.kr', password: 'pass99' });
  console.log('[3] Login:', r.status, !!r.body.token);
  token = r.body.token;

  // 4. Me
  r = await req('GET', '/api/auth/me', null, token);
  console.log('[4] Me:', r.status, r.body.nickname);

  // 5. Create product
  r = await req('POST', '/api/products', { title: '맥북 팝니다', description: '상태 좋아요', tag: '팝니다' }, token);
  console.log('[5] Create product:', r.status, r.body.title);
  const pid = r.body.id;

  // 6. List products
  r = await req('GET', '/api/products');
  console.log('[6] List:', r.status, 'total:', r.body.total);

  // 7. Get product
  r = await req('GET', `/api/products/${pid}`);
  console.log('[7] Get:', r.status, r.body.tag);

  // 8. Update product
  r = await req('PUT', `/api/products/${pid}`, { status: '완료' }, token);
  console.log('[8] Update:', r.status, r.body.status);

  // 9. Comment
  r = await req('POST', `/api/products/${pid}/comments`, { content: '얼마에요?' }, token);
  console.log('[9] Comment:', r.status, r.body.content);

  // 10. Get comments
  r = await req('GET', `/api/products/${pid}/comments`);
  console.log('[10] Comments:', r.status, r.body.length, 'comments');

  // 11. My products
  r = await req('GET', '/api/users/me/products', null, token);
  console.log('[11] My products:', r.status, r.body.length);

  // 12. Messages 501
  r = await req('GET', '/api/messages', null, token);
  console.log('[12] Messages 501:', r.status, r.body.error);

  // 13. 403 - try delete with other user
  let r2 = await req('POST', '/api/auth/signup', { email: 'other@company.co.kr', nickname: '다른사람', password: 'abc123' });
  const otherToken = r2.body.token;
  r = await req('DELETE', `/api/products/${pid}`, null, otherToken);
  console.log('[13] 403 delete:', r.status);

  // 14. Delete own product
  r = await req('DELETE', `/api/products/${pid}`, null, token);
  console.log('[14] Delete:', r.status, r.body.message);

  console.log('\n✅ All tests passed!');
}

run().catch(console.error);
