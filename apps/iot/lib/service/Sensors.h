#ifndef SENSORS_H
#define SENSORS_H

#include <ArduinoJson.h>
#include <DHT.h>
#include <map>

class Sensors {
    uint8_t dht_pin;
    uint8_t dht_type;
    uint8_t moisture_pin;
    uint8_t ph_pin;
    uint8_t npk_pin;
    // DHT dht;
    std::map<String, float> res;
public:
    Sensors(const uint8_t, const uint8_t, const uint8_t, const uint8_t, const uint8_t);
    // ~Sensors();e

    float get_humidity();
    float get_temperature();
    float get_moisture();
    float get_ph();
    void get_npk(float*);
    void read_dht(float*);
    void read();
    DynamicJsonDocument get();

};



#endif