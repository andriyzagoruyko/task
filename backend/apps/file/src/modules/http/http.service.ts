import { BadRequestException, Injectable } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

import { FileTypeEnum } from '../file/enums/file-type.enum';
import {
  SUPPORTED_AUDIO_TYPES,
  SUPPORTED_IMAGE_TYPES,
} from '@app/shared/definitions';

@Injectable()
export class HttpService {
  async getFileProperties(url: string): Promise<{
    size: number;
    type: FileTypeEnum;
  }> {
    return new Promise<any>((resolve, reject) => {
      this.request(
        url,
        (res) => {
          const size = Number(res.headers['content-length'] || 0);
          const contentType = res.headers['content-type'];
          const type = this.getFIleTypeFromContentType(contentType);

          if (type === null) {
            return reject(
              new BadRequestException(
                `Extension ${contentType} is not supported`,
              ),
            );
          }

          resolve({ size, type });
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
      ? https.get(url, { timeout: 30000 })
      : http.get(url, { timeout: 30000 });

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
