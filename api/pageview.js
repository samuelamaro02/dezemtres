const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';

function getCookie(request, name) {
  const cookieHeader = request.headers.cookie || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const pixelId = process.env.PIXEL_META;
  const accessToken = process.env.TOKEN_META_API;
  const { eventId, eventSourceUrl } = request.body || {};

  if (!pixelId || !accessToken) {
    return response.status(503).json({ error: 'Meta tracking is not configured' });
  }
  if (typeof eventId !== 'string' || eventId.length > 100 || typeof eventSourceUrl !== 'string') {
    return response.status(400).json({ error: 'Invalid event' });
  }

  let sourceUrl;
  try {
    sourceUrl = new URL(eventSourceUrl);
    if (sourceUrl.protocol !== 'https:' && sourceUrl.hostname !== 'localhost') throw new Error('Invalid protocol');
    sourceUrl.search = '';
    sourceUrl.hash = '';
  } catch {
    return response.status(400).json({ error: 'Invalid event source URL' });
  }

  const forwardedFor = request.headers['x-forwarded-for'];
  const clientIp = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : undefined;
  const userData = {
    client_user_agent: request.headers['user-agent'],
    ...(clientIp ? { client_ip_address: clientIp } : {}),
    ...(getCookie(request, '_fbp') ? { fbp: getCookie(request, '_fbp') } : {}),
    ...(getCookie(request, '_fbc') ? { fbc: getCookie(request, '_fbc') } : {}),
  };

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
  try {
    const metaResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'PageView',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: sourceUrl.href,
          user_data: userData,
        }],
      }),
    });

    if (!metaResponse.ok) {
      return response.status(502).json({ error: 'Meta Conversions API request failed' });
    }
    return response.status(200).json({ received: true });
  } catch {
    return response.status(502).json({ error: 'Meta Conversions API unavailable' });
  }
};
