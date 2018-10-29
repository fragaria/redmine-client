import { Injectable } from '@angular/core';

import { MessageType } from './models/enums';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages: string[] = [];
  private errors: string[] = [];

  constructor() { }

  add(message: string, messageType?: MessageType) {
    if(messageType == MessageType.ERROR) {
      this.errors.push(message);
    } else {
      this.messages.push(message);
    }
  }

  remove(message: string, messageType?: MessageType) {
    if(messageType == MessageType.ERROR) {
      let msgIndex = this.errors.indexOf(message);
      if(msgIndex > -1) {
        this.errors.splice(msgIndex, 1);
      }
    } else {
      let msgIndex = this.messages.indexOf(message);
      if(msgIndex > -1) {
        this.messages.splice(msgIndex, 1);
      }
    }
  }

  list(messageType?: MessageType): string[] {
    if(messageType == MessageType.ERROR) {
      return this.errors;
    } else {
      return this.messages;
    }
  }
}
