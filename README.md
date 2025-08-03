# User Management System

A full-stack web application for managing users with CRUD operations, built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- ✅ Create new users with validation
- ✅ View all users in a responsive table
- ✅ Edit existing users
- ✅ Delete users with confirmation
- ✅ Password hashing with bcrypt
- ✅ Input validation and error handling
- ✅ Responsive design
- ✅ Real-time feedback messages

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with responsive design
- **Vanilla JavaScript** - Client-side functionality

## Project Structure

```
create-users-mdb/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   └── userController.js    # User CRUD operations logic
├── models/
│   └── User.js             # User schema and validation
├── public/
│   ├── index.html          # Frontend HTML
│   ├── styles.css          # CSS styling
│   └── script.js           # Frontend JavaScript
├── routes/
│   └── users.js            # User API routes
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── server.js               # Main server file
└── README.md               # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fcortesbio/create-users-mdb.git
   cd create-users-mdb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/userdb?retryWrites=true&w=majority
   PORT=3000
   ```

4. **Start the application**

   For development (with auto-restart):
   ```bash
   npm start
   ```

   For production:
   ```bash
   npm run run
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

## API Endpoints

### Users

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/users` | Get all users | - |
| GET | `/api/users/:id` | Get user by ID | - |
| POST | `/api/users` | Create new user | `{ username, email, password }` |
| PUT | `/api/users/:id` | Update user | `{ username?, email?, password? }` |
| DELETE | `/api/users/:id` | Delete user | - |

### Request/Response Examples

#### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

## Database Schema

### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validated: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    hashed: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **Input Validation**: Server-side validation for all user inputs
- **Unique Constraints**: Username and email must be unique
- **Password Exclusion**: Passwords are never returned in API responses
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Validation**: Client-side form validation
- **Interactive UI**: Edit and delete operations with confirmation
- **Loading States**: Visual feedback during API operations
- **Error Messages**: Clear error and success notifications
- **XSS Protection**: HTML escaping for user-generated content

## Development

### Scripts

- `npm start` - Start development server with nodemon
- `npm run run` - Start production server
- `npm test` - Run tests (not implemented yet)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 3000 |

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Invalid input data
- **Duplicate Errors**: Username/email already exists
- **Not Found Errors**: User doesn't exist
- **Server Errors**: Database connection issues
- **Network Errors**: Frontend connection problems

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify network connectivity

2. **Port Already in Use**
   - Change the PORT in `.env`
   - Kill the process using the port: `lsof -ti:3000 | xargs kill`

3. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running and accessible
4. Check the network tab in browser dev tools for API errors

## Future Enhancements

- [ ] User authentication and sessions
- [ ] Role-based access control
- [ ] User profile pictures
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Search and filtering
- [ ] Pagination for large datasets
- [ ] Unit and integration tests
- [ ] API documentation with Swagger
- [ ] Docker containerization
