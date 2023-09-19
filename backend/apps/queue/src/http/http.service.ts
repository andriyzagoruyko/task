import { Injectable } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class HttpService {
  downloadFile(
    url: string,
    onProgress?: (progress: number) => void,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https://') ? https : http;
      const req = client.get(url, { timeout: 6000 }, (res) => {
        const totalBytes = Number(res.headers['content-length'] || 0);
        const data = [];
        let receivedBytes = 0;
        res.on('readable', function () {
          const chunk = this.read();
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
