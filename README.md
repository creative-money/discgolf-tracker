# Open Source Discgolf Tracker
## creative.money: Open Source Discgolf Tracker

Welcome to the Open Source Discgolf Tracker.
This Instruction will focus first on players, then on development.

### About the Software (For Players):
An easy to use digital scoresheet. One player creates a game and other players join it, most easily, by scanning the other player's QR Code.
Then, a scoresheet will be visible where the scores can be updated on every device. When one player updates the data, it is transmitted in realtime to the other players. <br>
If you just want to play a game of discgolf with your friends, go to https://discgolf-tracker.com where this software is hosted.

--- 

### About the Software (For Programmers):
* Frontend: Vue3
* Backend: Node.js
    - Express JS (Rest API Architecture)
    - Prisma (Object Relational Mapper) - used for Database Stuff
    - Websockets for realtime communication

### You want to contribute?
Feel free to open an issue, download the code and improve on it.
Im sure you want to know how to set everything up? Let me help you.

#### <b>How to set up the Backend </b>:
There are a few things needed to get the backend running.
First of all, let's start with the .env file.
Have a look at the file called <b>./backend/.env.example</b>. 
You need to copy it inside a file called <b>./backend/.env</b> and change the variable's values according to your needs. The first one is a database_url which prisma needs to be able to connect to the database.<br>
Once that's set up, you need to initialize the database. For initializing the database, you are going to need Prisma running on your PC. Go in the backend directory and run the following command:  
```
npm i
```
That should install all the dependencies. After that's done, just run:

```
npx prisma db push
```
This will create all the tables needed inside the database. This means, that now everything is set up and you can run

```
npm run start 
```
or
``` 
npm run mon
```
if you'd prefer your server to auto-restart when you change something in the source code.
Assuming you are familiar with Express.JS, please just have a look in the code for everything else.

#### <b>How to set up the Frontend </b>:
The Frontend uses vue and should be a bit easier to set up. Go inside the frontend directory (inside a terminal, of course) and run:
``` 
npm i
```
to install the dependencies, followed by:

``` 
npm run serve
```
to serve the files on port 8080. <br>
Now it's running, <b>BUT</b> it's <b>NOT YET WORKING</b>. You will need to change the environment file aswell. But I wanted to spice the tutorial up a little bit so please now copy the file <b>./frontend/.env.example</b> to <b>./frontend/.env.local</b>. It only contains the backend domain currently, so usually you would not have to change anything, but when you change the .env variables you need to restart your server, so stop your server and run

``` 
npm run serve
```

again, now it's really working. <br>
If you want to access the discgolf tracker outside your PC, change the Domain to your LAN's IP (run ifconfig or ipconfig to find out) and then it'll be availble inside your LAN. <br>
To host inside your WAN you do more or less the same thing but with your router's IP Adress. Don't forget to open port 8080 and 3000 or whichever ports you want to use for communication. <br>

--- 

### Contributors:
* Luca Caspari (Creator)
* Lukas Arnold (Maintainer)


--- 
#### Support this Project:
If you want to support this project financially, please go to https://www.paypal.com/donate/?hosted_button_id=JRNQW2A8WWYJN and if you want to stay up to date with the team behind this project, come back to this page and go to https://blog.creative.money, where we will also make sure to keep you up to date with our most beloved projects.