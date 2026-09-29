/* ==========================================================================
   live-sources.mjs
   Fetches public data from YouTube, Roblox and Discord. No API keys.
   Shared by:
   - functions/api/live.js       (Cloudflare Pages Function, runs live)
   - scripts/update-live-data.js (local script, writes data/live.js)
   Only uses fetch(), so it runs in Node 18+ and Cloudflare Workers.
   ========================================================================== */

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'CONSENT=YES+1; SOCS=CAI' // skips YouTube's EU cookie wall
};

/* --- helpers -------------------------------------------------------------- */
async function getText(url) {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`${res.status} for ${url}`);
    return res.text();
}
const getJSON = async (url) => JSON.parse(await getText(url));

function walk(node, visit) {
    if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
    else if (node && typeof node === 'object') {
        visit(node);
        Object.values(node).forEach((v) => walk(v, visit));
    }
}

const ytText = (t) => (t ? t.simpleText || (t.runs || []).map((r) => r.text).join('') || t.content || '' : '');

// "Altora https://discord.gg/x #roblox #shorts" → "Altora"
const cleanTitle = (s) => String(s || '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/#[\p{L}\p{N}_]+/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

/* --- YouTube -------------------------------------------------------------- */
function initialData(html) {
    const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
    if (!m) throw new Error('ytInitialData not found (YouTube layout changed or blocked)');
    return JSON.parse(m[1]);
}

export async function fetchYouTube(opts) {
    const handle = `@${String(opts.handle).replace(/^@/, '')}`;
    const found = new Map();

    const videos = initialData(await getText(`https://www.youtube.com/${handle}/videos`));
    walk(videos, (n) => {
        // Current layout: lockupViewModel
        const l = n.lockupViewModel;
        if (l && l.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO' && l.contentId && !found.has(l.contentId)) {
            const meta = l.metadata && l.metadata.lockupMetadataViewModel;
            const parts = (((meta && meta.metadata && meta.metadata.contentMetadataViewModel
                && meta.metadata.contentMetadataViewModel.metadataRows) || [])[0] || {}).metadataParts || [];
            const label = (p) => (p && (p.accessibilityLabel || (p.text && p.text.content))) || '';
            found.set(l.contentId, {
                kind: 'video',
                id: l.contentId,
                title: cleanTitle(meta && meta.title && meta.title.content),
                published: label(parts[1]),
                views: label(parts[0]),
                url: `https://www.youtube.com/watch?v=${l.contentId}`,
                thumbnail: `https://i.ytimg.com/vi/${l.contentId}/hq720.jpg` // 16:9, no black bars
            });
        }
        // Older layout: videoRenderer
        const v = n.videoRenderer;
        if (v && v.videoId && !found.has(v.videoId)) {
            found.set(v.videoId, {
                kind: 'video',
                id: v.videoId,
                title: cleanTitle(ytText(v.title)),
                published: ytText(v.publishedTimeText),
                views: ytText(v.shortViewCountText) || ytText(v.viewCountText),
                url: `https://www.youtube.com/watch?v=${v.videoId}`,
                thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hq720.jpg`
            });
        }
    });

    if (opts.includeShorts !== false) {
        const shorts = initialData(await getText(`https://www.youtube.com/${handle}/shorts`));
        walk(shorts, (n) => {
            const s = n.shortsLockupViewModel;
            const r = n.reelItemRenderer;
            let id, title, views;
            if (s) {
                const cmd = s.onTap && s.onTap.innertubeCommand;
                id = cmd && cmd.reelWatchEndpoint && cmd.reelWatchEndpoint.videoId;
                title = s.overlayMetadata && s.overlayMetadata.primaryText && s.overlayMetadata.primaryText.content;
                views = s.overlayMetadata && s.overlayMetadata.secondaryText && s.overlayMetadata.secondaryText.content;
            } else if (r) {
                id = r.videoId;
                title = ytText(r.headline);
                views = ytText(r.viewCountText);
            }
            if (id && !found.has(id)) {
                found.set(id, {
                    kind: 'short',
                    id,
                    title: cleanTitle(title),
                    published: '',
                    views: views || '',
                    url: `https://www.youtube.com/shorts/${id}`,
                    thumbnail: `https://i.ytimg.com/vi/${id}/oar2.jpg`
                });
            }
        });
    }

    const items = [...found.values()].slice(0, Number(opts.maxItems) || 8);
    if (!items.length) throw new Error('no uploads found');
    return { handle, url: `https://www.youtube.com/${handle}`, items };
}

/* --- Roblox --------------------------------------------------------------- */
export async function fetchRoblox(opts) {
    const list = await getJSON(`https://games.roblox.com/v2/users/${opts.userId}/games?accessFilter=Public&limit=50&sortOrder=Desc`);
    const base = (list.data || []).map((g) => ({ universeId: g.id, placeId: g.rootPlace && g.rootPlace.id }));
    if (!base.length) return { userId: opts.userId, games: [] };

    const ids = base.map((g) => g.universeId).join(',');
    const [details, thumbs] = await Promise.all([
        getJSON(`https://games.roblox.com/v1/games?universeIds=${ids}`),
        getJSON(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&size=768x432&format=Png&countPerUniverse=1`)
    ]);

    let games = base.map((g) => {
        const d = (details.data || []).find((x) => x.id === g.universeId) || {};
        const t = (thumbs.data || []).find((x) => x.universeId === g.universeId);
        const img = t && t.thumbnails && t.thumbnails[0];
        return {
            universeId: g.universeId,
            placeId: g.placeId,
            name: d.name || '',
            description: d.description || '',
            visits: d.visits || 0,
            playing: d.playing || 0,
            favorites: d.favoritedCount || 0,
            updated: d.updated || '',
            url: `https://www.roblox.com/games/${g.placeId}`,
            thumbnail: img && img.state === 'Completed' ? img.imageUrl : ''
        };
    });
    if (opts.hideEmptyPlaces !== false) games = games.filter((g) => g.visits > 0);
    games.sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
    return { userId: opts.userId, games };
}

/* --- Discord -------------------------------------------------------------- */
export const inviteCode = (invite) => String(invite || '').replace(/\/+$/, '').split('/').pop();

export async function fetchDiscord(invite) {
    const d = await getJSON(`https://discord.com/api/v9/invites/${encodeURIComponent(inviteCode(invite))}?with_counts=true`);
    if (!d.guild) throw new Error(d.message || 'invite not found');
    return { name: d.guild.name, members: d.approximate_member_count, online: d.approximate_presence_count };
}

/* --- everything ------------------------------------------------------------
   settings: { youtube: {handle, maxItems, includeShorts},
               roblox:  {userId, hideEmptyPlaces},
               discordInvite: "code or link" }
   Each source runs independently; failures are listed in `errors`. */
export async function fetchAll(settings) {
    const jobs = {};
    if (settings.youtube && settings.youtube.handle) jobs.youtube = () => fetchYouTube(settings.youtube);
    if (settings.roblox && settings.roblox.userId) jobs.roblox = () => fetchRoblox(settings.roblox);
    if (settings.discordInvite) jobs.discord = () => fetchDiscord(settings.discordInvite);

    const data = { generatedAt: new Date().toISOString() };
    const errors = {};
    await Promise.all(Object.entries(jobs).map(async ([name, run]) => {
        try { data[name] = await run(); } catch (e) { errors[name] = e.message; }
    }));
    if (Object.keys(errors).length) data.errors = errors;
    return data;
}
