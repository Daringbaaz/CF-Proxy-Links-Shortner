addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})

const KV_NAMESPACE = 'LINKS';

async function handleRequest(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  if (pathname.startsWith('/add')) {
    return handleAddUrl(request, searchParams); // Pass request as an argument
  } else if (pathname.startsWith('/short/')) {
    return handleShortUrl(pathname.split('/short/')[1]);
  } else {
    return new Response(JSON.stringify({ error: true, message: 'Invalid endpoint' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }
}

async function handleAddUrl(request, params) { // Receive request as an argument
  const longUrl = params.get('url');

  if (!longUrl) {
    return new Response(JSON.stringify({ error: true, message: 'URL parameter is missing' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }

  const key = generateKey();
  await LINKS.put(key, longUrl);

  const shortUrl = `${new URL(request.url).origin}/short/${key}`;
  return new Response(JSON.stringify({ error: false, short_url: shortUrl }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleShortUrl(key) {
  if (!key) {
    return new Response(JSON.stringify({ error: true, message: 'Key is missing' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }

  const longUrl = await LINKS.get(key);

  if (!longUrl) {
    return new Response(JSON.stringify({ error: true, message: 'URL not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404
    });
  }

  const apiResponse = await fetch(longUrl, {
  });

  return apiResponse;
}

function generateKey() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    key += charset[randomIndex];
  }
  return key;
}
