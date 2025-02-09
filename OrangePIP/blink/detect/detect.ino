int sensorPin = A0; // select the input pin for LDR
int ledPin = 13; // select the pin for the LED
int buzzerPin = 3; // select the pin for the buzzer

int lightSensorValue = 0; // variable to store the value coming from the light sensor

void setup() {
    Serial.begin(9600); // sets serial port for communication
    pinMode(ledPin, OUTPUT); // sets the LED pin as output
    pinMode(buzzerPin, OUTPUT); // sets the buzzer pin as output
}

void loop() {
    sensorValue = analogRead(sensorPin);
    Serial.println("Sensor value: " + String(sensorValue));

    if (sensorValue > 500) { // adjust the threshold value as needed
        digitalWrite(ledPin, HIGH); // turn the LED on
        int pitch = sensorValue / 4;
        tone(buzzerPin, pitch); // play the randomized tone on the buzzer
    } else {
        digitalWrite(ledPin, LOW); // turn the LED off
        noTone(buzzerPin); // stop the tone on the buzzer
    }

    delay(100); // wait for 100 milliseconds before the next reading
}