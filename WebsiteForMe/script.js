/* ==========================================================================
   vpn_axel — script.js
   Builds the page from siteConfig (config.js). Vanilla JS, no dependencies.

   1. Setup & utilities     6. Community & about
   2. Icons                 7. Footer
   3. Theme & metadata      8. Navigation & reveal
   4. Profile & now         9. Background effects
   5. Projects & content   10. Music player
                           11. Boot
   ========================================================================== */
(function () {
    'use strict';

    /* ---------------------------------------------------------------------
       1. Setup & utilities
       --------------------------------------------------------------------- */
    const cfg = typeof siteConfig !== 'undefined' ? siteConfig : {};
    const fx = Object.assign({
        particles: true, constellations: true, particleDensity: 1, grain: true,
        ambientLight: true, cursorGlow: true, cardTilt: true, grayscaleImages: true,
        colorProfileImages: true, bannerMotion: true, brandIcons: true
    }, cfg.effects || {});

    const root = document.documentElement;
    const $ = (sel, scope = document) => scope.querySelector(sel);
    const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);
    const has = (v) => v !== undefined && v !== null && String(v).trim() !== '';
    const list = (v) => (Array.isArray(v) ? v : []);

    function linkAttrs(url) {
        const href = has(url) ? url : '#';
        const external = /^https?:\/\//i.test(href);
        return `href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
    }

    function initials(text) {
        const words = String(text || '?').replace(/[^\w\s]/g, ' ').trim().split(/\s+/);
        return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
    }

    const store = {
        key: (k) => `${cfg.username || 'site'}:${k}`,
        get(k, fallback) {
            try {
                const v = localStorage.getItem(this.key(k));
                return v === null ? fallback : JSON.parse(v);
            } catch (e) { return fallback; }
        },
        set(k, v) {
            try { localStorage.setItem(this.key(k), JSON.stringify(v)); } catch (e) { /* storage blocked */ }
        }
    };

    /* ---------------------------------------------------------------------
       2. Icons — monochrome, inherit currentColor
       --------------------------------------------------------------------- */
    const ICONS = {
        // brands (filled)
        discord: { fill: true, svg: '<path d="M19.3 5.3A17 17 0 0 0 15 4l-.5 1a15.6 15.6 0 0 0-5 0L9 4a17 17 0 0 0-4.3 1.3C2 9.3 1.3 13.2 1.7 17a17 17 0 0 0 5.2 2.6l1.1-1.8c-.6-.2-1.2-.5-1.8-.9l.4-.3a12.2 12.2 0 0 0 10.4 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.8a17 17 0 0 0 5.2-2.6c.5-4.4-.8-8.3-2.7-11.7zM8.7 14.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z"/>' },
        youtube: { fill: true, svg: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.7 3-5.7 3z"/>' },
        roblox: { fill: true, svg: '<path fill-rule="evenodd" d="M5.4 1.5 1.5 18.6l17.1 3.9 3.9-17.1-17.1-3.9zm8.5 13.6-4.8-1.1 1.1-4.8 4.8 1.1-1.1 4.8z"/>' },
        github: { fill: true, svg: '<path d="M12 .5A11.5 11.5 0 0 0 8.4 23c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.5-2.6-.3-5.2-1.3-5.2-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3 .7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.1v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/>' },
        steam: { fill: true, svg: '<path d="M12 2a10 10 0 0 0-10 9.2l5.4 2.2a2.8 2.8 0 0 1 1.6-.5h.2l2.4-3.5v-.1a3.8 3.8 0 1 1 3.8 3.8h-.1l-3.4 2.5v.1a2.8 2.8 0 0 1-5.6.5L2.4 14.6A10 10 0 1 0 12 2zm-4.8 15.4-1.2-.5a2.1 2.1 0 0 0 3.9-.1 2.1 2.1 0 0 0-2.8-2.8l1.3.5a1.6 1.6 0 1 1-1.2 2.9zm11-8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0zm-4.4 0a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0z"/>' },
        tiktok: { fill: true, svg: '<path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9l.9.1V9.1a6.3 6.3 0 1 0 5.4 6.3V8.6a8 8 0 0 0 4.6 1.5V6.7a4.7 4.7 0 0 1-4.6-4.7z"/>' },
        x: { fill: true, svg: '<path d="M18.9 2H22l-7.3 8.4L23.3 22h-6.8l-5.3-6.9L5.1 22H2l7.8-9L1.5 2h6.9l4.8 6.3L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z"/>' },
        twitch: { fill: true, svg: '<path d="M4.3 2 2.5 6.6V20h4.6v2.5h2.6l2.5-2.5h3.7l5-5V2H4.3zm15 12-2.9 2.9h-4.6l-2.5 2.5v-2.5H5.4V3.7h13.9V14zm-2.9-6v5h-1.7V8h1.7zm-4.6 0v5H10.1V8h1.7z"/>' },
        play: { fill: true, svg: '<path d="M8 5.2v13.6L19 12 8 5.2z"/>' },
        pause: { fill: true, svg: '<rect x="6.5" y="5" width="3.8" height="14" rx="1"/><rect x="13.7" y="5" width="3.8" height="14" rx="1"/>' },
        prev: { fill: true, svg: '<path d="M18 6v12l-8.5-6L18 6z"/><rect x="6" y="6" width="2" height="12" rx=".5"/>' },
        next: { fill: true, svg: '<path d="M6 6v12l8.5-6L6 6z"/><rect x="16" y="6" width="2" height="12" rx=".5"/>' },
        // interface (stroked)
        instagram: { svg: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>' },
        globe: { svg: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>' },
        mail: { svg: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>' },
        link: { svg: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>' },
        arrow: { svg: '<path d="M7 17 17 7M8.5 7H17v8.5"/>' },
        arrowUp: { svg: '<path d="M12 19V5M6 11l6-6 6 6"/>' },
        pin: { svg: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>' },
        clock: { svg: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
        menu: { svg: '<path d="M4 9h16M4 15h16"/>' },
        close: { svg: '<path d="M6 6l12 12M18 6 6 18"/>' },
        chevron: { svg: '<path d="m6 9 6 6 6-6"/>' },
        hash: { svg: '<path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18"/>' },
        users: { svg: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>' },
        music: { svg: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>' },
        volume: { svg: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>' },
        mute: { svg: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9.5 5 5M22 9.5l-5 5"/>' },
        code: { svg: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>' },
        pen: { svg: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>' },
        layout: { svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>' },
        cube: { svg: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>' },
        terminal: { svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>' },
        cursor: { svg: '<path d="M5 3l6 16 2.4-6.6L20 10 5 3z"/>' },
        gamepad: { svg: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="11.2" r=".6" fill="currentColor"/><circle cx="17.5" cy="13.8" r=".6" fill="currentColor"/>' },
        cpu: { svg: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>' },
        spark: { svg: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>' }
    };

    function icon(name, cls = '') {
        const def = ICONS[name] || ICONS.link;
        const paint = def.fill
            ? 'fill="currentColor"'
            : 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
        return `<svg class="i i--${ICONS[name] ? name : 'link'} ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${paint}>${def.svg}</svg>`;
    }

    function platformIcon(platform) {
        const key = String(platform || '').toLowerCase().trim();
        if (ICONS[key]) return key;
        const aliases = { twitter: 'x', 'roblox studio': 'roblox', website: 'globe', web: 'globe', email: 'mail', blog: 'pen' };
        return aliases[key] || 'globe';
    }

    /* Status → monochrome dot style */
    function statusKind(status) {
        const s = String(status || '').toLowerCase();
        if (/live|active|online|released|shipped|done|finished/.test(s)) return 'active';
        if (/progress|building|wip|beta|alpha|prototype|working|development/.test(s)) return 'progress';
        if (/archiv|paused|retired|discontinued|old/.test(s)) return 'archived';
        return 'concept';
    }

    function statusBadge(status) {
        if (!has(status)) return '';
        return `<span class="status status--${statusKind(status)} mono"><span class="status__dot" aria-hidden="true"></span>${esc(status)}</span>`;
    }

    function tagList(tags, cls = '') {
        const items = list(tags).filter(has);
        if (!items.length) return '';
        return `<ul class="tags ${cls}" aria-label="Technologies">${items.map((t) => `<li class="tag mono">${esc(t)}</li>`).join('')}</ul>`;
    }

    /* Image with a generated monochrome placeholder underneath.
       If the image is missing or fails, the placeholder simply stays. */
    const PH_VARIANTS = ['grid', 'dots', 'lines', 'rings', 'diag'];

    function media(src, alt, label, variant, cls = '') {
        const ph = `<div class="ph ph--${variant}" aria-hidden="true"><span class="ph__glyph">${esc(initials(label))}</span><span class="ph__label mono">${esc(label)}</span></div>`;
        const img = has(src)
            ? `<img class="mono-img" src="${esc(src)}" alt="${esc(alt || label)}" loading="lazy" decoding="async" data-fallback>`
            : '';
        return `<div class="media ${cls}">${ph}${img}</div>`;
    }

    /* ---------------------------------------------------------------------
       3. Theme & metadata
       --------------------------------------------------------------------- */
    function applyTheme() {
        const t = cfg.theme || {};
        const map = {
            background: '--bg', backgroundAlt: '--bg-2', surface: '--surface', surfaceLight: '--surface-2',
            border: '--border', text: '--text', textSecondary: '--text-2', textMuted: '--text-3',
            primary: '--text', secondary: '--text-2' // aliases
        };
        Object.keys(map).forEach((k) => { if (has(t[k])) root.style.setProperty(map[k], t[k]); });
        root.classList.toggle('mono-media', fx.grayscaleImages !== false);
        root.classList.toggle('color-profile', fx.colorProfileImages !== false);
        root.classList.toggle('banner-motion', fx.bannerMotion !== false);
        root.classList.toggle('brand-icons', fx.brandIcons !== false);
        root.classList.toggle('no-grain', !fx.grain);
        root.classList.toggle('no-ambient', !fx.ambientLight);
    }

    function applyMeta() {
        const site = cfg.site || {};
        const name = cfg.username || 'vpn_axel';
        if (document.body.dataset.page === 'home') document.title = site.title || name;
        if (has(site.description)) {
            const d = $('meta[name="description"]');
            if (d) d.setAttribute('content', site.description);
        }
        $$('[data-bind="username"]').forEach((n) => { n.textContent = name; });
        const status = cfg.status && cfg.status.text;
        $$('[data-bind="status"]').forEach((n) => { n.textContent = has(status) ? status : 'online'; });
    }

    /* ---------------------------------------------------------------------
       3b. Live data — data/live.js is written by scripts/update-live-data.js
       (see "live" in config.js). Everything falls back to config.js if the
       file is missing or a source failed.
       --------------------------------------------------------------------- */
    const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
    const CONTENT_LIMIT = 7; // 1 featured + 3 side + 3 below

    function liveData() {
        if (cfg.live && cfg.live.enabled === false) return null;
        return (window.liveData && typeof window.liveData === 'object') ? window.liveData : null;
    }

    // "[🎊RELEASE] Jump For Mobs" → "Jump For Mobs"
    const stripTag = (name) => String(name || '').replace(/^\s*\[[^\]]*\]\s*/, '').trim() || String(name || '');

    function timeAgo(iso) {
        const s = (Date.now() - new Date(iso).getTime()) / 1000;
        if (!isFinite(s)) return '';
        if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
        if (s < 86400) return `${Math.round(s / 3600)}h ago`;
        return `${Math.round(s / 86400)}d ago`;
    }

    function communityInfo() {
        const c = Object.assign({}, cfg.community || {});
        const L = liveData();
        const d = L && L.discord;
        if (d) {
            if (d.members != null) c.members = Number(d.members).toLocaleString('en');
            if (d.online != null) c.online = Number(d.online).toLocaleString('en');
        }
        return c;
    }

    // Projects that link to a Roblox game get live stats (+ its thumbnail if no image is set)
    function withRobloxStats(p) {
        const L = liveData();
        const games = L && L.roblox && L.roblox.games;
        const m = String(p.url || '').match(/roblox\.com\/games\/(\d+)/);
        if (!games || !m) return p;
        const g = games.find((x) => String(x.placeId) === m[1]);
        if (!g) return p;
        return Object.assign({}, p, {
            image: has(p.image) ? p.image : g.thumbnail,
            stats: [
                `${compact.format(g.visits)} visits`,
                `${compact.format(g.playing)} playing`,
                `${compact.format(g.favorites)} ${g.favorites === 1 ? 'favorite' : 'favorites'}`
            ]
        });
    }

    function liveContentItems() {
        const L = liveData();
        if (!L) return null;
        const yt = (L.youtube && L.youtube.items) || [];
        const toItem = (v) => ({
            title: v.title || 'Untitled',
            description: v.kind === 'short' ? 'YouTube Short' : '',
            platform: 'YouTube',
            thumbnail: v.thumbnail,
            url: v.url,
            date: [v.views, v.published].filter(has).join(' · ')
        });
        const games = ((L.roblox && L.roblox.games) || []).map((g) => ({
            title: stripTag(g.name),
            description: g.description,
            platform: 'Roblox',
            thumbnail: g.thumbnail,
            url: g.url,
            date: `${compact.format(g.visits)} visits`
        }));
        const items = [
            ...yt.filter((v) => v.kind === 'video').map(toItem),
            ...games,
            ...yt.filter((v) => v.kind !== 'video').map(toItem)
        ];
        if (!items.length) return null;
        const pinned = list(cfg.content).filter((x) => x.pinned);
        return [...pinned, ...items].slice(0, CONTENT_LIMIT);
    }

    /* ---------------------------------------------------------------------
       4. Profile & now
       --------------------------------------------------------------------- */
    const STATES = { online: 'Online', idle: 'Idle', dnd: 'Do not disturb', offline: 'Offline' };

    function socialItem(s) {
        const name = has(s.name) ? s.name : 'Link';
        return `<li><a class="link" ${linkAttrs(s.url)}>
            <span class="link__icon">${icon(s.icon || platformIcon(name))}</span>
            <span class="link__text"><span class="link__name">${esc(name)}</span>${has(s.username) ? `<span class="link__user mono">${esc(s.username)}</span>` : ''}</span>
            ${icon('arrow', 'link__arrow')}
        </a></li>`;
    }

    function squircle(src, label, cls = '') {
        return `<span class="squircle ${cls}"><span class="squircle__ph" aria-hidden="true">${esc(initials(label).slice(0, 1))}</span>${has(src) ? `<img class="mono-img" src="${esc(src)}" alt="" data-fallback>` : ''}</span>`;
    }

    function renderProfile() {
        const el = $('#profile');
        if (!el) return;
        const name = cfg.displayName || cfg.username || 'vpn_axel';
        const st = cfg.status || {};
        const state = STATES[st.state] ? st.state : 'online';
        const roles = list(cfg.roles).filter(has).map(esc).join('<span class="profile__slash" aria-hidden="true">/</span>');
        const socials = list(cfg.socials);
        const c = communityInfo();

        const meta = [];
        if (has(cfg.location)) meta.push(`<li>${icon('pin')}<span>${esc(cfg.location)}</span></li>`);
        if (has(cfg.timezone)) meta.push(`<li>${icon('clock')}<span><time id="profile-clock">--:--</time> local</span></li>`);

        el.innerHTML = `
            <div class="profile__sheen" aria-hidden="true"></div>
            <div class="profile__banner${has(cfg.banner) ? ' profile__banner--img' : ''}">
                ${has(cfg.banner) ? `<img class="profile__banner-img mono-img" src="${esc(cfg.banner)}" alt="" data-fallback>` : ''}
                <span class="profile__tag mono" aria-hidden="true">profile</span>
                <span class="profile__tag profile__tag--r mono" aria-hidden="true">@${esc(cfg.username || name)}</span>
            </div>
            <div class="profile__body">
                <div class="profile__top">
                    <div class="avatar">
                        <span class="avatar__ring" aria-hidden="true"></span>
                        <span class="avatar__frame">
                            <span class="avatar__ph" aria-hidden="true">${esc(initials(name))}</span>
                            ${has(cfg.avatar) ? `<img class="mono-img" src="${esc(cfg.avatar)}" alt="${esc(name)}'s avatar" width="96" height="96" data-fallback>` : ''}
                        </span>
                        <span class="status-dot status-dot--${state}" role="img" aria-label="Status: ${STATES[state]}" title="${STATES[state]}"></span>
                    </div>
                    ${has(st.text) ? `<p class="presence mono"><span class="presence__pulse" aria-hidden="true"></span>${esc(st.text)}</p>` : ''}
                </div>
                <h1 class="profile__name">${esc(name)}</h1>
                ${roles ? `<p class="profile__roles mono">${roles}</p>` : ''}
                ${has(cfg.bio) ? `<p class="profile__bio">${esc(cfg.bio)}</p>` : ''}
                ${meta.length ? `<ul class="profile__meta mono">${meta.join('')}</ul>` : ''}
                ${socials.length ? `
                    <p class="profile__label mono"><span>Links</span></p>
                    <ul class="links">${socials.map(socialItem).join('')}</ul>` : ''}
                ${has(c.name) ? `
                    <a class="pcommunity" ${linkAttrs(c.invite)}>
                        ${squircle(c.icon, c.name)}
                        <span class="pcommunity__text">
                            <span class="pcommunity__name">${esc(c.name)}</span>
                            <span class="pcommunity__stats mono">
                                ${has(c.online) ? `<span><i class="dot" aria-hidden="true"></i><data data-live="online">${esc(c.online)}</data> online</span>` : ''}
                                ${has(c.members) ? `<span><i class="dot dot--ring" aria-hidden="true"></i><data data-live="members">${esc(c.members)}</data> members</span>` : ''}
                            </span>
                        </span>
                        <span class="pcommunity__join">Join ${icon('arrow')}</span>
                    </a>` : ''}
            </div>`;
    }

    function renderNow() {
        const el = $('#now-list');
        if (!el) return;
        const cur = cfg.currently || {};
        // Also accept the flat keys (currentlyWorkingOn, etc.)
        const legacy = { building: cfg.currentlyWorkingOn, learning: cfg.currentlyLearning, creating: cfg.currentlyCreating, exploring: cfg.currentlyExploring };
        const rows = [['building', 'Building'], ['learning', 'Learning'], ['creating', 'Creating'], ['exploring', 'Exploring']]
            .map(([key, label]) => {
                const raw = cur[key] !== undefined ? cur[key] : legacy[key];
                if (!has(raw) && !(raw && has(raw.value))) return null;
                const item = typeof raw === 'object' ? raw : { value: raw };
                return { label, value: item.value, note: item.note };
            })
            .filter(Boolean);

        const section = $('#now');
        if (!rows.length) { if (section) section.hidden = true; return; }

        el.style.setProperty('--cols', rows.length);
        el.innerHTML = rows.map((r, i) => `
            <div class="now__item">
                <p class="now__label mono"><span>0${i + 1}</span>Currently ${r.label.toLowerCase()}</p>
                <p class="now__value">${esc(r.value)}${i === 0 ? '<span class="caret" aria-hidden="true"></span>' : ''}</p>
                ${has(r.note) ? `<p class="now__note">${esc(r.note)}</p>` : ''}
            </div>`).join('');

        const upd = $('#now-updated');
        if (upd) upd.innerHTML = `<span class="live-dot" aria-hidden="true"></span>Live profile${has(cur.updated) ? ` · updated ${esc(cur.updated)}` : ''}`;
    }

    /* ---------------------------------------------------------------------
       5. Projects & content
       --------------------------------------------------------------------- */
    function btn(url, label, iconName, variant = '') {
        if (!has(url)) return '';
        return `<a class="btn ${variant}" ${linkAttrs(url)}>${label}${icon(iconName)}</a>`;
    }

    /* Live website preview: the site is loaded at desktop size (1440×900)
       and scaled down to fit the window frame. It's not interactive; the
       whole preview is a link to the project instead. */
    const EMBED_W = 1440;
    const EMBED_H = 900;

    function embedView(p) {
        return `
            <a class="media window__view embed" ${linkAttrs(p.url || p.embed)} aria-label="Open ${esc(p.name)}">
                <div class="ph ph--grid" aria-hidden="true"><span class="ph__label mono">Loading preview…</span></div>
                <iframe src="${esc(p.embed)}" width="${EMBED_W}" height="${EMBED_H}" loading="lazy"
                    title="Live preview of ${esc(p.name)}" tabindex="-1" aria-hidden="true"
                    referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
                <span class="embed__hint mono" aria-hidden="true"><i class="dot"></i>Live preview</span>
            </a>`;
    }

    function initEmbeds() {
        const views = $$('.embed');
        if (!views.length) return;
        const fit = (view) => view.style.setProperty('--s', (view.clientWidth / EMBED_W).toFixed(4));
        if ('ResizeObserver' in window) {
            const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
            views.forEach((v) => ro.observe(v));
        } else {
            views.forEach(fit);
            window.addEventListener('resize', () => views.forEach(fit));
        }
        views.forEach((v) => {
            const frame = $('iframe', v);
            frame.addEventListener('load', () => v.classList.add('is-loaded'));
        });
    }

    function renderFeatured(p) {
        const info = list(p.info).filter((x) => x && has(x.label));
        return `
        <article class="feature reveal">
            <div class="feature__media">
                <div class="window">
                    <div class="window__bar" aria-hidden="true"><span></span><span></span><span></span><em class="mono">${esc(p.domain || String(p.name || '').toLowerCase().replace(/\s+/g, '-'))}</em></div>
                    ${has(p.embed) ? embedView(p) : media(p.image, p.imageAlt, p.name, 'grid', 'window__view')}
                </div>
            </div>
            <div class="feature__body">
                <p class="feature__eyebrow mono"><span>Featured project</span>${has(p.year) ? `<span>${esc(p.year)}</span>` : ''}</p>
                <h3 class="feature__title">${esc(p.name)}</h3>
                ${statusBadge(p.status)}
                ${has(p.description) ? `<p class="feature__desc">${esc(p.description)}</p>` : ''}
                ${tagList(p.technologies)}
                ${info.length ? `<dl class="feature__info">${info.map((x) => `<div><dt class="mono">${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl>` : ''}
                <div class="feature__actions">
                    ${btn(p.url, 'View project', 'arrow', 'btn--solid')}
                    ${btn(p.github, 'GitHub', 'github')}
                </div>
            </div>
        </article>`;
    }

    /* Card spans on a 6-column grid: a row of two big cards first, then rows
       of three. Falls back gracefully for any count. */
    function cardSpans(n) {
        if (n === 1) return [6];
        let big = [1, 2, 0].find((m) => n - 2 * m >= 0 && (n - 2 * m) % 3 === 0);
        if (big === undefined) big = Math.floor(n / 2);
        return Array.from({ length: n }, (_, i) => (i < big * 2 ? 3 : 2));
    }

    function renderCard(p, i, span) {
        const size = span === 6 ? 'full' : span === 3 ? 'lg' : 'sm';
        const primary = has(p.url) ? p.url : '';
        return `
        <article class="card card--${size} reveal" style="--span:${span};--d:${(i % 3) * 80}ms">
            ${media(p.image, p.imageAlt, p.name, PH_VARIANTS[(i + 1) % PH_VARIANTS.length], 'card__media')}
            <div class="card__body">
                <div class="card__top">${statusBadge(p.status)}${has(p.year) ? `<span class="mono card__year">${esc(p.year)}</span>` : ''}</div>
                <h3 class="card__title">${primary ? `<a class="card__link" ${linkAttrs(primary)}>${esc(p.name)}</a>` : esc(p.name)}</h3>
                ${has(p.description) ? `<p class="card__desc">${esc(p.description)}</p>` : ''}
                ${list(p.stats).length ? `<p class="card__stats mono">${p.stats.map((s) => `<span>${esc(s)}</span>`).join('')}</p>` : ''}
                ${tagList(p.technologies)}
                <div class="card__foot">
                    ${primary ? `<span class="card__cta mono" aria-hidden="true">Open ${icon('arrow')}</span>` : '<span></span>'}
                    ${has(p.github) ? `<a class="icon-btn card__gh" ${linkAttrs(p.github)} aria-label="${esc(p.name)} on GitHub">${icon('github')}</a>` : ''}
                </div>
            </div>
        </article>`;
    }

    function renderExperiment(p, i) {
        const inner = `
            <span class="exp__idx mono">${String(i + 1).padStart(2, '0')}</span>
            <span class="exp__name">${esc(p.name)}</span>
            <span class="exp__desc">${esc(p.description || '')}</span>
            <span class="exp__tags mono">${list(p.technologies).map(esc).join(' · ')}</span>
            ${statusBadge(p.status) || '<span></span>'}
            ${icon('arrow', 'exp__arrow')}`;
        const row = has(p.url)
            ? `<a class="exp" ${linkAttrs(p.url)}>${inner}</a>`
            : `<div class="exp">${inner}</div>`;
        return `<li class="reveal" style="--d:${i * 60}ms">${row}</li>`;
    }

    function renderProjects() {
        const projects = list(cfg.projects).map(withRobloxStats);
        const featured = projects.filter((p) => p.type === 'featured');
        const experiments = projects.filter((p) => p.type === 'experiment');
        const standard = projects.filter((p) => p.type !== 'featured' && p.type !== 'experiment');

        const f = $('#project-featured');
        if (f) f.innerHTML = featured.map(renderFeatured).join('');

        renderProjectGrid(standard);

        const wrap = $('#experiments');
        if (wrap) {
            wrap.hidden = !experiments.length;
            $('#experiment-list').innerHTML = experiments.map(renderExperiment).join('');
            $('#experiment-count').textContent = `${String(experiments.length).padStart(2, '0')} entries`;
        }
        if (!projects.length) $('#projects').hidden = true;
    }

    // Separate so live updates can refresh the cards without reloading the featured iframe
    function renderProjectGrid(standard) {
        const g = $('#project-grid');
        if (!g) return;
        const cards = standard || list(cfg.projects).map(withRobloxStats)
            .filter((p) => p.type !== 'featured' && p.type !== 'experiment');
        const spans = cardSpans(cards.length);
        g.innerHTML = cards.map((p, i) => renderCard(p, i, spans[i])).join('');
    }

    function thumbFor(item) {
        if (has(item.thumbnail)) return item.thumbnail;
        if (has(item.youtubeId)) return `https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/hqdefault.jpg`;
        return '';
    }

    function platformLine(item) {
        const parts = [`${icon(platformIcon(item.platform))}<span>${esc(item.platform || 'Link')}</span>`];
        if (has(item.date)) parts.push(`<span class="platform__date">${esc(item.date)}</span>`);
        return `<span class="platform mono">${parts.join('')}</span>`;
    }

    function updateContentAside() {
        const aside = $('#content-aside');
        const L = liveData();
        if (!aside || !L) return;
        const sources = [L.youtube && 'YouTube', L.roblox && 'Roblox'].filter(Boolean).join(' & ');
        aside.textContent = `Pulled straight from ${sources}. Last synced ${timeAgo(L.generatedAt)}.`;
    }

    function renderContent() {
        const liveItems = liveContentItems();
        const items = liveItems || list(cfg.content);
        const section = $('#content');
        if (!items.length) { if (section) section.hidden = true; return; }

        if (liveItems) updateContentAside();

        let featured = items.find((x) => x.featured) || items[0];
        const rest = items.filter((x) => x !== featured);
        const side = rest.slice(0, 3);
        const more = rest.slice(3);

        const reel = `
            <a class="reel reveal" ${linkAttrs(featured.url)}>
                ${media(thumbFor(featured), featured.title, featured.title, 'rings', 'reel__media')}
                <span class="reel__shade" aria-hidden="true"></span>
                <span class="reel__play" aria-hidden="true">${icon('play')}</span>
                <span class="reel__meta">
                    ${platformLine(featured)}
                    <span class="reel__title">${esc(featured.title)}</span>
                    ${has(featured.description) ? `<span class="reel__desc">${esc(featured.description)}</span>` : ''}
                </span>
            </a>`;

        const clip = (x, i) => `
            <li class="reveal" style="--d:${i * 80}ms">
                <a class="clip" ${linkAttrs(x.url)}>
                    ${media(thumbFor(x), x.title, x.title, PH_VARIANTS[(i + 2) % PH_VARIANTS.length], 'clip__media')}
                    <span class="clip__text">
                        ${platformLine(x)}
                        <span class="clip__title">${esc(x.title)}</span>
                        ${has(x.description) ? `<span class="clip__desc">${esc(x.description)}</span>` : ''}
                    </span>
                    ${icon('arrow', 'clip__arrow')}
                </a>
            </li>`;

        $('#content-layout').innerHTML = reel + (side.length
            ? `<div class="clips"><p class="clips__head mono"><span>More</span><span>${String(side.length).padStart(2, '0')}</span></p><ol class="clips__list">${side.map(clip).join('')}</ol></div>`
            : '');
        $('#content-layout').classList.toggle('content-layout--solo', !side.length);
        $('#content-more').innerHTML = more.length ? `<ol class="clips__list clips__list--grid">${more.map(clip).join('')}</ol>` : '';
    }

    /* ---------------------------------------------------------------------
       6. Community & about
       --------------------------------------------------------------------- */
    function renderCommunity() {
        const el = $('#community-panel');
        const c = communityInfo();
        if (!el) return;
        if (!has(c.name)) { $('#community').hidden = true; return; }

        const channels = list(c.channels).map((group) => `
            <p class="mock__cat">${esc(group.category)}</p>
            ${list(group.items).map((ch) => `<p class="mock__ch${ch === c.activeChannel ? ' is-active' : ''}">${icon('hash')}<span>${esc(ch)}</span></p>`).join('')}
        `).join('');

        el.innerHTML = `
        <div class="community reveal">
            <div class="community__info">
                <div class="community__id">
                    ${squircle(c.icon, c.name, 'squircle--lg')}
                    <div>
                        <p class="community__label mono">${icon('discord')}${esc(c.label || 'Discord server')}</p>
                        <p class="community__tagline mono">${esc(c.tagline || '')}</p>
                    </div>
                </div>
                <h3 class="community__name">${esc(c.name)}</h3>
                ${has(c.description) ? `<p class="community__desc">${esc(c.description)}</p>` : ''}
                <div class="stats">
                    ${has(c.members) ? `<div class="stat"><p class="stat__num" data-live="members">${esc(c.members)}</p><p class="stat__label mono"><i class="dot dot--ring" aria-hidden="true"></i>Members</p></div>` : ''}
                    ${has(c.online) ? `<div class="stat"><p class="stat__num" data-live="online">${esc(c.online)}</p><p class="stat__label mono"><i class="dot" aria-hidden="true"></i>Online now</p></div>` : ''}
                </div>
                ${tagList(c.tags, 'tags--plain')}
                <div class="community__actions">
                    <a class="btn btn--outline btn--lg" ${linkAttrs(c.invite)}>${icon('discord')}Join ${esc(c.name)}</a>
                </div>
            </div>
            <div class="community__stage" aria-hidden="true">
                <div class="mock">
                    <div class="mock__head"><span>${esc(c.name)}</span>${icon('chevron')}</div>
                    <div class="mock__body">${channels}</div>
                    <div class="mock__foot">
                        <span class="mock__avatars"><i></i><i></i><i></i><i></i></span>
                        <span class="mono">${esc(c.online || '')}${has(c.online) ? ' online' : ''}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function renderAbout() {
        const el = $('#about-panel');
        const a = cfg.about || {};
        if (!el) return;
        // *word* → highlighted
        const statement = esc(a.statement || '').replace(/\*(.+?)\*/g, '<em>$1</em>');
        const blocks = list(a.blocks);

        el.innerHTML = `
            <div class="about__top">
                ${statement ? `<p class="about__statement reveal">${statement}</p>` : ''}
                ${list(a.tags).length ? `
                <div class="about__tags reveal" style="--d:120ms">
                    <p class="about__tags-title mono">${esc(a.tagsTitle || 'Interests')}</p>
                    ${tagList(a.tags, 'tags--lg')}
                </div>` : ''}
            </div>
            ${blocks.length ? `<ul class="skills">${blocks.map((b, i) => `
                <li class="skill reveal" style="--d:${(i % 4) * 60}ms">
                    <span class="skill__icon">${icon(b.icon || 'spark')}</span>
                    <span class="skill__idx mono">${String(i + 1).padStart(2, '0')}</span>
                    <p class="skill__title">${esc(b.title)}</p>
                    ${has(b.text) ? `<p class="skill__text">${esc(b.text)}</p>` : ''}
                </li>`).join('')}</ul>` : ''}`;
    }

    /* ---------------------------------------------------------------------
       7. Footer
       --------------------------------------------------------------------- */
    function renderFooter() {
        const el = $('#footer');
        if (!el) return;
        const name = cfg.username || 'vpn_axel';
        const socials = list(cfg.socials);
        el.innerHTML = `
            <div class="wrap">
                <div class="footer__top">
                    <div>
                        <p class="footer__eyebrow mono">Find me</p>
                        <ul class="footer__socials">${socials.map((s) => `
                            <li><a class="icon-btn icon-btn--boxed" ${linkAttrs(s.url)} aria-label="${esc(s.name)}" title="${esc(s.name)}">${icon(s.icon || platformIcon(s.name))}</a></li>`).join('')}
                        </ul>
                    </div>
                    <a class="btn" href="#home">Back to top${icon('arrowUp')}</a>
                </div>
                <p class="footer__word" aria-hidden="true">${esc(name)}</p>
                <div class="footer__bottom mono">
                    <span>© ${new Date().getFullYear()} ${esc(name)}</span>
                    ${has(cfg.footer && cfg.footer.note) ? `<span>${esc(cfg.footer.note)}</span>` : ''}
                    <button class="footer__fx" type="button" data-fx-toggle aria-pressed="true">Effects: <span data-fx-label>on</span></button>
                </div>
            </div>`;
    }

    /* ---------------------------------------------------------------------
       8. Navigation, reveal, interaction
       --------------------------------------------------------------------- */
    function initNav() {
        const nav = $('#nav');
        const menu = $('#nav-menu');
        const links = $('#nav-links');
        if (!nav || !menu || !links) return;

        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const setOpen = (open) => {
            nav.classList.toggle('is-open', open);
            menu.setAttribute('aria-expanded', String(open));
            menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            menu.innerHTML = icon(open ? 'close' : 'menu');
        };
        setOpen(false);

        menu.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
        links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); menu.focus(); }
        });
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
        });

        // Scroll spy
        const navLinks = $$('[data-nav]');
        const targets = navLinks.map((a) => $(a.getAttribute('href'))).filter((s) => s && !s.hidden);
        if (!('IntersectionObserver' in window)) return;
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = `#${entry.target.id}`;
                navLinks.forEach((a) => {
                    if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
                    else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        targets.forEach((t) => spy.observe(t));
        // "Now" sits between Home and Projects; treat it as Home
        const now = $('#now');
        if (now) {
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) navLinks.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === '#home'));
            }, { rootMargin: '-45% 0px -50% 0px' }).observe(now);
        }
    }

    function initReveal() {
        const items = $$('.reveal');
        if (!('IntersectionObserver' in window) || reduceMotion.matches) {
            items.forEach((i) => i.classList.add('is-visible'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
        items.forEach((i) => io.observe(i));
    }

    function initTilt() {
        const card = $('#profile');
        if (!card || !fx.cardTilt || !finePointer.matches || reduceMotion.matches) return;
        let raf = 0;
        card.addEventListener('pointermove', (e) => {
            if (root.classList.contains('fx-off')) return;
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                card.style.setProperty('--ry', `${((px - 0.5) * 5).toFixed(2)}deg`);
                card.style.setProperty('--rx', `${((0.5 - py) * 5).toFixed(2)}deg`);
                card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
                card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
            });
        });
        card.addEventListener('pointerleave', () => {
            cancelAnimationFrame(raf);
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    }

    function initClock() {
        const el = $('#profile-clock');
        if (!el || !has(cfg.timezone)) return;
        try {
            const f = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', timeZone: cfg.timezone });
            const tick = () => { el.textContent = f.format(new Date()); };
            tick();
            setInterval(tick, 15000);
        } catch (e) {
            el.closest('li').remove(); // invalid timezone
        }
    }

    function initGlobalHandlers() {
        // Placeholder links ("#") do nothing instead of jumping to the top
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href="#"]');
            if (a) e.preventDefault();
        });
        // Broken images fall back to the placeholder underneath
        document.addEventListener('error', (e) => {
            const img = e.target;
            if (img && img.tagName === 'IMG' && img.hasAttribute('data-fallback')) img.remove();
        }, true);
    }

    /* ---------------------------------------------------------------------
       9. Background effects
       --------------------------------------------------------------------- */
    const NOOP = { start() {}, stop() {} };

    function createStarfield() {
        const canvas = $('#fx-canvas');
        if (!canvas) return NOOP;
        if (!fx.particles) { canvas.hidden = true; return NOOP; }
        const ctx = canvas.getContext('2d');
        if (!ctx) return NOOP;

        const LINK = 120;
        let w = 0, h = 0, stars = [], raf = 0, active = false, last = 0;

        function seed() {
            const density = Math.max(0, Number(fx.particleDensity) || 1);
            const count = Math.round(Math.min(150, (w * h) / 12000) * density);
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.3 + Math.pow(Math.random(), 3) * 1.3,
                a: 0.12 + Math.random() * 0.5,
                vx: (Math.random() - 0.5) * 0.05,
                vy: -(0.01 + Math.random() * 0.04),
                t: Math.random() * Math.PI * 2,
                ts: 0.3 + Math.random(),
                z: 0.02 + Math.random() * 0.1,     // parallax depth
                link: Math.random() < 0.4
            }));
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            seed();
            if (active && reduceMotion.matches) draw(0);
        }

        function draw(time) {
            ctx.clearRect(0, 0, w, h);
            const sy = window.scrollY;
            const pts = stars.map((s) => [s.x, (((s.y - sy * s.z) % h) + h) % h]);

            if (fx.constellations) {
                ctx.lineWidth = 0.6;
                for (let i = 0; i < stars.length; i++) {
                    if (!stars[i].link) continue;
                    for (let j = i + 1; j < stars.length; j++) {
                        if (!stars[j].link) continue;
                        const dx = pts[i][0] - pts[j][0];
                        const dy = pts[i][1] - pts[j][1];
                        const d2 = dx * dx + dy * dy;
                        if (d2 > LINK * LINK) continue;
                        const alpha = (1 - Math.sqrt(d2) / LINK) * 0.08;
                        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                        ctx.beginPath();
                        ctx.moveTo(pts[i][0], pts[i][1]);
                        ctx.lineTo(pts[j][0], pts[j][1]);
                        ctx.stroke();
                    }
                }
            }

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                const twinkle = reduceMotion.matches ? 1 : 0.55 + 0.45 * Math.sin(s.t + time * 0.001 * s.ts);
                const alpha = s.a * twinkle;
                const [x, y] = pts[i];
                if (s.r > 1.1) {
                    ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.06).toFixed(3)})`;
                    ctx.beginPath(); ctx.arc(x, y, s.r * 5, 0, Math.PI * 2); ctx.fill();
                }
                ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
            }
        }

        function frame(time) {
            const dt = Math.min(50, time - (last || time)) * 0.06;
            last = time;
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.x = (s.x + s.vx * dt + w) % w;
                s.y = (s.y + s.vy * dt + h) % h;
            }
            draw(time);
            raf = requestAnimationFrame(frame);
        }

        let resizeTimer = 0;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });
        document.addEventListener('visibilitychange', () => {
            if (!active || reduceMotion.matches) return;
            cancelAnimationFrame(raf);
            if (!document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
        });
        resize();

        return {
            start() {
                if (active) return;
                active = true;
                if (reduceMotion.matches) { draw(0); return; }
                last = 0;
                raf = requestAnimationFrame(frame);
            },
            stop() {
                active = false;
                cancelAnimationFrame(raf);
                ctx.clearRect(0, 0, w, h);
            }
        };
    }

    function createCursorGlow() {
        const el = $('#fx-glow');
        if (!el) return NOOP;
        if (!fx.cursorGlow || !finePointer.matches || reduceMotion.matches) { el.hidden = true; return NOOP; }

        let x = window.innerWidth / 2, y = window.innerHeight / 3, tx = x, ty = y, raf = 0;

        function tick() {
            x += (tx - x) * 0.12;
            y += (ty - y) * 0.12;
            el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(tick) : 0;
        }
        function move(e) {
            tx = e.clientX; ty = e.clientY;
            el.classList.add('is-on');
            if (!raf) raf = requestAnimationFrame(tick);
        }
        function leave() { el.classList.remove('is-on'); }

        return {
            start() {
                window.addEventListener('pointermove', move, { passive: true });
                document.documentElement.addEventListener('pointerleave', leave);
            },
            stop() {
                window.removeEventListener('pointermove', move);
                document.documentElement.removeEventListener('pointerleave', leave);
                cancelAnimationFrame(raf); raf = 0;
                el.classList.remove('is-on');
            }
        };
    }

    function initEffects() {
        const stars = createStarfield();
        const glow = createCursorGlow();
        let on = store.get('fx', true);

        const apply = () => {
            root.classList.toggle('fx-off', !on);
            $$('[data-fx-toggle]').forEach((b) => {
                b.setAttribute('aria-pressed', String(on));
                b.title = on ? 'Turn background effects off' : 'Turn background effects on';
            });
            $$('[data-fx-label]').forEach((l) => { l.textContent = on ? 'on' : 'off'; });
            if (on) { stars.start(); glow.start(); } else { stars.stop(); glow.stop(); }
        };

        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-fx-toggle]')) return;
            on = !on;
            store.set('fx', on);
            apply();
        });
        apply();
    }

    /* ---------------------------------------------------------------------
       10. Music player — never autoplays
       --------------------------------------------------------------------- */
    function formatTime(sec) {
        if (!isFinite(sec) || sec < 0) return '0:00';
        const m = Math.floor(sec / 60);
        return `${m}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
    }

    function setRangeFill(input) {
        const min = Number(input.min) || 0, max = Number(input.max) || 100;
        input.style.setProperty('--p', `${((Number(input.value) - min) / (max - min)) * 100}%`);
    }

    function initPlayer() {
        const el = $('#player');
        const m = cfg.music || {};
        const tracks = list(m.tracks).filter((t) => t && (has(t.title) || has(t.src)));
        if (!el || !m.enabled || !tracks.length) return;

        const multi = tracks.length > 1;
        el.hidden = false;
        document.body.classList.add('has-player');
        el.innerHTML = `
            <button class="player__fab" type="button" aria-label="Open music player" aria-expanded="false" aria-controls="player-panel">
                ${icon('music')}
                <span class="viz viz--mini" aria-hidden="true"><i></i><i></i><i></i></span>
            </button>
            <div class="player__panel" id="player-panel" role="region" aria-label="Music player">
                <div class="player__main">
                    <div class="player__art"><span class="player__art-ph" aria-hidden="true">${icon('music')}</span></div>
                    <div class="player__info">
                        <p class="player__title"></p>
                        <p class="player__artist mono"></p>
                    </div>
                    <span class="viz" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
                    <button class="player__play" type="button" aria-label="Play">${icon('play')}</button>
                </div>
                <div class="player__seek">
                    <span class="player__time mono" data-cur>0:00</span>
                    <input class="range" type="range" min="0" max="1000" step="1" value="0" aria-label="Seek" data-seek>
                    <span class="player__time mono" data-dur>0:00</span>
                </div>
                <div class="player__foot">
                    ${multi ? `<button class="icon-btn icon-btn--sm" type="button" data-prev aria-label="Previous track">${icon('prev')}</button>
                               <button class="icon-btn icon-btn--sm" type="button" data-next aria-label="Next track">${icon('next')}</button>` : ''}
                    <button class="icon-btn icon-btn--sm" type="button" data-mute aria-label="Mute">${icon('volume')}</button>
                    <input class="range range--vol" type="range" min="0" max="100" step="1" aria-label="Volume" data-vol>
                    <span class="player__note mono" data-note role="status"></span>
                    <button class="icon-btn icon-btn--sm" type="button" data-collapse aria-label="Minimize player">${icon('chevron')}</button>
                </div>
            </div>`;

        const audio = new Audio();
        audio.preload = 'metadata';
        const q = (s) => $(s, el);
        const playBtn = q('.player__play');
        const seek = q('[data-seek]');
        const vol = q('[data-vol]');
        const muteBtn = q('[data-mute]');
        const note = q('[data-note]');
        const fab = q('.player__fab');
        let index = 0;
        let seeking = false;

        audio.volume = Math.min(1, Math.max(0, store.get('volume', 0.6)));
        vol.value = Math.round(audio.volume * 100);
        setRangeFill(vol);

        function setPlaying(playing) {
            el.classList.toggle('is-playing', playing);
            playBtn.innerHTML = icon(playing ? 'pause' : 'play');
            playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        }

        function setUnavailable(msg) {
            el.classList.add('is-unavailable');
            playBtn.disabled = true;
            note.textContent = msg;
            setPlaying(false);
        }

        function load(i) {
            index = (i + tracks.length) % tracks.length;
            const t = tracks[index];
            el.classList.remove('is-unavailable');
            playBtn.disabled = false;
            note.textContent = multi ? `${index + 1}/${tracks.length}` : '';
            q('.player__title').textContent = t.title || 'Untitled';
            q('.player__artist').textContent = t.artist || '';
            const art = q('.player__art');
            const old = $('img', art);
            if (old) old.remove();
            if (has(t.artwork)) art.insertAdjacentHTML('beforeend', `<img class="mono-img" src="${esc(t.artwork)}" alt="" data-fallback>`);
            seek.value = 0; setRangeFill(seek);
            q('[data-cur]').textContent = '0:00';
            q('[data-dur]').textContent = '0:00';
            if (!has(t.src)) { audio.removeAttribute('src'); setUnavailable('No audio file set'); return; }
            audio.src = t.src;
        }

        function toggle() {
            if (el.classList.contains('is-unavailable')) return;
            if (audio.paused) audio.play().catch(() => setUnavailable('Could not play file'));
            else audio.pause();
        }

        audio.addEventListener('play', () => setPlaying(true));
        audio.addEventListener('pause', () => setPlaying(false));
        audio.addEventListener('loadedmetadata', () => { q('[data-dur]').textContent = formatTime(audio.duration); });
        audio.addEventListener('timeupdate', () => {
            if (seeking || !audio.duration) return;
            seek.value = Math.round((audio.currentTime / audio.duration) * 1000);
            setRangeFill(seek);
            q('[data-cur]').textContent = formatTime(audio.currentTime);
        });
        audio.addEventListener('ended', () => {
            if (multi) { load(index + 1); audio.play().catch(() => {}); } else setPlaying(false);
        });
        audio.addEventListener('error', () => { if (audio.getAttribute('src')) setUnavailable('Audio file not found'); });

        playBtn.addEventListener('click', toggle);
        seek.addEventListener('input', () => {
            seeking = true;
            setRangeFill(seek);
            if (audio.duration) q('[data-cur]').textContent = formatTime((seek.value / 1000) * audio.duration);
        });
        seek.addEventListener('change', () => {
            if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration;
            seeking = false;
        });
        vol.addEventListener('input', () => {
            audio.volume = vol.value / 100;
            audio.muted = false;
            setRangeFill(vol);
            store.set('volume', audio.volume);
            updateMute();
        });
        function updateMute() {
            const silent = audio.muted || audio.volume === 0;
            muteBtn.innerHTML = icon(silent ? 'mute' : 'volume');
            muteBtn.setAttribute('aria-label', silent ? 'Unmute' : 'Mute');
        }
        muteBtn.addEventListener('click', () => { audio.muted = !audio.muted; updateMute(); });
        const prev = q('[data-prev]');
        const next = q('[data-next]');
        if (prev) prev.addEventListener('click', () => { const was = !audio.paused; load(index - 1); if (was) audio.play().catch(() => {}); });
        if (next) next.addEventListener('click', () => { const was = !audio.paused; load(index + 1); if (was) audio.play().catch(() => {}); });

        // Collapse / expand
        const setCollapsed = (c) => {
            el.dataset.collapsed = String(c);
            fab.setAttribute('aria-expanded', String(!c));
            store.set('player-collapsed', c);
        };
        fab.addEventListener('click', () => { setCollapsed(false); playBtn.focus(); });
        q('[data-collapse]').addEventListener('click', () => { setCollapsed(true); fab.focus(); });
        setCollapsed(store.get('player-collapsed', window.innerWidth < 720));

        load(0);
        updateMute();
        if (m.autoplay) initAutoplay(audio, el);
    }

    /* Browsers block audio with sound until the visitor interacts with the
       page. So: try right away, and if that's blocked, start on the first
       click / tap / key press anywhere (except on the player itself, which
       handles its own buttons). */
    function initAutoplay(audio, el) {
        const events = ['pointerdown', 'keydown', 'touchstart'];
        let done = false;
        const stop = () => {
            done = true;
            events.forEach((ev) => document.removeEventListener(ev, onGesture, true));
        };
        function tryPlay() {
            if (done || el.classList.contains('is-unavailable') || !audio.paused) return;
            audio.play().then(stop).catch(() => {});
        }
        function onGesture(e) {
            if (el.contains(e.target)) { stop(); return; } // visitor is using the player directly
            tryPlay();
        }
        events.forEach((ev) => document.addEventListener(ev, onGesture, true));
        audio.addEventListener('pause', () => { if (audio.currentTime > 0) stop(); }); // respect a manual pause
        tryPlay();
    }

    /* ---------------------------------------------------------------------
       10b. Live refresh — on Cloudflare Pages, /api/live
       (functions/api/live.js) returns fresh data. The page first renders
       instantly from the data/live.js snapshot, then swaps in anything that
       changed. Skipped when opened as a local file.
       --------------------------------------------------------------------- */
    function liveEndpoint() {
        const l = cfg.live || {};
        if (l.enabled === false || !has(l.endpoint) || location.protocol === 'file:') return null;
        const p = new URLSearchParams();
        if (l.youtube && has(l.youtube.handle)) {
            p.set('youtube', String(l.youtube.handle).replace(/^@/, ''));
            if (l.youtube.maxItems) p.set('max', l.youtube.maxItems);
            if (l.youtube.includeShorts === false) p.set('shorts', '0');
        }
        if (l.roblox && has(l.roblox.userId)) {
            p.set('roblox', l.roblox.userId);
            if (l.roblox.hideEmptyPlaces === false) p.set('empty', '1');
        }
        const invite = l.discord && cfg.community && cfg.community.invite;
        if (has(invite) && invite !== '#') p.set('discord', String(invite).replace(/\/+$/, '').split('/').pop());
        p.sort();
        return [...p.keys()].length ? `${l.endpoint}?${p}` : null;
    }

    function updateCommunityCounts() {
        const c = communityInfo();
        $$('[data-live="online"]').forEach((n) => { n.textContent = c.online; });
        $$('[data-live="members"]').forEach((n) => { n.textContent = c.members; });
    }

    async function refreshLive() {
        const url = liveEndpoint();
        if (!url) return;
        let fresh;
        try {
            const res = await fetch(url, { headers: { Accept: 'application/json' } });
            if (!res.ok) return;
            fresh = await res.json();
        } catch (e) {
            return; // offline, or no function (e.g. local preview): keep the snapshot
        }
        const prev = window.liveData || {};
        const next = { generatedAt: fresh.generatedAt || prev.generatedAt };
        // A source that failed upstream keeps its snapshot data
        ['youtube', 'roblox', 'discord'].forEach((k) => { if (fresh[k] || prev[k]) next[k] = fresh[k] || prev[k]; });
        const signature = (d) => JSON.stringify([d.youtube, d.roblox, d.discord]);
        const changed = signature(next) !== signature(prev);
        window.liveData = next;

        if (changed) {
            renderProjectGrid();
            renderContent();
            updateCommunityCounts();
            initReveal();
        } else {
            updateContentAside();
        }
    }

    /* ---------------------------------------------------------------------
       11. Boot
       --------------------------------------------------------------------- */
    function initHome() {
        renderProfile();
        renderNow();
        renderProjects();
        initEmbeds();
        renderContent();
        renderCommunity();
        renderAbout();
        renderFooter();
        initNav();
        initReveal();
        initTilt();
        initClock();
        initPlayer();
        refreshLive();
    }

    function boot() {
        applyTheme();
        applyMeta();
        initGlobalHandlers();
        if (document.body.dataset.page === 'home') initHome();
        initEffects();
        requestAnimationFrame(() => root.classList.add('is-ready'));
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
