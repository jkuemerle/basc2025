# Everyone Can Play! Building Great CTFs for Non-Security Folks 

## BASC 2025 by [@jkuemerle@infosec.exchange](https://infosec.exchange/@jkuemerle) 

Materials and references for "Everyone Can Play! Building Great CTFs for Non-Security Folks" presented at BASC 2025

Hands on activites are optimized for running in Docker Compose. Local execution of utility scripts requires [Node.JS](https://nodejs.org/).

To participate in the hands on activities, clone the this repository then ```docker compose build``` to spin up all of the components locally.  

For the report building any reporting tool will work. The workshop will use [Tableau Public](https://public.tableau.com/)

## Components 

### CTFd 

Lightly customized version of [CTFd](https://github.com/CTFd/CTFd) 

### OWASP Juice Shop 

Lightly customized version of [OWASP Juice Shop](https://github.com/juice-shop/juice-shop)

### LLM CTF 

Custom LLM based CTF challenges.

### Reporting 

[Tableau Public](https://public.tableau.com/)

### Utility Scripts 

Are located in the [scripts](scripts) folder.

## Hands On Activities 

Detailed process for building and automating is covered in the [steps](steps.md) document.

## Elevation of Privilege

This repository also contains a runnable [Elevation of Privilege](https://github.com/dehydr8/elevation-of-privilege) game and an example OWASP Threat Dragon [threat model](BASCThreatDragonModel.json) at [localhost:8360](http://localhost:8360)