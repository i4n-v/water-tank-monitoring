#include <WiFiEspClient.h>
#include <WiFiEsp.h>
#include <WiFiEspUdp.h>
#include <PubSubClient.h>
#include "SoftwareSerial.h"
#include "Ultrasonic.h"

#define SEND_TOPIC "receive-data-on-server"

HC_SR04 ultrasonic(12,13);
#define WATER_TANK_HEIGHT "200"
#define WATER_TANK_WIDTH "250"

SoftwareSerial esp8266(2, 3);
WiFiEspClient espClient;

#define WIFI_AP "mosquitto"
#define WIFI_PASSWORD "123456789"

int status = WL_IDLE_STATUS;
unsigned long last_message;

char server[] = "192.168.56.1";

PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);

  InitWiFi();

  client.setServer("test.mosquitto.org", 1883);

  last_message = 0;

  String clientName = "esp-cliente";
  Serial.print("conectando em ");
  Serial.print(server);
  Serial.print(" como ");
  Serial.println(clientName);
}

void loop() {
  status = WiFi.status();

  if (status != WL_CONNECTED) {
    while (status != WL_CONNECTED) {
      Serial.print("Try to connect to network: ");
      Serial.println(WIFI_AP);
      status = WiFi.begin(WIFI_AP, WIFI_PASSWORD);
      delay(50);
    }

    Serial.println("Connected on IP address:");
    Serial.println(WiFi.localIP());
  }

  if(!client.connected() ){
    reconnect();
  }

  client.loop();

  if (millis() - last_message > 5000) {
    getAndSetWaterRange();
    last_message = millis();
  }
}

void getAndSetWaterRange() {
  Serial.println("Searching water range");
  int range = ultrasonic.distance();
  
  Serial.print("Range: ");
  Serial.println(range);

  // Mounting payload
  String payload = "{";
  payload += "\"height\":"; 
  payload += WATER_TANK_HEIGHT;
  payload += ",";
  payload += "\"width\":"; 
  payload += WATER_TANK_WIDTH;
  payload += ",";
  payload += "\"range\":"; 
  payload += String(range);
  payload += "}";

  //send payload
  char attributes[100];
  payload.toCharArray(attributes, 100);
  client.publish(SEND_TOPIC, attributes);
  Serial.println(attributes);
}

void InitWiFi() {
  esp8266.begin(19200);
  WiFi.init(&esp8266);

  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    while (true);
  }

  Serial.println("Conectando ao AP");
  while (status != WL_CONNECTED) {
    Serial.print("Try to connect to WPA SSID: ");
    Serial.println(WIFI_AP);
    status = WiFi.begin(WIFI_AP, WIFI_PASSWORD);
    delay(500);
  }
  Serial.println("Conected on AP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while(!client.connected() ){
    Serial.print("Connecting on node \n");

    if( client.connect("client") ){
      Serial.println( "Wifi is reconnected" );
    }
  }
}
