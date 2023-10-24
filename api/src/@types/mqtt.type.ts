interface IMqttReceivePayload {
  height: number;
  width: number;
  range: number;
}

interface IMqttSendPayload {
  total_volume: number;
  current_volume: number;
  percentage: number;
}

export { IMqttReceivePayload, IMqttSendPayload };
