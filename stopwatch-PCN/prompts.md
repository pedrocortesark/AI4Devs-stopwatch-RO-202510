# STEP 1 - Ask ChatGPT to create a well-structured prompt for this task. 

I need you to adapt all these instructions for ChatGPT, the assistant I'm using for this exercise: 

Act as a software engineer with a deep understanding of SOLID principles and good practices. Use what you’ve learned about prompt engineering to create a stopwatch and a countdown. 

Reference: https://www.online-stopwatch.com/ 

Do it using the seed index.html + script.js, this is all that I need from you, those two blocks of code plus an md to store the prompts. Store the css information in the html. You will split this task into four smaller ones: 

1. Create the landing page with two big buttons to select between stopwatch and countdown. This will be the main window when visiting the site. Check the reference main.jpg to see how stopwatch is on the left hand side and countdown on the right one. 

2. If you click on the stopwatch button, you will see a transition to the left which shows the stopwatch functionality. You have a big space for the time in the middle of the window, with a couple of buttons underneath to start and stop it. Also, in the lower part you will find a Back button to recover the main view. Check the reference stopwatch.png to achieve a similar appearance. 

3. Back in the main view, if you click on countdown you will see the same transition, but to the right this time. You will get the same element for the time, but this time you will see buttons to click the number you want to start the countdown. You will also see buttons to clear the selection and to set the time. Again, the back button is on the footer. You will find an example attached countdown.png. 

4. If you click on set, you will get the time in an hour-based format. This means, if you choose 70 minutes and click on set, the time will adapt to 01:10:00, one hour and 10 minutes. Buttons under the time are start and clear. If you click on Clear, you will get the time you set previously. There is no option to set the time again, so the only way to start again is clicking on back, and then click again on countdown. Reference countdown-start.png

A nice functionality is that the tab view in chrome is the time no matter the application you are using (stopwatch or countdown). It updates the time accordingly with the one that you see in the site, meaning that is connected somehow.

What I expect from you is a proper prompt to introduce in another chat in ChatGPT to get the closest result to the reference I'm attaching. Ask me whatever you need to prepare the best and focused prompt

# STEP 2 - Review and use the previously generated prompt to get the task done in ChatGPT

# Application Prompt for ChatGPT

You are a software engineer with a deep understanding of SOLID principles, good software-engineering practices and a strong sense of user-interface behaviour. You will write a small web application consisting of **two files**: `index.html` and `script.js`. All CSS must be included inline in the `<style>` section of `index.html` (no separate .css file). Additionally you’ll provide a Markdown file `prompts.md` that documents the prompts you used (or could use) to generate and refine this application.

The application replicates the functionality and user-interface of the reference at [online-stopwatch.com](https://www.online-stopwatch.com/) with two modes: a Stopwatch mode and a Countdown mode, with an animated slide transition between views (left/right) and with the browser tab title reflecting the current time while the timer is running.

You must split your work into four smaller tasks (modules) and clearly label each one:

## Task 1: Landing view  
- Create the landing page view (`index.html`) that shows two large buttons side by side: one for “Stopwatch” (left) and one for “Countdown” (right). The layout should roughly match the reference image (stopwatch on left side, countdown on right side).  
- Buttons should be clickable and trigger the transition to the respective mode views.  

## Task 2: Stopwatch mode  
- When the user clicks the “Stopwatch” button, there is an animated transition sliding the view left (so the stopwatch mode comes into view).  
- In stopwatch mode: show a large time display (hours:minutes:seconds:milliseconds) in the middle, two buttons underneath: “Start/Stop” toggle (or separate Start and Stop if you prefer), and a “Clear” button. At the bottom a “Back” button returns to the landing view (with animated slide back).  
- The browser tab title (`document.title`) must update to reflect the current timer value while running (e.g., “00:12:34.567 – Stopwatch”). Use appropriate JavaScript techniques (e.g., `document.title = …`).  

## Task 3: Countdown mode  
- From landing view, when clicking “Countdown”, the view animates sliding right (so countdown mode comes into view).  
- In countdown mode: show a numeric keypad (buttons 0-9) or simpler numeric entry method so the user can set the countdown time in minutes (or hours+minutes). Also “Set” and “Clear” buttons. Once the user configures time and clicks “Set”, the display changes to show the countdown in hour-minute-second format. Below the display you show “Start” and “Clear” buttons (clear resets to the pre-set time). At the bottom a “Back” button to return to the landing view.  

## Task 4: Countdown behaviour + tab-title and resetting logic  
- After “Set” in countdown mode: the timer display shows formatted time (e.g., if user entered “70” minutes it displays “01:10:00”). Then when “Start” is pressed the countdown begins, decrementing every second (and sub-milliseconds if desired). While running update the tab title (`document.title`) to the same displayed time (and optionally append “– Countdown”) so that the browser tab always shows the time.  
- If “Clear” is pressed after the timer is set but before start, the display returns to the pre-set value (so the user could either Start or go “Back” and start again). The user cannot re-enter a new time until they hit “Back” and re-enter in the numeric keypad.  
- When the countdown hits zero, stop the timer, update the display to “00:00:00.000” (or similar) and update the tab title to reflect that (e.g., “00:00:00 – Time’s up”).  

## General requirements (applies to all tasks)  
- Use clean architecture in `script.js`: separate concerns (UI handling vs timer logic), follow SOLID where applicable (e.g., Single Responsibility, Open/Closed if you expand in future).  
- The CSS must be inline in the HTML file (inside `<style>`). Layout should be responsive (at least workable on desktop). The animations should be smooth and use CSS transitions where possible.  
- Provide comments in the JS code to explain major sections (but keep them concise).  
- The `prompts.md` file should list the prompts used (or to be used) to talk to ChatGPT for each of the four tasks, plus a final summary prompt to combine them and ask for a full deliverable. The prompts should be phrased so that the assistant receiving them knows the context of this application and the four tasks (just like this prompt).  

At the end output (in the same answer) the three files:  
- `index.html`  
- `script.js`  
- `prompts.md`  

Make sure the code works when loaded (e.g., open `index.html` in a browser), with transitions and timer/tab-title updating as required.

If you need any additional details (for example colour scheme, font size, what the keypad should look like, more specificity on animation timing), ask me now.

# ANSWER 1

Perfect — I have your base index.html file and the reference screenshots.
Before I generate the final solution (index.html, script.js, and prompts.md), I’d like to clarify a few details so I can match your expectations precisely:

Design fidelity — Do you want the UI to closely match the look of online-stopwatch.com (same green/red/blue color scheme, large digital font, and full-width buttons), or should it just be inspired by it (same structure but cleaner/minimal style)?

Animation style — Should the slide transitions between views (landing ↔ stopwatch ↔ countdown) use a horizontal slide (like a carousel) or a fade + slide (slightly more modern and smooth)?

Countdown precision — Should the countdown tick every 1 second or include milliseconds (like the stopwatch)?

Tab title updates — Do you prefer a concise format (e.g., 00:03:45 – Stopwatch) or a more descriptive one (e.g., ⏱ 00:03:45 – Stopwatch running)?

Sound alert — When the countdown reaches zero, would you like a small beep sound (HTML5 audio) or just a visual change?

Once you confirm these five points, I’ll produce the three requested files in one response, ready to run locally.

# STEP 2.1 - Answering his questions to define the project

1. Exactly, make the design exactly the same as the reference
2. Define a horizontal style, like a carousel
3. Like the stopwatch, this element should be exactly the same as well. The milliseconds are just under the main element; check the reference images. There are three digits for the milliseconds.
4. I prefer a concise format. 
5. When it reaches zero, I want a small sound, yes. And for the visual reference, a blinking change between the current background and the red one provided in the reference (stopwatch-stop.png) will work