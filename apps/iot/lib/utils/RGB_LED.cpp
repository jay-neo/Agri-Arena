#include <Arduino.h>

const uint8_t redChannel = 0;
const uint8_t greenChannel = 1;
const uint8_t blueChannel = 2;

void configureLED(const uint8_t LED[]) {
    const uint32_t pwmFrequency = 5000;
    const uint8_t pwmResolution = 8;

    pinMode(LED[0], OUTPUT);
    pinMode(LED[1], OUTPUT);
    pinMode(LED[2], OUTPUT);

    // Configure the PWM channels
    ledcSetup(redChannel, pwmFrequency, pwmResolution);
    ledcSetup(greenChannel, pwmFrequency, pwmResolution);
    ledcSetup(blueChannel, pwmFrequency, pwmResolution);

    // Attach the channels to the pins
    ledcAttachPin(LED[0], redChannel);
    ledcAttachPin(LED[1], greenChannel);
    ledcAttachPin(LED[2], blueChannel);
}

void setColor(const uint32_t &red, const uint32_t &green, const uint32_t &blue) {
    ledcWrite(redChannel, red);
    ledcWrite(greenChannel, green);
    ledcWrite(blueChannel, blue);
    delay(10);
}
