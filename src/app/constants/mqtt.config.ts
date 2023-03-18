import { FanControlModel } from './../models/fan-control.model';
export const BROKER = 'localhost';
export const BROKER_PORT = 9001;

export const USERNAME = 'VS9-EU-KFA8518A';
export const TOPIC_STATUS_CURRENT = `438/${USERNAME}/status/current`;
export const TOPIC_STATUS_SOFTWARE = `438/${USERNAME}/status/software`;
export const TOPIC_STATUS_CONNECTION = `438/${USERNAME}/status/connection`;
export const TOPIC_STATUS_FAULTS = `438/${USERNAME}/status/faults`;
export const TOPIC_COMMAND = `438/${USERNAME}/command`;

// REQUESTS
export const SENSOR_DATA = 'REQUEST-PRODUCT-ENVIRONMENT-CURRENT-SENSOR-DATA';
export const CURRENT_STATUS = 'REQUEST-CURRENT-STATE';
export const REQUEST_CURRENT = (status) => `{
  "f": "${TOPIC_COMMAND}",
  "mode-reason": "LAPP",
  "time": "2021-08-12T11:16:16Z",
  "msg": "${status}"
}`;

// COMANDOS
export const COMMAND_DEVICE = (status) => `{
  "f": "${TOPIC_COMMAND}",
  "data": ${status},
  "mode-reason": "LAPP",
  "time": "2021-08-12T11:16:25Z",
  "msg": "STATE-SET"
}`;
