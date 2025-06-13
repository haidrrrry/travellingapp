# MongoDB Atlas Database Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Account
- Go to: https://www.mongodb.com/atlas
- Click "Try Free"
- Sign up with Google/GitHub/Email

### 2. Create Cluster
- Choose "M0 Sandbox" (FREE)
- Select cloud provider (AWS/Google/Azure)
- Choose region (closest to users)
- Name: `traveling-app-cluster`
- Click "Create"

### 3. Database User
- Go to "Database Access"
- Click "Add New Database User"
- Username: `traveling-app-user`
- Password: Generate strong password
- Privileges: "Read and write to any database"
- Click "Add User"

### 4. Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Go to "Database" → "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your password
- Add `/traveling-app` before `?retryWrites`

### 6. Add to Render
- Go to Render dashboard
- Select your backend service
- Go to "Environment" tab
- Add variable:
  - Key: `MONGODB_URI`
  - Value: Your connection string

## 🔗 Your Connection String Format
```
mongodb+srv://traveling-app-user:your-password@cluster0.xxxxx.mongodb.net/traveling-app?retryWrites=true&w=majority
```

## 📊 Free Tier Limits
- Storage: 512MB
- Connections: 500
- Perfect for traveling app!

## 🧪 Test Connection
After setup, your backend will automatically connect when deployed on Render. 