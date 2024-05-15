

# Mrsambosk Chat App

Mrsambosk is a real-time chat application built with FastAPI and React. It supports single-room chat functionality, allows users to see who is online, send messages, and delete messages using both WebSocket and HTTP protocols.

## Getting Started

These instructions will guide you on setting up the project locally to run the server part of the chat application.

### Prerequisites

Before starting, make sure you have the following installed:
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/RazyKherEdin1/Chatapp.git
   ```

2. Navigate to the server directory of the project:
   ```
   cd Mrsambosk
   ```

3. Install the required Python dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Server

To start the FastAPI server, execute the following command:
```
uvicorn app:app --reload
```
This will start the server on `http://127.0.0.1:8000`. The `--reload` flag allows the server to automatically reload upon any code changes.

## Project Structure

- `app.py`: Initializes the FastAPI application and includes the WebSocket endpoint.
- `urls.py`: Defines URL routes for the application.
- `views.py`: Handles requests and WebSocket connections.
- `models.py`: Contains SQLAlchemy models for user and message data.
- `consumer.py`: Manages WebSocket messages and interactions.
- `tests.py`: Includes tests for API endpoints and WebSocket.
- `database.py`: Configures connections and sessions to the database.
- `middleware.py`: Implements middleware for request processing.

## Features

- **Single Chat Room**: Allows all connected users to communicate in a single room.
- **User Presence**: Displays which users are currently online.
- **Message Sending**: Users can send and receive messages in real-time.
- **Message Deletion**: Users have the ability to delete their messages.

## Testing

Run the following command to execute tests:
```
pytest
```

## Built With

* [FastAPI](https://fastapi.tiangolo.com/) - The web framework used for the backend.
* [React](https://reactjs.org/) - Frontend library used for building the user interface.
* [Socket.IO](https://socket.io/) - Enables real-time, bidirectional and event-based communication.




## Future Additions: 
- **Private Rooms Chat**:
This document outlines how to potentially add private rooms functionality to the Mrsambosk chat application.
- **Adding Media to Chat and Cloud Storage**:
This section explores how to incorporate media sharing and cloud storage functionality into the Mrsambosk chat application.
- **User Authentication and Authorization**
- User Registration and Login: Implement user registration, login, and authentication using OAuth2 or JWT.
- Role-Based Access Control: Define user roles (admin, moderator, regular user) and permissions for different actions.
- **Notifications**
- Push Notifications: Send real-time notifications for new messages, mentions, or specific events.
- Email Notifications: Notify users via email for specific events or messages when they are offline.
- **Security Enhancements**
Data Privacy: Ensure compliance with data protection regulations like GDPR.
- **Performance and Scalability**
Load Balancing,Database Optimization and Scalable WebSocket Handling.

## Challenges:
* Integrating file upload functionality into the frontend.
* Uploading media files to a cloud storage service.
* Storing references or URLs to uploaded media in the database.
* Implementing a mechanism for creating and managing private rooms.
* User invitations and access control for private rooms..
* Maintaining real-time communication within specific rooms.



```
