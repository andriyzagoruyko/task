import { BadRequestException, Injectable } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import { SUPPORTED_AUDIO_TYPES, SUPPORTED_IMAGE_TYPES } from 'src/definitions';
import { FileTypeEnum } from '../file/enums/file-type.enum';

@Injectable()
export class HttpService {
  downloadFile(
    url: string,
    onProgress?: (progress: number) => void,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const req = https.get(url, { timeout: 3000 }, (res) => {
        const totalBytes = Number(res.headers['content-length']);
        const data = [];
        let receivedBytes = 0;
        res.on('readable', function () {
          const chunk = this.read();
          if (chunk) {
            receivedBytes += Buffer.byteLength(chunk);
            const progress = (receivedBytes / totalBytes) * 100;
            console.log('Downloading file...', progress);
            data.push(chunk);
            onProgress?.(progress);
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

  async getFileProperties(url: string): Promise<{
    size: number;
    type: FileTypeEnum;
    name: string;
  }> {
    return new Promise<any>((resolve, reject) => {
      this.request(
        url,
        (res) => {
          const name = url.split('/').pop();
          const size = Number(res.headers['content-length']);
          const contentType = res.headers['content-type'];
          const type = this.getFIleTypeFromContentType(contentType);

          if (type === null) {
            return reject(
              new BadRequestException(
                `Extension ${contentType} is not supported`,
              ),
            );
          }

          resolve({ size, type, name });
        },
        reject,
      );
    });
  }

  request(
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

  getFIleTypeFromContentType(contentType: string) {
    if (SUPPORTED_IMAGE_TYPES.includes(contentType)) {
      return FileTypeEnum.IMAGE;
    }

    if (SUPPORTED_AUDIO_TYPES.includes(contentType)) {
      return FileTypeEnum.AUDIO;
    }

    return null;
  }
}
