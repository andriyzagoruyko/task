import { Injectable } from '@nestjs/common';
import { HttpService as AxiosService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosService) {}

  async downloadFile(url: string) {
    const source$ = this.httpService.get<Buffer>(url, {
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    const res = await lastValueFrom<AxiosResponse<Buffer, any>>(source$);
    return res.data;
  }

  getUrlFileName(url: string) {
    return url.split('/').pop();
  }

  async getContentType(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.makeHttpGetRequest(
        url,
        (res) => resolve(res.headers['content-type']),
        reject,
      );
    });
  }

  async getContentLength(url: string) {
    return new Promise<number>((resolve, reject) => {
      this.makeHttpGetRequest(
        url,
        (res) => resolve(Number(res.headers['content-length'])),
        reject,
      );
    });
  }

  async makeHttpGetRequest(
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
}
