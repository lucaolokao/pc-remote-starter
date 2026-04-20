#include <WiFi.h>
#include <WebServer.h>
#include "config.h"

const int RELAY_PIN = 5;
const int LED_PIN = 2;
const unsigned long RELAY_DURATION_MS = 2000;

WebServer server(80);
bool relayActive = false;
unsigned long relayStartAt = 0;

void connectWiFi() {
  Serial.print("Conectando em ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi conectado! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Falha ao conectar WiFi.");
  }
}

bool isTokenValid() {
  if (!server.hasArg("token")) {
    server.send(401, "application/json", "{\"error\":\"token ausente\"}");
    return false;
  }

  if (server.arg("token") != API_TOKEN) {
    server.send(401, "application/json", "{\"error\":\"token invalido\"}");
    return false;
  }

  return true;
}

void handleTurnOn() {
  if (!isTokenValid()) {
    return;
  }

  digitalWrite(RELAY_PIN, HIGH);
  relayActive = true;
  relayStartAt = millis();

  server.send(200, "application/json", "{\"success\":true,\"message\":\"rele acionado\"}");
}

void handleStatus() {
  const String relayState = relayActive ? "on" : "off";
  const String payload = "{\"status\":\"online\",\"relay\":\"" + relayState + "\"}";
  server.send(200, "application/json", payload);
}

void handleHealth() {
  server.send(200, "application/json", "{\"status\":\"ok\"}");
}

void setup() {
  Serial.begin(115200);
  delay(400);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  connectWiFi();

  server.on("/turn-on", HTTP_GET, handleTurnOn);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/health", HTTP_GET, handleHealth);
  server.begin();

  Serial.println("Servidor HTTP iniciado na porta 80.");
}

void loop() {
  server.handleClient();

  if (relayActive && (millis() - relayStartAt >= RELAY_DURATION_MS)) {
    digitalWrite(RELAY_PIN, LOW);
    relayActive = false;
  }

  digitalWrite(LED_PIN, WiFi.status() == WL_CONNECTED ? HIGH : LOW);
}
