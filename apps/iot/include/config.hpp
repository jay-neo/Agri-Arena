#include "AgriArenaClient.h"
#include "WifiConfiguration.h"
#include "Sensors.h"
// #include "RGB_LED.cpp"


// 0 pin number not support for any eperiments,
// used pin number assigned accordingly, otherwise set 0, not be commented
const uint8_t SWITCH = 0;
const uint8_t DHT_PIN = 0;
const uint8_t DHT_TYPE = 0;
const uint8_t SOIL_MOISTURE_PIN = 0;
const uint8_t PH_PIN = 0;
const uint8_t NPK_PIN = 0;


const String SSID = "";
const String PASSWORD = "";
const String ENDPOINT = "";
const char *TLS_CERTIFICATE = R"KEY(

)KEY";

const uint8_t R = 15; // LED


// uint8_t LED[3] = {15, 14, 13};
