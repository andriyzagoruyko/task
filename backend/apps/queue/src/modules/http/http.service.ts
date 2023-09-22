import { Injectable } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class HttpService {
  REQUEST_TIMEOUT = 6000;
  downloadFile(
    url: string,
    onProgress?: (progress: number) => void,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https://') ? https : http;
      const req = client.get(url, { timeout: this.REQUEST_TIMEOUT }, (res) => {
        const data = [];

        res.on('readable', function () {
          const totalBytes = Number(res.headers['content-length'] || 0);
          const chunk = this.read();
          let receivedBytes = 0;
          if (chunk) {
            receivedBytes += Buffer.byteLength(chunk);

            const progress = (receivedBytes / totalBytes) * 100;
            onProgress?.(progress);

            console.log('Downloading file...', progress);
            data.push(chunk);
          }
        });

        res.once('end', () => {
          req.destroy();
          resolve(Buffer.concat(data));
        });

        res.once('error', (e) => {
          req.destroy();
          reject(e);
        });
      });

      req.once('error', (e) => {
        req.destroy();
        reject(e);
      });
    });
  }
}
