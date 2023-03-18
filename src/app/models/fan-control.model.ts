export interface FanControlModel {
  // Estado: ON, OFF
  fpwr: string;
  // Modo auto: ON, OFF
  auto: string;
  // Potencia: 0010 - 0001
  fnsp: string;
  // Oscilacion ON, OFF
  oson: string;
  // Dirección ON, OFF
  direccion: string;
  // Night mode ON, OFF
  nmod?: string;
}

// + info https://www.npmjs.com/package/iobroker.dysonairpurifier
