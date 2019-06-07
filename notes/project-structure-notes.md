# Project Structure
### Problem
This is my first using socket.io. The tutorial and SO snippets only teaches me how to utilize its features.
There is not really any good public examples on the best practices of writing a socket project.
### Solution
I will study and try my best to understand the structure and thought put into building a more advanced project.
Blindly copying principles will not help me in the long run. I plan on separating perceivied methods of structure
into chunks, so I can easily apply them to my other projects. The project I am going to learn from is [obsidio](https://github.com/penumbragames/obsidio).

*Update:*
I found out that the creators work on a multitude of similar multiplayer web games. Their latest edition is [browsercraft](https://github.com/penumbragames/browsercraft)
which utilizes session storage and MongoDB to user credentials. I will not be doing user auth, but I do intend on studying
browsercraft's structure.

# Chunks
<!-- TODO rewrite this for browsercraft -->
### Node Modules/Dependencies
The team didn't use very much dependencies. They kept it clean and simple. I like it.
- express as the server
- swig as the view
- socket.io
- morgan (middleware logger)

### Dev mode
There is a global flag named "dev_mode" that determines if production or development features are to be loaded or ran.

They are included in
- The view
    - If dev_mode then load static js files. Otherwise load minified js.
- Server.js
    - Checks arguments for --dev flag variations to determine dev_mode (defaults to false)
    - Passes the dev_mode flag to the view
    - Prints development mode message in server console

### Server.js
This file is clean and straightforward. The bulk of the code has been placed in a js module called Game, and it
requires that dependency in this file. I should put my chat app logic in a separate module as well.
1. Constants
    - Environment variables
    - Self created constants (DEV_MODE, CHAT_TAG, FRAME_RATE)
    - argv processing
        - --dev, -dev, --development, -development for DEV_MODE
2. Dependencies
    - Node modules
    - Self created modules (obsidio has only one called Game in /server/game)
3. Initialization
    - Initialize dependencies
    - Set express dependencies (set, use)
4. Routing
    - obsidio only has one, '/'
        - Renders index file in view directory
        - Passes in DEV_MODE
5. Server side input handlers (perhaps this can be done in a different file)
    - io.on('connection', ...)
        - socket.on('new-player', ...)
        - socket.on('player-action', ...)
        - socket.on('chat-client-to-server', ...)
        - socket.on('disconnect', ...)
6. Server side game loop
    - setInterval of the game object's methods update and sendState. FRAME_RATE as the interval
7. Begin listening express server

### Documentation
Everything is well organized so documentation is helpful and not overbearing

### Open Source
They provided a script to find TODOs so other people can work on the project.
Only thing they ask of is follow coding conventions, and to document any code written.

### Static, Shared, and Server directories
The static directory contains files to be run on the client. It is static on express

The server directory contains files to be run on the server

The shared directory contains files that may be run on both the client and the server. It is static on express
