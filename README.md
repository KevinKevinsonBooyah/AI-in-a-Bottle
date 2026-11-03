# AI in a Bottle 🏴‍☠️

A compact pirate-themed AP Computer Science Principles study helper, built as a single HTML file.

## Open the app

- **GitHub Pages:** https://kevinkevinsonbooyah.github.io/AI-in-a-Bottle/ (once Pages is enabled)
- **Locally:** download `index.html` and open it in a browser.

## Activate GitHub Pages (repository owner)

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then **Save**.

GitHub will publish `index.html` at the URL above.

## Window controls

- Resize the popup from its window edges: the header, tabs, chat, and controls reflow for narrow or short windows.
- Right-click anywhere **inside the app** (home page or mini-window) to conceal the mini-window contents; right-click again to restore them. The underlying browser popup frame may remain visible, because browser JavaScript cannot minimize an operating-system window.
- When **Stealth Mode** is checked, three quick left-clicks anywhere inside the app (including the parent page and mini-window) close the mini-window and navigate the parent tab to Google Classroom.
- These gestures work only while interacting with the AI in a Bottle webpages. They cannot intercept mouse events in unrelated tabs, browsers, or desktop apps.
- Right-click is reserved for this shortcut, so use Ctrl+V or keyboard shortcuts to paste into the app.

## Gemini setup

Create an API key in [Google AI Studio](https://aistudio.google.com/api-keys), then enter it within **Run → Config → Online Gemini**. The app does not contain a Gemini API key, and no key should ever be committed to this repository. Smart routing uses available free-tier models and the on-screen request counters track local estimates, not Google's official account quotas.

**Privacy and security:** This is a public static website. Do not share your API key. The current version does not save your API key or include it in exported config files. You must paste it again after a full page/browser restart. Older versions may have stored a key; the new app removes that old browser-storage entry when you open its mini-window. Revoke a key in AI Studio if you suspect exposure.

Some browser settings or school restrictions can block popups, screenshot permissions, or external AI requests.

## Controls & new features

- **Resize the mini-window:** layout automatically adapts to narrow and short sizes (the browser's own window frame is still controlled by Chrome).
- **Right-click anywhere on either AI in a Bottle page or its mini-window:** close the mini-window in *any* mode. Right-click the main AI in a Bottle tab to reopen the popup and recover the in-memory conversation. This cannot detect right-clicks in unrelated tabs or programs, or fully minimize an OS window.
- **Triple left-click while Stealth Mode is enabled:** navigates the **main** AI in a Bottle tab to the configured Google Classroom address. Listeners work across both of this app's windows, but not outside them.
- **Box Capture:** Chrome asks you to pick a screen/tab, then you drag a rectangular crop over the screenshot and click **Use selected box**. Requires browser screen-sharing permission; nothing is uploaded until you ask a model to interpret the screenshot.
- **Local Ollama:** in **Config → Choose the brain**, select **Local • Ollama**. This restores the original ScreenStudy's local `qwen3-vl:4b-instruct` model if installed. Set the model name if you already have a different compatible model, then click **Test local connection**. No Gemini API quota applies to local Ollama. The target computer must have Ollama installed and running; this **will not** work on a school computer that cannot install Ollama.

For GitHub Pages, Ollama might block browser-origin requests. If needed, set `OLLAMA_ORIGINS=https://kevinkevinsonbooyah.github.io` in Ollama's environment and restart Ollama (see [official Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md)); browser local-network permissions may also be required. Do not publish your local Ollama server to the internet.

## Import, export, and repairing local AI

- **Settings → Export Config** downloads a JSON file containing engine preferences, Ollama host/model, and local daily usage limits. **The key, chat, screenshots and user data are intentionally excluded.**
- **Settings → Import Config** restores the supported settings only. Paste the Gemini API key yourself each new session.
- **Ollama → Repair Ollama** checks the local connection and downloads a Windows `.cmd` troubleshooting script. It is not launched automatically. After you review and run it on your **own** Windows PC, the script offers to install Ollama via official `winget`, pull the model, and optionally set the GitHub Pages origin. The app cannot bypass school installation restrictions.
- The app now includes animated sea backgrounds, a revised Classroom-tab favicon, simplified settings and general-subject practice questions alongside AP CSP.


## Ghost Mode and capture update (November 2026)

- **Stealth mini-window:** dark ocean-night theme, animated radar scan and a small “Ghost Mode” indicator. The tab favicon/title switch to Classroom when Stealth Mode is active; this is only a visual tab disguise, not Google Classroom itself.
- **Close/reopen:** right-click *inside* the mini-window to close it completely. Right-click inside the original AI in a Bottle web page, or focus that page and press **Alt + Shift + B**, to reopen it with your current draft. Web pages cannot detect right-clicks on Chrome's tab strip, browser chrome, other tabs or other apps.
- **Box Capture:** on the first use per open mini-window, select a screen or tab in Chrome's permission chooser. The app keeps the approved capture stream for follow-up screenshots, so later Box Capture/Screen presses don't open the chooser again. **Stop Sharing** stops the stream; closing the mini-window stops it too. Chrome's first-time picker is mandatory and cannot be bypassed by HTML. Reusing a stream does not provide permission for other screens.
- **Ollama setup:** **Settings → Ollama** includes numbered instructions and official links for installation, model download (`ollama pull qwen3-vl:4b-instruct`), service testing, and allowing the website origin. **Repair Ollama** diagnoses first; the optional Windows script download is a separate, explicit click. Only run that script on your own computer with permission to install software.

Sources: [Ollama Windows](https://docs.ollama.com/windows), [Ollama FAQ](https://docs.ollama.com/faq), [Qwen model](https://ollama.com/library/qwen3-vl:4b-instruct), [MDN display capture](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia), [Chrome Local Network Access](https://developer.chrome.com/docs/modern-web-guidance/guides/security/local-network-access).


## Launch sizes and mobile behavior

- **RUN:** opens the usual 438 × 690 desktop mini-window.
- **Small Mode:** requests a 350 × 540 desktop mini-window.
- **Tiny Mode:** requests a 290 × 420 desktop mini-window, with condensed controls. Browsers may enforce their own minimum window dimensions.
- Clicking a different launch button while the mini-window is already open attempts to resize it. Right-click to close and then right-click the main page to reopen the most recently selected size.
- **Mobile early support:** on narrow touch-screen devices, these buttons open the complete AI panel inside the same tab instead of launching a separate browser tab. The on-page panel expands to the viewport for usability; the three named physical popup sizes are desktop behavior.
- **Mobile screenshot workaround:** use the browser's Upload button to choose a screenshot from Photos/Files. The live Screen and Box Capture features rely on `getDisplayMedia()`, which is not consistently supported in mobile browsers and always requires user permission when available.
- iOS Safari/Chrome cannot make a website float above other apps or capture unrelated apps without explicit OS-supported user flow. A PWA/Add to Home Screen layout could be a future mobile improvement.


## Free Browser AI (no API key)

The site now has a **Free Browser AI** engine using [WebLLM 0.2.87](https://webllm.mlc.ai/docs/user/get_started.html). It runs locally in compatible Chromium browsers using WebGPU; no Ollama installation, server backend or Gemini credits are required. The inference engine and model weights download from external CDNs on first use. Chrome caches downloaded model data if its storage policy permits. Clearing site data can remove the cache.

### How to use on a Chromebook

1. Open **RUN**, **Small Mode** or **Tiny Mode** and go to **Settings → How to answer → Free Browser AI**.
2. Click **Check Compatibility**. The check verifies the HTTPS context, usable WebGPU device, and reports a *browser storage quota estimate*, not actual physical free disk space.
3. Pick **Lightweight (SmolLM2 360M, ~0.6 GB GPU memory)**, **Balanced (Llama 3.2 1B, ~1.1 GB)**, or **Stronger (Llama 3.2 3B, ~3 GB)**. Listed numbers are approximate GPU-memory requirements rather than guaranteed network download sizes.
4. Press **Download & Start Free AI** to download and load the model, with an on-screen progress indicator. No download begins merely from checking compatibility.
5. Open **Ask** and ask a **text question**. No API key, daily credit meter or cloud inference request is used for this engine. Gemini and Ollama options remain available.

**Limits:** This browser mode is text-only at present; it cannot interpret Screen/Box Capture images. WebGPU and sufficient GPU memory are mandatory; a fast CPU alone is not enough. School-managed Chromebooks might block GPU access, model CDNs, or browser storage. Passing compatibility checks does not guarantee that a larger model will fit or load successfully. This feature has been syntactically validated and its UI and compatibility path tested with a mocked WebGPU device, but the first real model download and inference have not been verified on a school Chromebook.

Free local inference means no per-message credits; it does not guarantee internet-free startup, unlimited device resources or permission to use school bandwidth/storage.
