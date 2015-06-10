[![Build Status](https://travis-ci.org/lagranovskiy/timetracker-client.svg?branch=master)](https://travis-ci.org/lagranovskiy/timetracker-client)
[![Code Climate](https://codeclimate.com/github/lagranovskiy/timetracker-client/badges/gpa.svg)](https://codeclimate.com/github/lagranovskiy/timetracker-client)

#Timetracker 1.0 (client part)

Timetracker client is angularJS Client for the timetracker project.
Please refer to the [technical documentation](https://github.com/lagranovskiy/timetracker-server) from the timetracker server to get general information about architecture, infrastructure etc of the application server.

Here you can only find shot overview about used technologies and needed skills, as well es information to get client running.

## Main Features

* Authentication with User management module
* User sign in and sign up
* Dashboard with visual and textual overview and statistic on the personal system usage
* Booking Management (overview, create, update, delete)
* Project Management (overview, create, update, delete)
* Project Resource Assignment control
* Management console with textual and graphical booking stats

## Technologies and required skills

* JavaScript
* HTML, CSS
* AJAX
* WebSockets

## Core Frameworks and libs

* AngularJS
* Bootstrap
* Angular Strap
* SocketIO
* d3chart
* Utils: momentjs, underscore

## Get it run

To get the client running, please do the env installation and configuration described in server documentation.
After you are completed the installation, simply run following in your console for the client folder root. 
It will resolve env dependencies of client, js,css etc dependencies and run i mini webserver locally on the port 9000 on port stored in env variable <code>CLIENT_PORT</code>. 

<code>npm install</code>
<code>bower install</code>
<code>grunt serve</code>


