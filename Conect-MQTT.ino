#include <DHT.h>
#include <WiFiEspClient.h>
#include <WiFiEsp.h>
#include <WiFiEspUdp.h>
#include <PubSubClient.h>
#include "SoftwareSerial.h"
#include "ThingSpeak.h"

SoftwareSerial esp8266(2, 3);

#define DHTPIN 4
#define DHTYPE DHT11
//#define TOKEN ""

#define DEBUG true

WiFiEspClient espClient;

#define WIFI_AP "mosquitto"
#define WIFI_PASSWORD "123456789"

unsigned long thingSpeakChannel = "2316145";
const char thingSpeakAPIKey = "2TBKL6WN82QQPZV1";
String thingSpeakStatus = "";

int status = WL_IDLE_STATUS;
unsigned long last_message;

char server[] = "192.168.56.1";

DHT dht(DHTPIN, DHTYPE);

// PubSubClient client(espClient);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  dht.begin();

  InitWiFi();

  ThingSpeak.begin(espClient);

  // client.setServer("test.mosquitto.org", 1883);

  last_message = 0;

  String clientName = "esp-cliente";
  Serial.print("conectando em ");
  Serial.print(server);
  Serial.print(" como ");
  Serial.println(clientName);
}

void loop() {
  // put your main code here, to run repeatedly:
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

  // if(!client.connected() ){
  //   reconnect();
  // }

  // client.loop();

  if (millis() - last_message > 5000) {
    getAndSendTemperatureAndHumidityData();
    last_message = millis();
  }
}

void getAndSendTemperatureAndHumidityData() {
  Serial.println("Searching to informations");

  float h = dht.readHumidity();

  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("ERROR: temperature or humidity is not setled");
    return;
  }

  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" Temperature: ");
  Serial.print(t);
  Serial.println("*C ");

  // String temperature = String(t);
  // String humidity = String(h);

  // Serial.print("Temperature and Humidity: [");
  // Serial.print(temperature);
  // Serial.print(",");
  // Serial.print(humidity);
  // Serial.println("];");
  // Serial.println("------------------------------------------");

  //delay(5000);

  ThingSpeak.setField(1, t);
  ThingSpeak.setField(2, h);

  ThingSpeak.setStatus(thingSpeakStatus);

  int x = ThingSpeak.writeFields(thingSpeakChannel, thingSpeakAPIKey);

  if (x==200) {
    Serial.println("Channel update successful");
  } else {
    Serial.println("Problem update channel. HTTP error code" + String(x));
  }

  delay(15000);

  // String payload = "{";
  // payload += "\"temperature\":"; payload += temperature; payload;
  // payload += "\"humidity\":"; payload += humidity;
  // payload += "}";

  //send payload

  // char attributes[100];
  // payload.toCharArray(attributes, 100);
  // client.publish("testando", attributes);
  // Serial.println(attributes);
}

void InitWiFi() {
  esp8266.begin(19200);
  WiFi.init(&esp8266);

  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    while (true)
      ;
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

// void reconnect() {
  // while(!client.connected() ){
  //   Serial.print("Connecting on node \n");

  //   if( client.connect("client") ){
  //     Serial.println( "[cabosse]" );
  //   }
  // }
// }
