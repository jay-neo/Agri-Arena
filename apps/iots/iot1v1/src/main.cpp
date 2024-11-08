#include "config.hpp"

#ifdef USE_HTTPS
#include <WiFiClientSecure.h>
WiFiClientSecure client;
#else
#include <WiFi.h>
WiFiClient client;
#endif

HTTPClient http;
WifiConfiguration wifi(WIFI_SSID, WIFI_PASSWORD);

std::map<String, float> res;
uint64_t deviceId = ESP.getEfuseMac();

bool readingInProgress = false;

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////  AGRI ARENA IoT-1 ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

#if defined(OLED_WIDTH) && defined(OLED_HEIGHT) && defined(OLED_RESET)
#define OLED_DISPLAY 1
TwoWire I2C_OLED = TwoWire(0);
Adafruit_SSD1306 display(OLED_WIDTH, OLED_HEIGHT, &I2C_OLED, OLED_RESET);
#endif

#if defined(DHT_PIN) && defined(DHT_TYPE)
#define DHT_SENSOR 1
DHT dht(DHT_PIN, DHT_TYPE);
#endif

#if defined(MOISTURE_PIN) && defined(MOISTURE_UPPER_LIMIT) && defined(MOISTURE_LOWER_LIMIT)
#define MOISTURE_SENSOR 1
#endif

#if defined(NPK_RX) && defined(NPK_TX) && defined(NPK_RE) && defined(NPK_DE) && defined(NPK_BAUD_RATE)
#define NPK_SENSOR 1
SoftwareSerial npk(NPK_RX, NPK_TX);
#endif

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////  AGRI ARENA IoT-1 ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

void print_message(String msg) {
    Serial.println(msg);
#if defined(OLED_DISPLAY)
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(1, 0);
    display.println(msg);
    display.display();
#endif
}
void print_error(String msg) {
    Serial.println(msg);
#if defined(OLED_DISPLAY)
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(1, 0);
    display.println(msg);
    display.display();
#endif
}
void read_dht() {
#if defined(DHT_SENSOR)
    float H = 0, T = 0;
    uint8_t r = 0;
    H = dht.readHumidity();
    while(isnan(H) && r < 10) {
        H = dht.readHumidity();
        ++r;
        delay(1000);
    }
    if(isnan(H) && r >= 10) {
        print_error("ERROR: Humidity Reading");
    } else {
        res["humidity"] = H;
    }

    r = 0;
    T = dht.readTemperature();
    while(isnan(T) && r < 10) {
        T = dht.readTemperature();
        ++r;
        delay(1000);
    }
    if(isnan(T) && r >= 10) {
        print_error("ERROR: Temperature Reading");
    } else {
        res["temperature"] = T;
    }

    delay(1000);
#endif
}
void read_moisture() {
#if defined(MOISTURE_PIN) && defined(MOISTURE_UPPER_LIMIT) && defined(MOISTURE_LOWER_LIMIT)
    int soilMoistureValue = analogRead(MOISTURE_PIN);
    uint8_t r = 0;
    while(isnan(soilMoistureValue) && r < 10) {
        soilMoistureValue = analogRead(MOISTURE_PIN);
        ++r;
        delay(1000);
    }

    if(isnan(soilMoistureValue) && r >= 10) {
        print_error("ERROR: Moisture Reading");
    }

    float soilMoisture = map(soilMoistureValue, MOISTURE_LOWER_LIMIT, MOISTURE_UPPER_LIMIT, 0, 100);
    res["moisture"] = constrain(soilMoisture, 0, 100);

    delay(1000);
#endif
}
void read_ph() {
#if defined(PH_PIN)
    float ph = 0;
    uint8_t s = 0, r = 0;
    while(r < 5) {
        ph += analogRead(PH_PIN);
        if(!isnan(ph)) {
            ++s;
        }
        ++r;
        delay(1000);
    }
    if(isnan(ph) && r >= 10) {
        print_error("ERROR: PH Reading");
    } else if(s > 0) {
        ph = (ph * 0.003844) / (s * 1.0) - 1.63;
        // ph = ((7 - ((ph * 3.3 / 4095.0) - 2.5) / 0.17) * 0.795) - 1.63;
        if(ph > 0 && ph < 14) {
            res["ph"] = ph;
        }
    }

    delay(1000);
#endif
}
void read_npk() {
#if defined(NPK_SENSOR)
    float N = 0, P = 0, K = 0;
    uint8_t r = 0, s = 0;
    uint8_t values[11];

    digitalWrite(NPK_DE, HIGH);
    digitalWrite(NPK_RE, HIGH);
    delay(10);

    while(s == 0 && r < 5 && (npk.write(NPK_CODE, sizeof(NPK_CODE)) == 8)) {
        digitalWrite(NPK_DE, LOW);
        digitalWrite(NPK_RE, LOW);
        delay(100);

        if(npk.available() >= 11) {
            for(int i = 0; i < 11; i++) {
                values[i] = npk.read();
            }
            N = (values[3] << 8) | values[4];
            P = (values[5] << 8) | values[6];
            K = (values[7] << 8) | values[8];
            s = 1;
        } else {
            r++;
        }
    }
    if(s == 0 && r >= 5) {
        print_error("ERROR: NPK Reading");
    } else if(isnan(N) && isnan(P) && isnan(K)) {
        print_error("ERROR: No NPK values");
    } else {
        res["nitrogen"] = N, res["phosphorus"] = P, res["potassium"] = K;
    }

    delay(1000);
#endif
}
void agri_arena_iot() {
    res.clear();
    read_dht();
    read_moisture();
    read_ph();
    read_npk();

    DynamicJsonDocument data(JSON_OBJECT_SIZE(res.size() + 2));
    for(const auto& kv : res) {
        data[kv.first.c_str()] = kv.second;
    }
    data["device"] = deviceId;

    String jsonString;
    serializeJson(data, jsonString);

    Serial.println(jsonString);
    print_message("Sending...");

    int httpResponseCode = http.POST(jsonString);
    if(httpResponseCode > 0) {
        print_message("Successfully send");
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
    } else {
        print_error("ERROR: Sending data!");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////  AGRI ARENA IoT-1 ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

void setup() {
    Serial.begin(115200);
    Serial.println("Starting...");

    if(!wifi.config()) {
        print_error("ERROR: Wifi not configured successfully");
        // esp_deep_sleep_start();
    }

#ifdef USE_HTTPS
    client.setCACert(TLS_CERTIFICATE);
#endif
    client.setTimeout(10000);

    if(!http.begin(client, ENDPOINT)) {
        print_error("ERROR: Server not connected successfully");
        // esp_deep_sleep_start();
    }
    http.addHeader("Content-Type", "application/json");

#if defined(SWITCH)
    pinMode(SWITCH, INPUT);
#endif

#if defined(OLED_DISPLAY)
    I2C_OLED.begin(OLED_SDA, OLED_SCL);
    if(!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
        Serial.println(F("SSD1306 allocation failed"));
    } else {
        delay(2000);

        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);

        display.setTextSize(2);
        display.setCursor(0, 0);
        display.println("AGRI ARENA");
        display.display();
        delay(5000);
    }
#endif
    print_message("Intializing...");

#if defined(DHT_SENSOR)
    dht.begin();
    delay(2000);
#endif

#if defined(MOISTURE_SENSOR)
    pinMode(MOISTURE_PIN, INPUT);
    delay(2000);
#endif

#if defined(NPK_SENSOR)
    npk.begin(NPK_BAUD_RATE);
    pinMode(NPK_RE, OUTPUT);
    pinMode(NPK_DE, OUTPUT);
    delay(2000);
#endif

    for(int8_t i = 0; i < 5; ++i) {
        read_dht();
        delay(1000);
        read_moisture();
        delay(1000);
        read_npk();
        delay(1000);
        read_ph();
        delay(1000);
    }
    delay(1000);
    print_message("Ready!");
}

void loop() {
#if defined(SWITCH)
    if(digitalRead(SWITCH) == HIGH && !readingInProgress) {
        readingInProgress = true;
        if(wifi.isAlive()) {
            print_message("Reading...");
            agri_arena_iot();
        } else {
            print_error("ERROR: Wifi disconnectd");
            if(!wifi.connect()) {
                Serial.println("ERROR: Failed to connect to WiFi");
            }
        }
        readingInProgress = false;
    }
#else
    if(wifi.isAlive()) {
        print_message("Reading...");
        agri_arena_iot();
    } else {
        print_error("ERROR: Wifi disconnectd");
        if(!wifi.connect()) {
            Serial.println("ERROR: Failed to connect to WiFi");
        }
    }
#endif

    delay(2000);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  AGRI ARENA  ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
