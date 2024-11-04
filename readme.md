
[![mag-read](banner.svg)](https://mag-read.com/)

mag-read is currently under construction. It allows for secure reading of PDFs by splitting each page into small, randomly sized parts. Additionally, it secures the display of these parts based on the domain where they are embedded.
## 📋 Prerequisites

Before you begin, ensure you have Docker and Docker Compose installed on your machine.

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (required for development tasks like using `nodemon`)

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

- **/back**: Contains the Node.js backend application with Express, handling routes, authentication, and document management.
- **/rust**: Rust project for image compression and conversion. Produces a binary that runs in the `optimizer` service.
- **/docker**: Docker and Docker Compose files to orchestrate the various services.
- **/docker/build-local.sh**: Script for local Docker builds.
- **/embedded**: Directory for embedded resources and assets used by the application.

## 📁 Shared Volumes

The project uses shared volumes to connect the Rust binary from the `core` and `optimizer` service with the Node.js backend, allowing seamless integration without manual copying.

## 🐳 Docker Image Management

The services are based on the following Docker images, available under the `tobaz92/magread` repository:

- **back**: Node.js application for API and business logic management.
- **reader**: Module for document reading and display.
- **core**: Central component for document management. It extracts and splits the document into smaller parts and creates a JSON that allows the document to be reconstructed.
- **optimizer**: Service for image compression and conversion in Rust. This service runs in the background to avoid disrupting the user experience. It compresses visuals and creates image files in the WebP format.

### Building

To build the images locally, use the following script from the `docker` directory:

```bash
./build-local.sh
```

## ⚙️ Development Configuration

For continuous development, use `nodemon` to automatically reload the Node.js application:

```bash
npm install -g nodemon
nodemon
```

## 📚 API Documentation

Here is an overview of the main routes available in the application:

| Method | Route                   | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/sign-up`              | Register a new user          |
| POST   | `/login`                | User login                   |
| GET    | `/me`                   | Get user profile information |
| POST   | `/document/upload`      | Upload documents             |
| GET    | `/document/view/:token` | View a document by token     |
| DELETE | `/document/:token`      | Delete a document            |

## 🔑 Token Generation and Domain Blocking

The application generates tokens for secure document access. Tokens are used to view and manage documents without exposing direct URLs. Additionally, domain-based blocking is implemented to restrict access to specific domains, enhancing security and control over document distribution.

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
