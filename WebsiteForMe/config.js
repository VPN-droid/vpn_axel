/* ==========================================================================
   config.js — everything personal lives here.
   Edit this file; you should never need to touch index.html.

   Quick rules:
   - Leave a field as "" to hide it.
   - "#" is a placeholder URL. Clicking a "#" link does nothing until you
     replace it with a real one.
   - Image paths are relative to index.html. Leave "" and the site draws a
     monochrome placeholder for you.
   - Anything marked PLACEHOLDER is made up for layout. Replace or delete it.
   ========================================================================== */

const siteConfig = {

    /* --- Identity ------------------------------------------------------- */
    username: "vpn_axel",
    displayName: "vpn_axel",
    roles: ["developer", "creator", "roblox"],
    bio: "Developer, creator & Roblox-er. Mostly websites, Roblox stuff and whatever I have in mind, like this website.",

    avatar: "assets/images/avatar.png",
    banner: "assets/images/banner.gif",   // PNG, JPG or animated GIF ("" for the dot pattern)
    location: "United States",
    timezone: "nac",                         // e.g. "Europe/Stockholm" shows your local time on the card

    status: {
        text: "Building something",
        state: "online"                   // online | idle | dnd | offline
    },

    /* --- Page metadata (also edit the <meta> tags in index.html for SEO,
           because crawlers don't run JavaScript) ------------------------- */
    site: {
        title: "vpn_axel",
        description: "vpn_axel — developer, creator & professional internet enjoyer. Projects, content and community."
    },

    /* --- Social links ---------------------------------------------------
       icon options: discord, youtube, roblox, github, steam, tiktok,
       instagram, x, twitch, globe, mail, link
       Order here = order on the site. */
    socials: [
        { name: "Discord", username: "@vpn_axel",     url: "https://discord.gg", icon: "discord" },
        { name: "YouTube", username: "@vpn_axel",  url: "https://www.youtube.com/@vpn_axel", icon: "youtube" },
        { name: "Roblox",  username: "VPN_Axel",   url: "https://www.roblox.com/users/9661699934/profile/", icon: "roblox" },
        { name: "GitHub",  username: "VPN-droid",  url: "https://github.com/VPN-droid", icon: "github" },
        { name: "Steam",   username: "VPN_Axel",   url: "https://steamcommunity.com/id/VPN_Axel/", icon: "steam" },
        { name: "TikTok",  username: "@vpn__axel", url: "https://www.tiktok.com/@vpn__axel", icon: "tiktok" },
        { name: "X",       username: "@Axel_VPN",  url: "https://x.com/Axel_VPN", icon: "x" }
    ],

    /* --- Currently ------------------------------------------------------
       Each entry can be a plain string or { value, note }. PLACEHOLDERS. */
    currently: {
        updated: "September 2026",
        building:  { value: "This website",        note: "Hand-made. No frameworks." },
        learning:  { value: "Editing n' stuff", note: "Well working on my skill." },
        creating:  { value: "Bangers",      note: "Go watch my vids frfr." },
        exploring: { value: "Can'y wait for MicroOLED",            note: "It's really expencive rn." }
    },

    /* --- Projects -------------------------------------------------------
       type: "featured"   -> big horizontal showcase (use 1, maybe 2)
             "standard"   -> cards (layout sizes itself automatically)
             "experiment" -> compact list rows
       status examples: Live, Active, In progress, Prototype, Concept, Archived
       info: optional extra facts shown on featured projects
       github: leave "" to hide the GitHub button. */
    projects: [
        {
            type: "featured",
            name: "Cosmo",
            description: "A web proxy site with a built-in games library, a sidebar app layout and an animated constellation background.",
            embed: "https://desmos-cosmo.xyz/",      // live iframe preview (featured projects only); "" to use the image
            image: "assets/images/projects/cosmo.svg",   // shown when embed is ""
            imageAlt: "Cosmo's homepage: a dark page with a constellation background and a Get Started button",
            domain: "desmos-cosmo.xyz",
            technologies: ["HTML", "CSS", "JavaScript"],
            status: "Live",
            year: "",
            url: "https://desmos-cosmo.xyz/",
            github: "https://github.com/VPN-droid/cosmo-",
            info: [
                { label: "Role", value: "Design & development" },
                { label: "Type", value: "Web app" }
            ]
        },
        {
            type: "standard",
            name: "Jump For Mobs",
            description: "Jump up to collect mobs. Upgrade your jump to get better mobs.",
            image: "",                                   // add a thumbnail, e.g. assets/images/projects/jump-for-mobs.png
            technologies: ["Roblox Studio", "Luau"],
            status: "Released",
            url: "https://www.roblox.com/games/110748354398815/Jump-For-Mobs",
            github: ""
        },
        {
            type: "standard",
            name: "Altora",
            description: "My Discord server. A Roblox alt account shop with tons of giveaways!",
            image: "assets/images/server_icon.gif",
            imageAlt: "Altora's server icon",
            technologies: ["Discord", "Community"],
            status: "Active",
            url: "https://discord.gg/t2W6saQ8yE",
            github: ""
        }
    ],

    /* --- Content --------------------------------------------------------
       featured: true puts an item in the big slot (otherwise the first one).
       youtubeId: set it and the thumbnail is fetched from YouTube for you.
       All items are PLACEHOLDERS. */
    content: [
        {
            featured: true,
            title: "Latest upload",
            description: "Your newest video goes here. Add its youtubeId and the thumbnail loads on its own.",
            platform: "YouTube",
            thumbnail: "",
            youtubeId: "PtNDDCL8owg",
            url: "https://www.youtube.com/watch?v=PtNDDCL8owg",
            date: ""
        },
        {
            title: "Something I built in Roblox",
            description: "A Roblox game, showcase or clip.",
            platform: "Roblox",
            thumbnail: "",
            url: "#",
            date: ""
        },
        {
            title: "Dev log",
            description: "Behind the scenes of a project.",
            platform: "YouTube",
            thumbnail: "",
            url: "#",
            date: ""
        },
        {
            title: "Short clip",
            description: "Quick content, edits or experiments.",
            platform: "TikTok",
            thumbnail: "",
            url: "#",
            date: ""
        }
    ],

    /* --- Discord / community -------------------------------------------- */
    community: {
        name: "Altora",
        label: "My Discord server",
        tagline: "Roblox · community · marketplace",
        description: "My Discord server. A Roblox community with trading, giveaways, premium chats and a lot of people just hanging out.",
        icon: "assets/images/server_icon.gif",
        invite: "https://discord.gg/t2W6saQ8yE",
        members: "1,051",                 // update whenever you like
        online: "62",
        tags: ["Roblox", "Giveaways", "Marketplace", "Vouches"],
        // Decorative channel list shown in the preview window
        channels: [
            { category: "Community", items: ["welcome", "general", "vouches", "giveaways"] },
            { category: "Shop",      items: ["rblx-acc", "buy", "limited-stock"] },
            { category: "Premium",   items: ["premium-chat"] }
        ],
        activeChannel: "general"
    },

    /* --- About ----------------------------------------------------------
       Wrap words in *asterisks* to highlight them in white. */
    about: {
        statement: "I build things for the internet: *websites*, *Roblox games*, *tools* and *communities*. Mostly because it's fun watching an idea turn into something people can actually click.",
        tagsTitle: "Tools & interests",
        tags: ["HTML", "CSS", "JavaScript", "Luau", "Roblox Studio", "Discord", "UI design", "Video"],
        blocks: [
            { icon: "code",     title: "Developer",       text: "Writing code that ships." },
            { icon: "pen",      title: "Creator",         text: "Videos, edits & ideas." },
            { icon: "layout",   title: "Web development", text: "Sites built by hand." },
            { icon: "cube",     title: "Roblox",          text: "Games & systems." },
            { icon: "terminal", title: "Software",        text: "Tools & utilities." },
            { icon: "cursor",   title: "UI design",       text: "Clean, dark interfaces." },
            { icon: "gamepad",  title: "Gaming",          text: "Too many hours." },
            { icon: "cpu",      title: "Technology",      text: "Always poking at it." }
        ]
    },

    /* --- Live data from your accounts -----------------------------------
       On Cloudflare Pages, the site asks /api/live (functions/api/live.js)
       for fresh data on every visit (cached 10 minutes). data/live.js is a
       saved snapshot used for the instant first paint and as a fallback;
       refresh it with: node scripts/update-live-data.js
       With this data the site:
       - fills "Stuff I make" with your newest YouTube uploads + Roblox games
         (the "content" list below becomes the fallback; items with
         pinned: true are always shown first)
       - adds visits / playing / favorites to Roblox projects and uses the
         game's thumbnail if the project has no image
       - updates the Discord member + online counts
       Set enabled: false to go back to the manual config only. */
    live: {
        enabled: true,
        endpoint: "/api/live",   // "" = only use the data/live.js snapshot
        youtube: { handle: "@vpn_axel", maxItems: 8, includeShorts: true },
        roblox:  { userId: 9661699934, hideEmptyPlaces: true },  // hides places with 0 visits
        discord: true                                              // uses community.invite
    },

    /* --- Music player ---------------------------------------------------
       Drop an MP3 in assets/audio and point src at it.
       autoplay: browsers only allow sound after the visitor's first click,
       tap or key press, so music starts then (or instantly if allowed).
       Set enabled: false to remove the player entirely. */
    music: {
        enabled: true,
        autoplay: true,
        tracks: [
            {
                title: "LoFi Chill",
                artist: "@Chillpeach",
                artwork: "assets/images/track1icon.svg",
                src: "assets/audio/LoFi Chill.mp3"
            }
        ]
    },

    /* --- Background & effects -------------------------------------------
       Visitors can also switch all effects off with the FX button. */
    effects: {
        particles: true,        // drifting star particles
        constellations: true,   // faint lines between nearby particles
        particleDensity: 1,     // 0.5 = fewer, 1.5 = more
        grain: true,            // film grain overlay
        ambientLight: true,     // slow-moving soft light
        cursorGlow: true,       // soft glow that follows the mouse
        cardTilt: true,         // 3D tilt on the profile card
        grayscaleImages: false, // true = forces images to black & white...
        colorProfileImages: true, // ...except your profile picture, banner and server icon
        brandIcons: true,       // platform icons in their brand colours (Discord, YouTube, ...)
        bannerMotion: true      // slow pan across the banner (works with GIFs too)
    },

    /* --- Theme (monochrome) ---------------------------------------------- */
    theme: {
        background:    "#050505",
        backgroundAlt: "#080808",
        surface:       "#0D0D0D",
        surfaceLight:  "#121212",
        border:        "rgba(255,255,255,0.08)",
        text:          "#FFFFFF",
        textSecondary: "#A0A0A0",
        textMuted:     "#767676"   // #666 fails contrast for small text; this passes
    },

    footer: {
        note: "Handmade with HTML, CSS & JavaScript."
    }
};
