// === Pin Definitions ===
const int joyXPin = A0;            // Joystick X-axis (analog input)
const int ledPins[] = {2, 3, 4};   // 3 LEDs for lives

int lives = 3;

void setup() {
  Serial.begin(9600);

  // Set LED pins as outputs
  for (int i = 0; i < 3; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], HIGH); // Start with all lives on
  }
}

void loop() {
  // Send joystick X position to p5.js
  int joyX = analogRead(joyXPin);
  Serial.println(joyX);
  delay(50); // Adjust to match p5.js frame rate (around 20 FPS)

  // Check for incoming serial messages
  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n');

    if (msg.startsWith("life:")) {
      int newLives = msg.substring(5).toInt();
      lives = constrain(newLives, 0, 3);
      updateLEDs();
    }
  }
}

void updateLEDs() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(ledPins[i], i < lives ? HIGH : LOW);
  }
}
