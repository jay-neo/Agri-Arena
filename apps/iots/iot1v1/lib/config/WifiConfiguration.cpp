#include "WifiConfiguration.hpp"

WifiConfiguration::WifiConfiguration(const String& ssid, const String& password, const uint8_t _LED_PIN)
    : ssid(ssid), password(password), LED_PIN(_LED_PIN) {}

bool WifiConfiguration::isEmpty() { return ssid == "" || password == ""; }

bool WifiConfiguration::connect() {
    uint8_t retries = 0;
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid.c_str(), password.c_str());

    if(LED_PIN != 0) {
        pinMode(LED_PIN, OUTPUT);
        digitalWrite(LED_PIN, HIGH);
    }

    while(WiFi.status() != WL_CONNECTED && retries < 30) {
        if(LED_PIN != 0) {
            delay(100);
            digitalWrite(LED_PIN, LOW);
            delay(100);
            digitalWrite(LED_PIN, HIGH);
            delay(100);
            digitalWrite(LED_PIN, LOW);
            delay(100);
            digitalWrite(LED_PIN, HIGH);
        }
        retries++;
    }
    return WiFi.status() == WL_CONNECTED;
}

bool WifiConfiguration::reconnect() { return connect(); }

bool WifiConfiguration::config() {
    if(isEmpty()) {
        Serial.println("Wifi credential is empty");
        return false;
    }
    if(!connect()) {
        Serial.println("Failed to connect to WiFi");
        return false;
    }
    Serial.println("WiFi connected");
    return true;
}

bool WifiConfiguration::isAlive() {
    if(WiFi.status() != WL_CONNECTED) {
        if(LED_PIN != 0) {
            pinMode(LED_PIN, OUTPUT);
            digitalWrite(LED_PIN, LOW);
        }
        return false;
    }
    return true;
}
