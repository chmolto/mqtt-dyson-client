import { ParserService } from './services/parser.service';
import { FanDataModel } from './models/fan-data.model';
import { MqttService } from './services/mqtt.service';
import { Component, HostListener } from '@angular/core';
import { TOPIC_COMMAND, COMMAND_DEVICE } from './constants/mqtt.config';
import * as echarts from 'echarts';
import { CHART_CONFIG } from './constants/chart.config';
import { parseIfNeeded } from './utils';
import Paho from 'paho-mqtt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FanControlModel } from './models/fan-control.model';
import { Subject } from 'rxjs';
import { ChartDataModel } from './models/chart-data.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public chartData: ChartDataModel[] = [];
  private newEnvironmentData$: Subject<FanDataModel> = new Subject();
  public potencia: number = 1;
  public form: FormGroup;
  private initialFormSetup = false;
  private chartInstance;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.chartInstance.resize();
  }

  constructor(
    private mqttService: MqttService,
    private formBuilder: FormBuilder,
    private parserService: ParserService
  ) {
    this.setForm();
    this.subscribeFormChanges();
    this.subscribeWSMessages();
    this.subscribeNewEnvironmentData();
  }

  private setForm() {
    this.initialFormSetup = true;
    this.form = this.formBuilder.group({
      encendido: [false, [Validators.required]],
      oscilar: [false, [Validators.required]],
      direccion: [false, [Validators.required]],
      auto: [false, [Validators.required]],
      potencia: [1, [Validators.required]],
    });
  }

  private subscribeFormChanges() {
    this.form.valueChanges.subscribe((status) => {
      console.log(status);
      if (this.initialFormSetup) {
        this.initialFormSetup = false;
      } else {
        if (!status.encendido) {
          status.oscilar = false;
          status.auto = false;
          status.direccion = false;
          status.potencia = 1;
        }
        this.commandDevice(status);
      }
    });
  }

  private subscribeWSMessages() {
    this.mqttService.socketResponse.subscribe((response) => {
      response = parseIfNeeded(response);
      if (typeof response === 'object' && !response.f) {
        console.log(response);
        if (response.msg === 'CURRENT-STATE') {
          this.setFormState(response['product-state']);
        }
        if (response.msg === 'ENVIRONMENTAL-CURRENT-SENSOR-DATA') {
          this.newEnvironmentData$.next(response.data);
        }
      }
    });
  }

  private subscribeNewEnvironmentData() {
    this.newEnvironmentData$.subscribe((data) => {
      const cantidadDatos = 20;
      if (this.chartData.length >= cantidadDatos) {
        this.chartData.shift();
      }
      this.chartData.push({
        time: new Date().toTimeString().slice(0, 8),
        data,
      });
      this.chartInstance.setOption(CHART_CONFIG(this.chartData));
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const chartDom = document.getElementById('chart');
    if (chartDom) {
      this.chartInstance = echarts.init(chartDom);
      this.chartInstance.setOption(CHART_CONFIG(this.chartData));
    }
  }

  private setFormState(state: FanControlModel) {
    const formState = this.parserService.parseDeviceStateToFormState(state);
    this.form.patchValue(formState);
  }

  public commandDevice(state) {
    const deviceStatus = JSON.stringify(
      this.parserService.parseFormStateToDeviceState(state),
      null,
      '\t'
    );
    const commandOrder = COMMAND_DEVICE(deviceStatus);
    console.log(commandOrder);
    const message = new Paho.Message(commandOrder);
    message.destinationName = TOPIC_COMMAND;
    this.mqttService.socket.send(message);
  }
}
