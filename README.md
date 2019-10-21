# ChatBot

*A lab report by John Q. Student*

## In this Report

To submit your lab, fork [this repository](https://github.com/FAR-Lab/IDD-Fa18-Lab6). You'll need to upload any code you change into your fork, as well as upload a video of a friend or classmate using your chatbot.

## Make the ChatBot your own

**Describe what changes you made to the baseline chatbot here. Don't forget to push your modified code to this repository.**

- Changed the chat bot to play a simple game with the user
- Refactored code to use switch-case instead of if-stacking
- used global variables to monitor player-character information
   - Damage and hitpoints are iterated in the game loop until player dies
- Added random number generator to create new background at each conversation set.
- Created a random response function for two different conversation stages
   - Random pleading statments when user says "no" to playing a game
   - Random failure statements when user does an action against dragon


## Record someone trying out your ChatBot

[Dungeon Bot in use](https://youtu.be/KKxuFxjc12Y)

---
Starter code by [David Goedicke](mailto:da.goedicke@gmail.com), closely based on work by [Nikolas Martelaro](mailto:nmartelaro@gmail.com) and [Captain Anonymous](https://codepen.io/anon/pen/PEVYXz), who forked original work by [Ian Tairea](https://codepen.io/mrtairea/pen/yJapwv).
