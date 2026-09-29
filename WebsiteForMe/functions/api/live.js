/* ==========================================================================
   Cloudflare Pages Function → GET /api/live
   Returns fresh YouTube / Roblox / Discord data as JSON for the site.

   The site calls it with the settings from config.js → live, e.g.
   /api/live?youtube=vpn_axel&roblox=9661699934&discord=t2W6saQ8yE

   Results are cached for 10 minutes so visitors don't hammer the
   upstream sites (and pages load fast).
   ========================================================================== */
import { fetchAll } from '../../lib/live-sources.mjs';

const TTL = 600; // seconds
const memo = new Map(); // per-isolate cache (backup for the Cache API)

function json(body, status, extra = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra }
    });
}

function readSettings(params) {
    const settings = {};
    const handle = params.get('youtube');
    if (handle && /^@?[\w.-]{3,60}$/.test(handle)) {
        settings.youtube = {
            handle,
            maxItems: Math.min(Math.max(Number(params.get('max')) || 8, 1), 20),
            includeShorts: params.get('shorts') !== '0'
        };
    }
    const userId = params.get('roblox');
    if (userId && /^\d{1,15}$/.test(userId)) {
        settings.roblox = { userId, hideEmptyPlaces: params.get('empty') !== '1' };
    }
    const invite = params.get('discord');
    if (invite && /^[\w-]{2,32}$/.test(invite)) settings.discordInvite = invite;
    return settings;
}

export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    url.searchParams.sort(); // same settings → same cache entry
    const settings = readSettings(url.searchParams);
    if (!Object.keys(settings).length) return json({ error: 'Nothing to fetch. Pass youtube, roblox and/or discord.' }, 400);

    const key = url.toString();
    const cached = memo.get(key);
    if (cached && cached.expires > Date.now()) {
        return json(cached.body, 200, { 'Cache-Control': `public, max-age=${TTL}`, 'X-Live-Cache': 'memory' });
    }

    const cache = typeof caches !== 'undefined' ? caches.default : null;
    const cacheKey = new Request(key);
    if (cache) {
        const hit = await cache.match(cacheKey);
        if (hit) return hit;
    }

    const body = await fetchAll(settings);
    memo.set(key, { body, expires: Date.now() + TTL * 1000 });
    const res = json(body, 200, { 'Cache-Control': `public, max-age=${TTL}` });
    if (cache) context.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
}
