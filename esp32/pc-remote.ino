#include <WiFi.h>
#include <WebServer.h>
#include <JWT.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* jwt_secret = "your_jwt_secret";

// GPIO pin for relay
const int RELAY_PIN = 5; // GPIO5 (D1)
const int LED_PIN = 2;   // Built-in LED

WebServer server(80);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Setup pins
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  
  // Connect to WiFi
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println("Failed to connect to WiFi");
  }
  
  // Setup web server routes
  server.on("/turn-on", HTTP_GET, handleTurnOn);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/health", HTTP_GET, handleHealth);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

void handleTurnOn() {
  // Verify token
  if (!server.hasArg("token")) {
    server.send(401, "application/json", "{\"error\":\"No token provided\"}");
    return;
  }
  
  String token = server.arg("token");
  if (token != jwt_secret) {
    server.send(401, "application/json", "{\"error\":\"Invalid token\"}");
    return;
  }
  
  // Trigger relay for 2 seconds
  digitalWrite(RELAY_PIN, HIGH);
  delay(2000);
  digitalWrite(RELAY_PIN, LOW);
  
  server.send(200, "application/json", "{\"success\":true,\"message\":\"PC turned on\"}");
  Serial.println("PC turned on!");
}

void handleStatus() {
  if (!server.hasArg("token")) {
    server.send(401, "application/json", "{\"error\":\"No token provided\"}");
    return;
  }
  
  String token = server.arg("token");
  if (token != jwt_secret) {
    server.send(401, "application/json", "{\"error\":\"Invalid token\"}");
    return;
  }
  
  server.send(200, "application/json", "{\"status\":\"online\"}");
}

void handleHealth() {
  server.send(200, "application/json", "{\"status\":\"ok\"}");
}