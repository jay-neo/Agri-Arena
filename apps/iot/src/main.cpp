#include "config.hpp"

// const char* ntpServer = "pool.ntp.org";
const uint64_t chipId = ESP.getEfuseMac();
uint8_t retries = 0;


WifiConfiguration Wifi(SSID, PASSWORD);
AgriArenaClient Client;
Sensors Sensor(DHT_PIN, DHT_TYPE, SOIL_MOISTURE_PIN, PH_PIN, NPK_PIN);


void setup() {
    Serial.begin(115200);
    // configureLED(LED);
    // pinMode(SWITCH, INPUT);

    // configTime(0, 0, ntpServer);

    Serial.println("Starting...");
    // setColor(10, 0, 0); setColor(0, 10, 0); setColor(0, 0, 10);

    if (!Wifi.config(R)) { return; }
    Client.config(ENDPOINT, TLS_CERTIFICATE);
}

bool isPressed = false;
unsigned long pressTime = 0;

void loop() {
    // if (Wifi.isAlive(R)) {
    //     if (digitalRead(SWITCH) == HIGH) {
    //         if (!isPressed) {
    //             pressTime = millis();
    //             Sensor.read();
    //             Client.send(Sensor.get(), chipId, IP);
    //         }
    //     }
    // } else if (!Wifi.isAlive(R) && retries < 2){
    //     Serial.println("WiFi Disconnected");
    //     retries++;
    //     IP = Wifi.reconnect(R);
    // }

    if(ENDPOINT == "INVALID_URL") {
        Serial.print("Endpoint = ");
        Serial.println(ENDPOINT);
    }
    
    if (!Wifi.isAlive(R)) {
        Serial.println("Wifi Disconnectd");
    }

    Sensor.read();
    Client.send(Sensor.get(), chipId);
    delay(5000);

}