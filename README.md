# Full-Stack Book Library App 📚

Welcome to the Full-Stack Book Library App! This app allows users to manage books, track personal learnings, and manage their profiles with features like authentication, password recovery, and favorites management.  

## Features ✨

- **User Authentication**: Allows users to register, login, and logout.
- **Forget Password**: Users can reset their passwords.
- **Create User**: Option to create a new user profile.
- **Manage Users**: Admin can manage users (update, delete).
- **Add Books to Favorites**: Users can mark books as favorites.
- **Add Learnings to Books**: Users can add their learnings or notes to a specific book.
- **Admin Panel**: Admin can manage books and users through a simple interface.

---

## Technology Stack ⚙️

- **Frontend:** Expo, Axios
- **Backend:** Node.js with Express
- **Database:** Sqlite3

---

## Prerequisites ✅

Ensure you have the following installed:

1. Node.js (v16 or above)
2. npm or yarn
3. Sqlite3 (running locally)
4. Expo CLI (for running the React Native app)

---

## Installation and Setup 🚀

1. Clone the Repository  
```bash
git clone https://github.com/your-username/book-library-app.git
```
2. Install Dependencies

### Backend 
- Navigate to the server directory from the root directory:

```bash
cd backend
npm install
```

### Frontend 
- Navigate to the client directory from the root directory:

```bash
cd frontend
npm install
```
3. Start the Backend Server:
NOTE: assuming you are in backend folder
```bash
npm start
```

4. Start the React-Native Frontend
NOTE: assuming you are in frontend folder
```bash
npm run dev
```
Start the app on your emulator or connected mobile device using Expo.

## Usage 🛠️
- Register a new user.
- Login with valid credentials.
- Explore the list of popular books.
- Add books to your favorites.
- Add notes or learnings to books from your favorites list.
- Update your profile and manage your user account.


## API Endpoints
Here’s a comprehensive list of the core API endpoints for interacting with the app:

### **Authentication APIs**
1. **POST `/register`**
   - **Description**: Register a new user.
   - **Request Body**:
     ```json
     {
       "name": "Nevil Patel",
       "email": "nevilpatel@gmail.com",
       "password": "Nev@123"
     }
     ```
   - **Response**: Returns a success message and a token.

2. **POST `/login`**
   - **Description**: Authenticate the user and return a JWT token.
   - **Request Body**:
     ```json
     {
      "email": "nevilpatel@gmail.com",
       "password": "Nev@123"
     }
     ```
   - **Response**: Returns a JWT token if authentication is successful.

3. **POST `/forgot-password`**
   - **Description**: Allows users to request a password reset.
   - **Request Body**:
     ```json
     {
       "email": "nevilpatel@gmail.com"
      }
     ```
   - **Response**: Sends an email with reset instructions.

### **User APIs**
1. **GET `/user/:id`**
   - **Description**: Retrieve a user's profile.
   - **Response**: Returns the user's profile data (name, email, favorites, etc.).

2. **PUT `/user/:id`**
   - **Description**: Update a user's profile (e.g., change email, name).
   - **Request Body**:
     ```json
     {
       "name": "Nevil Patel",
       "email": "nevilpatel@gmail.com",
     }
     ```
   - **Response**: Returns the updated user profile data.

3. **DELETE `/user/:id`**
   - **Description**: Delete a user's account (for admins).
   - **Response**: Returns a success message.

### **Book APIs**
1. **GET `/books`**
   - **Description**: Retrieve a list of all books.
   - **Response**: List of books available in the system.

2. **POST `/books`**
   - **Description**: Add a new book to the library.
   - **Request Body**:
     ```json
     {
       "title": "Book Title",
       "author": "Author Name",
       "description": "Book Description"
     }
     ```
   - **Response**: Confirmation message for book addition.

3. **GET `/books/:id`**
   - **Description**: Get detailed information for a specific book.
   - **Response**: Detailed data for the specified book.

4. **PUT `/books/:id`**
   - **Description**: Update details of a particular book (for admins).
   - **Request Body**:
     ```json
     {
       "title": "Updated Book Title",
       "author": "Updated Author",
       "description": "Updated Description"
     }
     ```
   - **Response**: Updated book details.

5. **DELETE `/books/:id`**
   - **Description**: Delete a book from the library.
   - **Response**: Confirmation message for book deletion.

### **Favorites APIs**
1. **POST `/books/:id/favorite`**
   - **Description**: Add a book to the user's favorites list.
   - **Response**: Returns a success message.

2. **DELETE `/books/:id/favorite`**
   - **Description**: Remove a book from the user's favorites list.
   - **Response**: Returns a success message.

### **Learning Note APIs**
1. **POST `/books/:id/learning`**
   - **Description**: Add learning notes for a book.
   - **Request Body**:
     ```json
     {
       "note": "This is my learning note about the book."
     }
     ```
   - **Response**: Confirmation message that the note was saved.

2. **GET `/books/:id/learning`**
   - **Description**: Retrieve learning notes for a specific book.
   - **Response**: List of notes related to the book.

## Testing
- Use tools like Postman to manually test API endpoints, or use built-in frontend components to test the app.