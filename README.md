# graphQL

Welcome to **graphQL** project!  <br><br>
This application allows users to explore and track their data from the gritLab database using a query language and interactive visualizations.<br><br> 
**graphQL** provides an intuitive way to navigate and analyze your academic progress, XP, and audit data, all in a sleek web dashboard.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Requirements](#requirements)
- [Learning Objectives](#learning-objectives)
- [Last Updated](#last-updated) 
- [Authors](#authors) <br><br>


[Back To The Top](#graphQL) 

## Description

**graphQL** is a web-based dashboard that connects to the gritLab API and visualizes your progress using:

- Secure authentication (login/logout)
- Dynamic data fetching with GraphQL
- Interactive SVG graphs (line, bar, pie)
- Responsive and modern user interface

This project was built to deepen understanding of GraphQL, modular JavaScript, and modern frontend best practices.

[Back To The Top](#graphQL) 

## Features

- **Authentication:** Secure login using gritLab credentials
- **User Dashboard:** View your personal info, XP, and audit stats
- **XP Progression:** Interactive line graph showing XP growth over time
- **Audit Overview:** Bar and pie charts for audit ratios and activity
- **Responsive Design:** Works on desktop and mobile
- **Modular Codebase:** Clear separation of concerns for scalability

[Back To The Top](#graphql)

## Project Structure

```bash

.
├── README.md
├── assets
│   └── circle.svg
├── css
│   ├── login.css
│   └── main.css
├── favicon.ico
├── graphFunc
│   └── createGraph.js
├── index.html
└── js
    ├── auth.js
    ├── displayData.js
    ├── fetchData.js
    └── main.js

```
[Back To The Top](#graphQL) 


## Installation

1. **Install Go if you haven't already.**
2. **Clone the repository to your local machine.**
    ```
    git clone https://01.gritlab.ax/git/jkim/graphql
    ```
3. **Navigate to the project directory in your terminal.**
    ```
    cd graphQL
    ```
4. **Start a local server** (using Python 3):
    ```
    python3 -m http.server
    ```
5. **Open your browser** and go to [http://localhost:8000](http://localhost:8000)<br><br>

[Back To The Top](#graphQL) 


## Requirements
- Python 3 (for running a local web server)
- Modern web browser (Chrome, Firefox, Edge, Safari)
- gritLab account for authentication<br><br>

[Back To The Top](#graphQL) 


## Learning Objectives
The learning objectives for the graphQL project primarily focus on the following areas: 

- **GraphQL:** Learn how to fetch and structure data with GraphQL queries.
- **Frontend Modularity:** Practice modular JavaScript for scalable web apps.
- **SVG & Data Visualization:** Build custom, interactive SVG graphs (line, bar, pie).
- **Authentication:** Implement secure login and state management.
- **Responsive Design:** Create layouts that work on all devices.
- **API Integration:** Connect a frontend app to a real-world API.
<br><br>


[Back To The Top](#graphQL) 


## Last Updated
Last updated on 2025-04-17<br>

[Back To The Top](#graphQL) 


## Authors

### [Joon Kim](https://01.gritlab.ax/git/jkim)<br><br>
[Back To The Top](#graphQL) 
