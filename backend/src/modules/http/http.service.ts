import { Injectable } from '@nestjs/common';
import { HttpService as AxiosService } from '@nestjs/axios';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class HttpService {
  constructor() {}

  async downloadFile(url: string): Promise<Buffer> {
    return this.download(url);
  }

  getUrlFileName(url: string) {
    return url.split('/').pop();
  }

  async getContentType(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.request(url, (res) => resolve(res.headers['content-type']), reject);
    });
  }

  async getContentLength(url: string) {
    return new Promise<number>((resolve, reject) => {
      this.request(
        url,
        (res) => resolve(Number(res.headers['content-length'])),
        reject,
      );
    });
  }

  async request(
    url: string,
    onResponse: (res: http.IncomingMessage) => void,
    onError: (err: unknown) => void,
  ) {
    const req = url.startsWith('https://')
      ? https.get(url, { timeout: 3000 })
      : http.get(url, { timeout: 3000 });

    req.once('response', (response) => {
      req.destroy();
      if (response.statusCode === 200) {
        return onResponse(response);
      }

      return onError(
        new Error(`File is not accessible, status: ${response.statusCode}`),
      );
    });

    req.once('error', (e) => {
      req.destroy();
      onError(e);
    });

    req.once('timeout', (e) => {
      req.destroy();
      onError(e);
    });
  }

  download(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const req = https.get(url, { timeout: 3000 }, (res) => {
        const totalBytes = Number(res.headers['content-length']);
        const data = [];
        let receivedBytes = 0;
        res.on('readable', function () {
          const chunk = this.read();
          if (chunk) {
            data.push(chunk);
            receivedBytes += Buffer.byteLength(chunk);
            console.log('Downloading file', (receivedBytes / totalBytes) * 100);
          }
        });
        res.on('end', () => resolve(Buffer.concat(data)));
      });
      req.on('error', reject);
    });
  }
}
