# SPIDER VPN — Frontend Prototype v1.0.0

A modern VPN client interface by **Mehdi Ebrahimi** (ساخته شده توسط مهدی ابراهیمی).

> **This is a UI prototype. No VPN tunnel exists.** The Connect button never shows "Connected". Real VLESS/Trojan tunneling is planned via native Android integration.

## Run
Open `index.html` in a browser, or serve the folder (`python3 -m http.server`). QR scanning needs HTTPS or localhost.

## Files
`index.html` structure · `style.css` design system · `script.js` logic, i18n (English/Persian, RTL/LTR), parsing, storage.

## What works
- Paste `vless://` / `trojan://` links (multiple per paste), import `.txt`/`.json` files, scan QR (camera requested only after tapping Scan; falls back to paste/import).
- Validation with specific errors (UUID, port, host, password). VMess and Shadowsocks are rejected.
- Save, rename, duplicate, delete, select. Everything stays in `localStorage` (`spider.*` keys). Nothing is sent anywhere.
- Servers: search, sort, favorites, country grouping (flag taken from the config name), auto select.
- Ping values are **demo only** (labelled "demo"); real ping needs the native engine.
- Statistics are **simulated** and labelled so.
- Settings: language, theme, animations, clear local data.

## Android integration
The button reads `window.SpiderNative.isConnected()`. Until a native bridge defines it, the state returns to Disconnected. Replace the connect timeout in `script.js` with bridge calls (connect/disconnect/stats/ping).

## Fonts
Font stacks list Inter and Vazirmatn with system fallbacks. For the exact look, bundle both locally (`@font-face`) — no external CDN is used.

## Testing
Run `SpiderVPNTest()` in the browser console to check the parser.
