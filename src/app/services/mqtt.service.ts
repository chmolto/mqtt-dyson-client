import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Paho from 'paho-mqtt';
import {
  REQUEST_CURRENT,
  CURRENT_STATUS,
  TOPIC_COMMAND,
} from '../constants/mqtt.config';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  public socket;
  public socketResponse: Subject<any> = new Subject();

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new Paho.Client('127.0.0.1', 9001, 'browser');
    this.socket.connect({
      onSuccess: this.onConnect.bind(this),
      onFailure: this.onFailure.bind(this),
    });
    this.socket.onConnectionLost = this.onConnectionLost.bind(this);
    this.socket.onMessageArrived = this.onMessageArrived.bind(this);
  }

  private onFailure() {
    console.log('Failure on connect, retrying ...');
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  private onConnect() {
    console.log('Connected');
    this.socket.subscribe('#');
    this.getStatus();
  }

  private onConnectionLost(event) {
    console.log('Error');
    console.log(event.errorMessage);
  }

  private onMessageArrived(event) {
    if (event?.payloadString) {
      this.socketResponse.next(event.payloadString);
    }
  }

  private getStatus() {
    const message = new Paho.Message(REQUEST_CURRENT(CURRENT_STATUS));
    message.destinationName = TOPIC_COMMAND;
    this.socket.send(message);
    setInterval(() => {
      this.socket.send(message);
    }, 10000);
  }
}
