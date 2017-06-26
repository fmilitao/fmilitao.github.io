---
layout: post
title:  "Learn Some Sheet"
project_name: learn-some-sheet
project_description: Practice reading music sheet notation.
project_tech: Built using TypeScript, d3.js, VexFlow, WebMIDI.
translate: translate(0,-5%)
---

Practice reading music sheet notation in the browser. Notes are picked randomly, although you can define the range and the number of notes per chord. As you progress, new notes are generated once you reach the end of the current "sheet". Optionally, you can also have it show helper hints for note names. At the bottom you get a few stats on your speed and error rate.

This project was built to play around with my EZ-200 keyboard, but it should work with any keyboard with USB support via the WebMIDI API. This API works on Google Chrome but other browsers may also support it. Note that standard keyboard is also supported with keys mapped to the corresponding note letter name.
