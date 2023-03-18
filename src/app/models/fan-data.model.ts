export interface FanDataModel {
    // Humedad %
    hact: string;
    // Nivel de gases NO2
    noxl: string;
    // Nivel contaminación
    pm10: string;
    // Nivel contaminación
    pm25: string;
    // Sleep timer (minutos)
    sltm: string;
    // Temperatura (Fº) Conversión a Cº: x / 10 - 273
    tact: string;
    // Nivel particulas orgánicas
    va10: string;
}

// + info https://www.npmjs.com/package/iobroker.dysonairpurifier