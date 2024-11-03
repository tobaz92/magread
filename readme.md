# MagRead

MagRead is a document management application with features for file uploads, compression, and conversion, built with a microservices architecture in Docker. This project leverages Node.js, Express, and Rust to deliver a performant and modular solution.

## 📋 Prerequisites

Before you start, make sure you have Docker and Docker Compose installed on your machine.

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/tobaz92/mag-read.git
    cd mag-read
    ```

2. **Start the services:**
    Navigate to the Docker directory and use `docker-compose` to start all services in detached mode.
    ```bash
    cd docker
    docker-compose up -d
    ```

3. **Access the application:**
    Open your browser and go to the following URL to access the application:
    ```
    http://localhost:3000/
    ```

## 🛠 Project Structure

- **/back**: Contains the backend Node.js application with Express, handling routes, authentication, and document management.
- **/rust**: Rust project for image compression and conversion. Produces a binary that runs within the `optimizer` service.
- **/docker**: Docker and Docker Compose files for orchestrating the various services.
- **/docker/build-local.sh**: Script for local Docker builds.

## 📁 Shared Volumes

The project uses shared volumes to connect the Rust binary from the `optimizer` service with the Node.js backend, enabling seamless integration without manual copies.

## 🐳 Docker Image Management

The services are based on the following Docker images, available under the `tobaz92/magread` repository:
- **back**: Node.js application for managing the API and business logic.
- **reader**: Module for reading and displaying documents.
- **core**: Central component for document management.
- **optimizer**: Service for image compression and conversion in Rust.

### Building and Loading Images

To build images locally, use the following script from the `docker` directory:
```bash
./build-local.sh
```

## ⚙️ Development Setup

For continuous development, use `nodemon` to automatically reload the Node.js application:
```bash
npm install -g nodemon
nodemon
```

## 📚 API Documentation

Here’s an overview of the main routes available in the application:

| Method | Route                          | Description                                  |
|--------|--------------------------------|----------------------------------------------|
| POST   | `/sign-up`                     | Register a new user                          |
| POST   | `/login`                       | User login                                   |
| GET    | `/me`                          | Get user profile information                 |
| POST   | `/document/upload`             | Upload documents                             |
| GET    | `/document/view/:token`        | View document by token                       |
| DELETE | `/document/:token`             | Delete a document                            |

## 📦 Technologies Used

- **Node.js & Express** for backend management
- **Rust** for image optimization
- **Docker** for containerization and service orchestration

## 🔍 Contributing

Contributions are welcome! To contribute:

1. Fork the project.
2. Create a branch for your feature (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add my feature'`).
4. Push the branch (`git push origin feature/my-feature`).
5. Create a Pull Request.
