# Fruit Basket

##Project Description:
###Basket Catcher is a web-based interactive game that combines physical computing with digital graphics and sound. In this game, players control a character wearing a basket, attempting to catch falling fruit while avoiding bombs. The game is built using p5.js for graphics, Tone.js for music and sound effects, and an Arduino joystick and LEDs for physical interactivity.

The player moves the character left and right using a joystick connected to an Arduino, which sends analog values to the game via serial communication. When fruit is caught, the score increases and a pleasant tone plays. If a bomb is caught, the player loses one of three lives — visually represented by three LEDs on the Arduino. A custom soundtrack composed with Tone.js plays in the background to enhance the gaming experience.

The game features multiple screens: a welcome screen, a gameplay scene with a timer and score, and a game-over screen when the timer runs out or lives are lost.

This project demonstrates how physical hardware can be used to influence real-time digital experiences using modern web technologies and microcontrollers.
