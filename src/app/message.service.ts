import { Injectable } from '@angular/core';
import { ToastService } from './toasts/toast.service';

import { MessageType } from './models/enums';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private infoMessageTimeout = 4000;

  constructor(public toastService: ToastService) {}

  add(message: string, messageType?: MessageType) {
    const cls: String = messageType === MessageType.ERROR ? 'bg-danger' : 'bg-success';
    this.toastService.show(message, { classname: cls + ' text-light', delay: this.infoMessageTimeout });
  }
}
