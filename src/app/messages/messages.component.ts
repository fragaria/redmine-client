import { Component, OnInit } from '@angular/core';

import { MessageService } from '../message.service';

import { MessageType } from '../models/enums';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: string[];
  errors: string[];

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.messages = this.messageService.list(MessageType.INFO);
    this.errors = this.messageService.list(MessageType.ERROR);
  }

  removeMessage(message: string) {
    this.messageService.remove(message, MessageType.INFO);
  }

  removeError(message: string) {
    this.messageService.remove(message, MessageType.ERROR);
  }

}
