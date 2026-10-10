🌦️ Weather App — CI/CD Deployment on AWS EC2

A Weather App deployed on AWS EC2 using Docker and GitHub Actions. The application runs inside a Docker container, with GitHub Actions automating the deployment of an existing Docker Hub image to the EC2 instance over SSH.

🚀 Project Overview

This project demonstrates a simple CI/CD pipeline that automates application deployment using GitHub Actions, Docker Hub, and AWS EC2.

When changes are pushed to the main branch, GitHub Actions connects to the EC2 instance, pulls the latest configured Docker image, replaces the existing application container, and starts the updated container.

Architecture
Developer
    |
    | Push code to GitHub
    v
GitHub Repository
    |
    v
GitHub Actions Workflow
    |
    | SSH Authentication
    v
AWS EC2 Instance
    |
    | Pull existing image
    v
Docker Hub
    |
    | Run Docker container
    v
Weather App
    |
    v
Browser (HTTP :80)

🛠️ Technologies Used
AWS EC2 — Cloud server hosting the application
Docker — Runs the application in a container
Docker Hub — Stores the existing Docker image
GitHub Actions — Automates deployment
SSH — Secure connection between GitHub Actions and EC2
Linux / Bash — Deployment commands and server administration


🏗️ Deployment Workflow

The GitHub Actions workflow performs the following steps:

Trigger: Runs when code is pushed to main or the workflow is manually triggered.
SSH configuration: Loads the private SSH key and verified EC2 host key from GitHub Secrets.
Connection test: Verifies SSH authentication to the EC2 instance.
Image pull: Retrieves the configured Docker image from Docker Hub.
Container replacement: Stops and removes the previous weather-app container.
Port configuration: Maps EC2 port 80 to container port 3000.
Validation: Checks that the new container is running.
Note: This workflow deploys an existing Docker Hub image. It does not build or publish a new image from source code.

📁 Repository Structure
weather-app/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/                      # Application source, if included
├── public/                   # Static assets, if included
├── package.json              # If this is a Node.js app
├── Dockerfile                # If maintained in this repository
└── README.md


The structure above is illustrative. Adjust it to match your actual repository. The deployment workflow does not require a Dockerfile when it only pulls an existing image.

🧰 Troubleshooting
Problem	Possible solution
1. Permission denied (publickey). Verify the SSH key and EC2 username.
2. Host key verification failed. Check the verified EC2_KNOWN_HOSTS entry.
3. Docker socket permission denied. Run Docker commands using sudo on EC2.
4. Port 80 already allocated. Identify and safely stop the existing container or service using port 80.
5. Container exits after deployment. Inspect logs with sudo docker logs weather-app.
6. Application is unreachable. Verify the container port, application binding, and EC2 security group.

🔒 Security Considerations
Store credentials in GitHub Actions Secrets.
Restrict SSH access to trusted sources where practical.
Grant only the necessary permissions to deployment credentials.
Avoid automatically deleting unrelated containers on the EC2 instance.
Consider adding health checks and rollback logic for production deployments.

👨‍💻 Author
Jintu Das

⭐ If you find this project useful, consider giving the repository a star.
