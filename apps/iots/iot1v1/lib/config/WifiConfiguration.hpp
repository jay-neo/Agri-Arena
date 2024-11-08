#ifndef WIFICONFIGURATION_HPP
#define WIFICONFIGURATION_HPP

// #include <WiFiClient.h>

#ifdef USE_HTTPS
#include <WiFiClientSecure.h>
#else
#include <WiFi.h>
#endif

class WifiConfiguration {
    String ssid;
    String password;
    const uint8_t LED_PIN;

   public:
    WifiConfiguration(const String &ssid, const String &password, const uint8_t _LED_PIN = 2);

    bool config();
    bool isEmpty();
    bool isAlive();
    bool connect();
    bool reconnect();
};

#endif