Cloud-Based EV Charging Management System

A distributed, microservices-based backend system built in Python for real-time electric vehicle (EV) charging station coordination, transaction processing, and scalable deployment.

 Overview

This project implements a backend solution designed to manage and coordinate an ecosystem of EV charging stations. By leveraging a distributed microservices architecture, the system separates core business domains to ensure reliability, high availability, and seamless data consistency.

Key Features

* Distributed Microservices: Architecture built entirely in Python, decoupling core domains like user management, charging point telemetry, and station coordination.
* RESTful API Ecosystem: Robust API endpoints designed for real-time interaction, data exchange, and communication with external interfaces or IoT hardware.
* Reliable Data Persistence: Backed by a PostgreSQL database layer ensuring strict data consistency, secure transactional states, and reliable system operations.
* Modular Workflows: Structured backend layers and components designed for simple scalability and modern deployment environments.

 System Architecture

The repository is structured around core backend services:

1. Station Management Service: Coordinates real-time charging point status, availability updates, and connectivity.
2. User Service: Manages user authentication, driver profiles, and access control.
3. Transaction/Billing Service: Handles real-time coordination of charging sessions, tracking duration, and processing transaction data.



Technology Breakdown
* Frontend Ecosystem (56.7%): JavaScript, HTML5, CSS3 (Built for user interfaces and live telemetry dashboards)
* Backend Core (20.4%): Python 3.x (Powering the microservices, business logic, and API routes)
* Database Layer: PostgreSQL (Relational management ensuring ACID compliance and transaction safety)
* DevOps & Infrastructure (6.3%): Docker / Dockerfile (Containerization for seamless, environment-agnostic deployment)
