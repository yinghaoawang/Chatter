# Project Structure
### Problem
This is my first using socket.io. The tutorial and SO snippets only teaches me how to utilize its features.
There is not really any good public examples on the best practices of writing a socket project.
### Solution
I will study and try my best to understand the structure and thought put into building a more advanced project.
Blindly copying principles will not help me in the long run. I plan on separating perceivied methods of structure
into chunks, so I can easily apply them to my other projects. The project I am going to learn from is [obsidio](https://github.com/penumbragames/obsidio).

# Chunks
### Dev mode
There is a global flag named "dev_mode" that determines if production or development features are to be loaded or ran.

They are included in
- The view
    - If dev_mode then load static js files. Otherwise load minified js.
- Server.js
    - Checks arguments for --dev flag variations to determine dev_mode (defaults to false)
    - Passes the dev_mode flag to the view
    - Prints development mode message in server console
