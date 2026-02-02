# Groq AI Chatbot Integration Guide

## Overview

HealthSync now includes a beautiful AI-powered chatbot that allows healthcare professionals to ask questions about patient information, medical terms, and general health education. The chatbot is powered by Groq's llama-3.1-8b-instant model and includes strict safety constraints.

## Features

### Backend Features ✅
- **Secure Authentication**: JWT token-based authentication required
- **Patient Context**: Automatically loads patient age and diagnoses for contextual responses
- **Safety Constraints**: AI cannot diagnose, prescribe medication, or provide emergency advice
- **Error Handling**: Comprehensive error handling and timeout management
- **Rate Limiting Ready**: Comments in code suggest adding rate limiting for production

### Frontend Features ✅
- **Beautiful Modern UI**: Gradient header with glassmorphism effects
- **Smooth Animations**: Fade-in effects and smooth transitions
- **Dark Mode Support**: Full dark mode compatibility
- **Message Features**:
  - Copy-to-clipboard button on AI responses
  - Relative timestamps (e.g., "just now", "2m ago")
  - User/Assistant avatars with icons
  - Typing indicator with animated dots
- **Conversation Management**:
  - Message counter showing conversation length
  - Clear conversation button
  - Persistent disclaimer banner
- **Error Handling**: Retry mechanism for failed messages
- **Empty State**: Beautiful empty state with clear instructions
- **Character Counter**: Shows input length (1000 max)
- **Mobile Responsive**: Works on all screen sizes

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Groq API key:
   ```env
   GROQ_API_KEY=gsk_YOUR_API_KEY_HERE
   ```

4. Get your Groq API key from: https://console.groq.com

5. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

The backend will start on `http://localhost:4000`

### 2. Frontend Setup

1. Navigate to the React directory:
   ```bash
   cd react
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

3. The default configuration should work for local development:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_API_BASE_URL=/api
   ```

4. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

## API Endpoint

### POST `/api/groq/patient-chat`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "question": "What is diabetes?"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "answer": "Diabetes is a chronic condition...",
  "disclaimer": "⚠️ MEDICAL DISCLAIMER: This information is for educational purposes only..."
}
```

**Error Response (400/401/403/404/500):**
```json
{
  "error": "Error message here"
}
```

## Safety Features

The AI chatbot includes several safety constraints:

1. **Cannot Diagnose**: Refuses to diagnose medical conditions
2. **Cannot Prescribe**: Cannot prescribe medications or dosages
3. **No Emergency Advice**: Directs users to call emergency services
4. **Limited Scope**: Only provides educational information
5. **Professional Disclaimer**: Always shows medical disclaimer
6. **Access Control**: Users can only chat about patients they have access to

## UI Components

### PatientChatModal Component

Located at: `react/src/components/dashboard/PatientChatModal.tsx`

**Props:**
- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Close handler
- `patientId: string | null` - ID of the patient to chat about
- `patientName?: string` - Display name for the patient

**Key Features:**
- Gradient header with Sparkles icon
- Message bubbles with avatars
- Copy button on assistant messages
- Relative time display
- Typing indicator
- Error handling with retry
- Clear conversation button
- Character counter (1000 max)

## Integration with PatientsPage

The chat modal is integrated into the PatientsPage component and can be accessed via:

1. **"Ask AI" button** on each patient row
2. **Floating action button** at the bottom-right of the page

## Styling

The component uses:
- **Tailwind CSS** for styling
- **Lucide Icons** for UI elements
- **Radix UI** components (Button, Input)
- **Gradient backgrounds** for modern look
- **Dark mode** classes throughout

## Production Deployment

### Environment Variables

For production deployment, set these environment variables:

**Backend (Vercel/Render):**
```
GROQ_API_KEY=your_production_groq_key
JWT_SECRET=strong_random_secret
MONGODB_URI=your_mongodb_connection_string
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend-url.vercel.app
VITE_API_BASE_URL=/api
```

### Security Considerations

1. **Never commit .env files** - They are gitignored
2. **Rotate API keys regularly** - Especially if exposed
3. **Implement rate limiting** - Add express-rate-limit in production
4. **Monitor API usage** - Track Groq API calls to avoid overages
5. **HTTPS only** - Always use HTTPS in production

## Testing

### Manual Testing Checklist

- [ ] Chat opens when clicking "Ask AI" button
- [ ] Messages send and receive correctly
- [ ] Typing indicator appears during loading
- [ ] Error states show properly
- [ ] Retry button works after errors
- [ ] Copy button copies message text
- [ ] Clear conversation works
- [ ] Disclaimer is always visible
- [ ] Dark mode works correctly
- [ ] Mobile responsive on small screens
- [ ] Character counter updates correctly
- [ ] Can't send empty messages
- [ ] Patient name displays in header

## Troubleshooting

### "AI service not configured" error
- Check that `GROQ_API_KEY` is set in backend/.env
- Restart the backend server after adding the key

### "Missing authentication token" error
- Ensure you're logged in
- Check that JWT token is being sent in Authorization header

### "Patient not found" error
- Verify the patient ID is correct
- Check database connection

### Frontend can't connect to backend
- Verify backend is running on correct port (4000)
- Check VITE_API_URL in .env.local
- Check CORS configuration in backend/index.js

## Future Enhancements

Potential improvements for the chatbot:

- [ ] Conversation history persistence
- [ ] Export conversation as PDF
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Markdown rendering in messages
- [ ] Message reactions/feedback
- [ ] Suggested questions
- [ ] Integration with patient notes
- [ ] Real-time typing indicators via Socket.IO

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs for errors
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

## License

This integration is part of the HealthSync platform. All rights reserved.
