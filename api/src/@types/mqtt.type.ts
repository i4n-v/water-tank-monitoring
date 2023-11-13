interface IMqttReceivePayload {
  device_id: string;
  height: number;
  width: number;
  range: number;
}

export { IMqttReceivePayload };
