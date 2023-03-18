import { Injectable } from '@angular/core';
import { FanControlModel } from '../models/fan-control.model';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  constructor() {}

  public parseDeviceStateToFormState(state: FanControlModel) {
    return {
      encendido: state.fpwr === 'ON',
      oscilar: state.oson === 'ON',
      auto: state.auto === 'ON',
      direccion: state.direccion === 'ON',
      potencia: state.auto === 'ON' ? 1 : Number.parseInt(state.fnsp),
    };
  }

  public parseFormStateToDeviceState(state) {
    const parsedStatus = {
      fpwr: state.encendido ? 'ON' : 'OFF',
      oson: state.oscilar ? 'ON' : 'OFF',
      fdir: state.direccion ? 'ON' : 'OFF',
    };
    if (!state.auto) {
      parsedStatus['fnsp'] = `${state.potencia}`;
    } else {
      parsedStatus['auto'] = state.auto ? 'ON' : 'OFF';
    }
    return parsedStatus;
  }
}
