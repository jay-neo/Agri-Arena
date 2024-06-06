#include <ArduinoJson.h>
#include <Arduino.h>
#include "Sensors.h"
#include <DHT.h>

Sensors::Sensors(const uint8_t _dht_pin, const uint8_t _dht_type, const uint8_t _moisture_pin, const uint8_t _ph_pin, uint8_t _npk_pin)
    : dht_pin(_dht_pin), dht_type(_dht_pin), moisture_pin(_moisture_pin), ph_pin(_ph_pin), npk_pin(_npk_pin) {
        // if (_dht_pin != 0) {
        //     dht(dht_pin, dht_type);
        //     dht.begin();
        // }
        if(_moisture_pin != 0) {
            pinMode(_moisture_pin, INPUT);
        }
        if (_ph_pin != 0 ) {
            pinMode(_ph_pin, INPUT);
        }
        if (_npk_pin != 0) {
            pinMode(_npk_pin, INPUT);
        }
    }

// Sensors::~Sensors() {}

// float Sensors::get_humidity() {
//     float humidity = dht.readHumidity();
//     if (isnan(humidity)) {
//         Serial.println("Failed to read from DHT Sensor: Humidity");
//     }
//     return humidity;
// }

// float Sensors::get_temperature() {
//     float temperature = dht.readTemperature();
//      if (isnan(temperature)) {
//         Serial.println("Failed to read from DHT Sensor: Temperature");
//     }
//     return temperature;
// }


void Sensors::read_dht(float res[]) {
    DHT dht(dht_pin, dht_type);
    dht.begin();
    res[0] = dht.readHumidity();
    res[1] = dht.readTemperature();
}


float Sensors::get_moisture() {
    int soilMoistureValue = analogRead(moisture_pin);
    float moisture = (100 - ((soilMoistureValue / 4095.00) * 100));
    // float moisture =  map(soilMoistureValue, 0, 4095, 0, 100);;
    return moisture;
}


float Sensors::get_ph() {
    
}

void Sensors::get_npk(float res[]) {

}

void Sensors::read() {
    if (dht_pin != 0) {
        // res["humidity"] = get_humidity();
        // res["temperature"] = get_temperature();
        float dht[2];
        read_dht(dht);
        res["humidity"] = dht[0];
        res["temperature"] = dht[1];
    }
    if (moisture_pin != 0) {
        res["moisture"] = get_moisture();
    }
    if (ph_pin != 0) {
        res["ph"] = get_ph();
    }
    if (npk_pin != 0) {
        float npk[3];
        res["nitrogen"] = npk[0];
        res["phosphorus"] = npk[1];
        res["potassium"] = npk[2];
    }
}

DynamicJsonDocument Sensors::get() {
    DynamicJsonDocument doc(JSON_OBJECT_SIZE(res.size() + 4));
    for (const auto &kv : res) {
        doc[kv.first.c_str()] = kv.second;
    }
    return doc;
}