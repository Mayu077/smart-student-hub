# Firebase Setup for Smart Student Hub

This document outlines the Firebase credentials and configuration needed for the Smart Student Hub dual database functionality.

## Required Firebase Credentials

The following environment variables need to be set in your Replit Secrets or .env file:

### Required Firebase Configuration
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-web-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_APP_ID=your-app-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com (optional)
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id (optional)
```

### Optional Firebase Service Account (for server operations)
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

### Storage Backend Selection
```
STORAGE_BACKEND=firebase          # For Firebase only
STORAGE_BACKEND=mongo            # For MongoDB only  
STORAGE_BACKEND=dual             # For dual storage (both databases)
STORAGE_BACKEND=memory           # For memory storage (default)
```

## Dual Storage Configuration

When using `STORAGE_BACKEND=dual`, additional configuration options:

```
DUAL_PRIMARY_STORAGE=mongo          # Options: "mongo" or "firebase"
DUAL_ENABLE_SYNC=true               # Enable automatic sync between databases
DUAL_FALLBACK_ON_ERROR=true         # Fallback to secondary storage on error
DUAL_SYNC_DIRECTION=bidirectional   # Options: "bidirectional", "mongo-to-firebase", "firebase-to-mongo"
```

## Firebase Project Setup Steps

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Firestore Database

2. **Get Web Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on Web app or add new web app
   - Copy the configuration values

3. **Enable Firestore**
   - Go to Firestore Database
   - Create database in production mode
   - Choose your preferred region

4. **Required Firestore Indexes**
   The Firebase storage implementation requires these composite indexes:
   
   **Collection: tasks**
   - Index: userId (Ascending), completed (Ascending), dueDate (Ascending)
   
   **Collection: study_hours**
   - Index: userId (Ascending), date (Ascending)
   
   **Collection: courses**
   - Index: userId (Ascending), isActive (Ascending), createdAt (Descending)
   
   Note: Firebase will automatically prompt to create these indexes when queries are first executed.

5. **Service Account (Optional)**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON file and set as FIREBASE_SERVICE_ACCOUNT_KEY

## MongoDB Configuration (for dual storage)

When using dual storage, you also need MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/smart_student_hub
DB_NAME=smart_student_hub
```

## Security Rules (Firestore)

Example Firestore security rules for the application:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /activities/{activityId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /courses/{courseId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /portfolios/{portfolioId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /study_hours/{studyHoursId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Testing the Setup

1. Set the required environment variables in Replit Secrets
2. Restart the application
3. Check logs for successful Firebase initialization
4. Test API endpoints to ensure data persistence works

## Current Implementation Features

- **Dual Storage**: Supports primary/secondary storage with automatic fallback
- **Data Synchronization**: Bidirectional sync between MongoDB and Firebase
- **Error Handling**: Graceful fallback when primary storage fails
- **Type Safety**: Full TypeScript support across all storage backends
- **Index Management**: Automatic index creation prompts for Firebase
- **Memory Storage**: Default fallback for development and testing

## Troubleshooting

### Common Issues:

1. **Missing Index Error**: Follow Firebase Console links to create required indexes
2. **Authentication Failed**: Check service account key format and permissions
3. **Connection Timeout**: Verify network connectivity and Firebase project status
4. **Sync Conflicts**: Review dual storage configuration and sync direction settings