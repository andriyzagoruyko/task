import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export enum WebsocketEvents {
  RecognitionTaskUpdate = 'RecognitionTaskUpdate',
}

@Injectable()
export class WebsocketClientService {
  private subject = new Subject<{ name: string; data: unknown }>();
  get eventSubject$(): Observable<{ name: string; data: unknown }> {
    return this.subject.asObservable();
  }

  pushEvent(eventName: string, eventData: unknown): void {
    this.subject.next({ name: eventName, data: eventData });
  }
}
