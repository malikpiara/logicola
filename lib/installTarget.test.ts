import { describe, expect, it } from 'vitest';
import { installTarget } from './installTarget';

const UA = {
  androidChrome:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
  iphoneSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  iphoneChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.0.0 Mobile/15E148 Safari/604.1',
  ipadAsMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  macSafari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  macChrome:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  windowsEdge:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
  firefox:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
};

const base = { standalone: false, hasPrompt: false };

describe('installTarget', () => {
  it('reports the installed app before anything else', () => {
    expect(
      installTarget({ ...base, ua: UA.iphoneSafari, standalone: true })
    ).toBe('installed');
    expect(
      installTarget({
        ...base,
        ua: UA.macChrome,
        standalone: true,
        hasPrompt: true,
      })
    ).toBe('installed');
  });

  it('uses the captured prompt wherever Chromium offered one', () => {
    expect(
      installTarget({ ...base, ua: UA.androidChrome, hasPrompt: true })
    ).toBe('prompt');
    expect(
      installTarget({ ...base, ua: UA.windowsEdge, hasPrompt: true })
    ).toBe('prompt');
    expect(installTarget({ ...base, ua: UA.macChrome, hasPrompt: true })).toBe(
      'prompt'
    );
  });

  it('sends every iOS browser to the Share sheet', () => {
    expect(installTarget({ ...base, ua: UA.iphoneSafari })).toBe('ios');
    expect(installTarget({ ...base, ua: UA.iphoneChrome })).toBe('ios');
  });

  it('tells an iPad from a Mac by its touch points', () => {
    expect(
      installTarget({ ...base, ua: UA.ipadAsMac, maxTouchPoints: 5 })
    ).toBe('ios');
    expect(
      installTarget({ ...base, ua: UA.macSafari, maxTouchPoints: 0 })
    ).toBe('safari_mac');
  });

  it('sends Chromium without a prompt yet, and Firefox, to the menu', () => {
    expect(installTarget({ ...base, ua: UA.androidChrome })).toBe('menu');
    expect(installTarget({ ...base, ua: UA.macChrome })).toBe('menu');
    expect(installTarget({ ...base, ua: UA.firefox })).toBe('menu');
  });
});
