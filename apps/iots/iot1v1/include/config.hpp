#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <HTTPClient.h>
#include <SoftwareSerial.h>
#include <Wire.h>
#include <pins_arduino.h>

#include <map>

#include "WifiConfiguration.hpp"

// ---------------------------------------------------------------------------
// For General Purpose
#define SWITCH 0

// For OLED Display
#define OLED_WIDTH 0
#define OLED_HEIGHT 0
#define OLED_ADDRESS 0
#define OLED_RESET 0
#define OLED_SDA 0
#define OLED_SCL 0

// For DHT Sensor
#define DHT_PIN 0
#define DHT_TYPE 0

// For Moisture Sensor
#define MOISTURE_PIN 0
#define MOISTURE_UPPER_LIMIT 0
#define MOISTURE_LOWER_LIMIT 0

// For PH Sensor
#define PH_PIN 0

// For NPK Sensor
#define NPK_RE 0
#define NPK_DE 0
#define NPK_RX 0
#define NPK_TX 0
#define NPK_BAUD_RATE 0
const uint8_t NPK_CODE[] = {};

// For Server Endpoint
const String ENDPOINT = "";

// For ESP32 Internet Connection
const String WIFI_SSID = "";
const String WIFI_PASSWORD = "";
const char *TLS_CERTIFICATE = R"KEY(

)KEY";