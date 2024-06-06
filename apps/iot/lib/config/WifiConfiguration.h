#ifndef WIFICONFIGURATION_H
#define WIFICONFIGURATION_H

#include <WiFiClient.h>

// #ifdef USE_HTTPS
// #include <WiFiClientSecure.h>
// #else
// #include <WiFi.h>
// #endif


class WifiConfiguration {
    String ssid;
    String password;
public:
    WifiConfiguration();
    WifiConfiguration(String ssid, String password);

    bool isEmpty() ;
    bool connect(const uint8_t&);
    IPAddress reconnect(const uint8_t&);
    bool config(const uint8_t&);
    bool isAlive(const uint8_t&);
    IPAddress getIP();
};

#endif