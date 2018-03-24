import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { promisify, delay } from 'bluebird';
import { transformFn } from './transform_fn';
import { IgnoreSSLErrorsBehavior } from './behaviors';

export class HeadlessChromiumDriver {
  constructor(client) {
    this._client = client;
    this._waitForDelayMs = 100;
    this._behaviors = [
      new IgnoreSSLErrorsBehavior(client),
    ];
  }

  async destroy() {
    this.killed = true;
    await this._client.close();
  }

  async evaluate({ fn, args = [], awaitPromise = false, returnByValue = false }) {
    const { Runtime } = this._client;

    const serializedArgs = args.map(arg => JSON.stringify(arg)).join(',');
    const expression = `(${transformFn(fn)})(${serializedArgs})`;
    const result = await Runtime.evaluate({ expression, awaitPromise, returnByValue });
    return result.result.value;
  }

  async open(url, { headers, waitForSelector }) {
    const {  Network, Page } = this._client;
    await Promise.all([
      Network.enable(),
      Page.enable(),
    ]);

    await Promise.all(this._behaviors.map(behavior => behavior.initialize()));
    await Network.setExtraHTTPHeaders({ headers });
    await Page.navigate({ url });
    await Page.loadEventFired();
    const { frameTree } = await Page.getResourceTree();
    if (frameTree.frame.unreachableUrl) {
      throw new Error('URL open failed. Is the server running?');
    }
    await this.waitForSelector(waitForSelector);
  }

  async record(recordPath) {
    const { Page } = this._client;

    await promisify(fs.mkdir, fs)(recordPath);
    await Page.startScreencast();

    Page.screencastFrame(async ({ data, sessionId }) => {
      await this._writeData(path.join(recordPath, `${moment().utc().format('HH_mm_ss_SSS')}.png`), data);
      if (!this.killed) {
        await Page.screencastFrameAck({ sessionId });
      }
    });
  }

  async screenshot(position = null) {
    const { Page } = this._client;

    let clip;
    if (position) {
      const { boundingClientRect, scroll = { x: 0, y: 0 } } = position;
      clip = {
        x: boundingClientRect.left + scroll.x,
        y: boundingClientRect.top + scroll.y,
        height: boundingClientRect.height,
        width: boundingClientRect.width,
        scale: 1
      };
    }

    const { data } = await Page.captureScreenshot({ clip });
    return data;
  }

  async _writeData(writePath, base64EncodedData) {
    const buffer = Buffer.from(base64EncodedData, 'base64');
    await promisify(fs.writeFile, fs)(writePath, buffer);
  }

  async setViewport({ width, height, zoom }) {
    const { Emulation } = this._client;

    await Emulation.setDeviceMetricsOverride({
      width: Math.floor(width / zoom),
      height: Math.floor(height / zoom),
      deviceScaleFactor: zoom,
      mobile: false,
    });
  }

  async waitFor({ fn, args, toEqual }) {
    while(!this.killed && (await this.evaluate({ fn, args })) !== toEqual) {
      await delay(this._waitForDelayMs);
    }
  }

  async waitForSelector(selector) {
    const document = await this._client.DOM.getDocument();
    while(!this.killed) {
      const { nodeId } = await this._client.DOM.querySelector({ nodeId: document.root.nodeId, selector });
      if (nodeId) {
        break;
      }
      await delay(this._waitForDelayMs);
    }
  }
}
