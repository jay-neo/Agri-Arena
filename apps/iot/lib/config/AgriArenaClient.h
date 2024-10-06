#ifndef AGRIARENACLIENT_H
#define AGRIARENACLIENT_H

#include <ArduinoJson.h>
#include <HTTPClient.h>

#ifdef USE_HTTPS
#include <WiFiClientSecure.h>
#else
#include <WiFi.h>
#endif

class AgriArenaClient {
#ifdef USE_HTTPS
    WiFiClientSecure client;
#else
    WiFiClient client;
#endif
    HTTPClient http;
    const char* ntpServer = "pool.ntp.org";
    // TaskHandle_t timeTaskHandle = NULL;

   public:
    AgriArenaClient(const char*);
    void config(String, const char*);
    void send(DynamicJsonDocument, const uint64_t&);
    String getTime();
    // static void timeTask(void* pvParameters);
};

#endif