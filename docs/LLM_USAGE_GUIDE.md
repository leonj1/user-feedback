# User Feedback Widget - LLM Usage Guide

This guide explains how to integrate and use the User Feedback Widget in your applications to collect user feedback through star ratings, thumbs up/down, or text input.

## Installation

### Option 1: Script Tag (Simplest)
```html
<script src="path/to/feedback-widget.min.js"></script>
```

### Option 2: NPM Module
```bash
npm install @your-org/feedback-widget
```

## Basic Usage

### 1. Star Rating Widget
Collect 1-5 star ratings from users:

```javascript
const starWidget = new FeedbackWidget({
  type: 'star',
  targetElement: document.getElementById('star-container'),
  onSubmit: (data) => {
    console.log('Star rating:', data.value); // '1' to '5'
    // Send to your backend
  }
});
```

### 2. Thumbs Up/Down Widget
Binary feedback collection:

```javascript
const thumbsWidget = new FeedbackWidget({
  type: 'thumbs',
  targetElement: document.getElementById('thumbs-container'),
  onSubmit: (data) => {
    console.log('Feedback:', data.value); // 'up' or 'down'
    // Process feedback
  }
});
```

### 3. Text Feedback Widget
Collect short text feedback (max 140 characters):

```javascript
const textWidget = new FeedbackWidget({
  type: 'text',
  targetElement: document.getElementById('text-container'),
  onSubmit: (data) => {
    console.log('User feedback:', data.value); // User's text input
    // Store feedback
  }
});
```

## Configuration Options

### Complete Configuration Example
```javascript
const widget = new FeedbackWidget({
  // Required
  type: 'star', // 'star' | 'thumbs' | 'text'
  
  // Optional
  targetElement: document.body, // Defaults to document.body
  
  // Theme customization
  theme: {
    primaryColor: '#007BFF',    // Main action color
    secondaryColor: '#6C757D',  // Secondary elements
    fontFamily: 'Arial, sans-serif'
  },
  
  // Callback function
  onSubmit: (data) => {
    // data structure:
    // {
    //   type: 'star' | 'thumbs' | 'text',
    //   value: '1-5' | 'up'/'down' | 'user text'
    // }
  }
});
```

## Integration Examples

### Example 1: After AI Response
```javascript
// After your LLM generates a response
function displayAIResponse(response) {
  const responseDiv = document.createElement('div');
  responseDiv.innerHTML = response;
  
  // Add feedback widget below response
  const feedbackDiv = document.createElement('div');
  responseDiv.appendChild(feedbackDiv);
  
  new FeedbackWidget({
    type: 'thumbs',
    targetElement: feedbackDiv,
    onSubmit: async (data) => {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseId: response.id,
          feedback: data.value
        })
      });
    }
  });
}
```

### Example 2: Modal Feedback Collection
```javascript
function showFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  modal.style.display = 'block';
  
  new FeedbackWidget({
    type: 'star',
    targetElement: modal.querySelector('.modal-body'),
    theme: {
      primaryColor: '#28a745',
      secondaryColor: '#6c757d'
    },
    onSubmit: (data) => {
      // Process rating
      console.log(`User rated: ${data.value} stars`);
      modal.style.display = 'none';
    }
  });
}
```

### Example 3: Inline Text Feedback
```javascript
// Add feedback widget to chat interface
const chatContainer = document.getElementById('chat');

new FeedbackWidget({
  type: 'text',
  targetElement: chatContainer,
  onSubmit: (data) => {
    // Add to conversation
    addMessageToChat('user-feedback', data.value);
    
    // Send to backend
    sendFeedback({
      sessionId: getCurrentSessionId(),
      feedback: data.value,
      timestamp: new Date().toISOString()
    });
  }
});
```

## Best Practices

### 1. Placement
- **Star ratings**: Best after completing a task or interaction
- **Thumbs**: Ideal for quick feedback on individual responses
- **Text**: Use when you need specific feedback details

### 2. Timing
```javascript
// Good: After content is fully loaded
window.addEventListener('load', () => {
  new FeedbackWidget({
    type: 'star',
    onSubmit: handleFeedback
  });
});

// Good: After specific user action
button.addEventListener('click', () => {
  // Show feedback widget after action completes
  performAction().then(() => {
    new FeedbackWidget({
      type: 'thumbs',
      targetElement: resultContainer,
      onSubmit: handleFeedback
    });
  });
});
```

### 3. Data Handling
```javascript
async function handleFeedback(data) {
  try {
    // Always include context
    const feedbackData = {
      ...data,
      context: {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        // Include relevant context like prompt/response IDs
      }
    };
    
    await sendToBackend(feedbackData);
    
    // Provide user confirmation
    showThankYouMessage();
    
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    // Handle gracefully
  }
}
```

## Advanced Usage

### Multiple Widgets on Same Page
```javascript
// Different feedback types for different sections
const widgets = {
  overall: new FeedbackWidget({
    type: 'star',
    targetElement: document.getElementById('overall-rating'),
    onSubmit: (data) => handleFeedback('overall', data)
  }),
  
  response: new FeedbackWidget({
    type: 'thumbs',
    targetElement: document.getElementById('response-feedback'),
    onSubmit: (data) => handleFeedback('response', data)
  }),
  
  detailed: new FeedbackWidget({
    type: 'text',
    targetElement: document.getElementById('detailed-feedback'),
    onSubmit: (data) => handleFeedback('detailed', data)
  })
};
```

### Dynamic Theme Based on Context
```javascript
function createContextualWidget(context) {
  const themes = {
    success: { primaryColor: '#28a745' },
    warning: { primaryColor: '#ffc107' },
    error: { primaryColor: '#dc3545' }
  };
  
  return new FeedbackWidget({
    type: 'thumbs',
    theme: themes[context] || themes.success,
    onSubmit: (data) => {
      handleContextualFeedback(context, data);
    }
  });
}
```

## Common Patterns for LLM Applications

### 1. Conversation Feedback
```javascript
// After each AI response
function addAIMessage(message) {
  const messageEl = createMessageElement(message);
  conversationEl.appendChild(messageEl);
  
  // Add feedback widget to message
  const feedbackContainer = document.createElement('div');
  feedbackContainer.className = 'feedback-container';
  messageEl.appendChild(feedbackContainer);
  
  new FeedbackWidget({
    type: 'thumbs',
    targetElement: feedbackContainer,
    theme: { primaryColor: '#0066cc' },
    onSubmit: (data) => {
      recordMessageFeedback(message.id, data.value);
    }
  });
}
```

### 2. Session Rating
```javascript
// At end of conversation
function endConversation() {
  const ratingModal = showModal('Rate your experience');
  
  new FeedbackWidget({
    type: 'star',
    targetElement: ratingModal.body,
    onSubmit: async (data) => {
      await saveSessionRating({
        sessionId: currentSession.id,
        rating: data.value,
        timestamp: Date.now()
      });
      ratingModal.close();
    }
  });
}
```

### 3. Feature Feedback Collection
```javascript
// For specific AI features
function collectFeatureFeedback(featureName) {
  const widget = new FeedbackWidget({
    type: 'text',
    targetElement: document.getElementById('feature-feedback'),
    onSubmit: (data) => {
      analytics.track('feature_feedback', {
        feature: featureName,
        feedback: data.value,
        userId: getCurrentUser().id
      });
    }
  });
}
```

## Troubleshooting

### Widget Not Appearing
```javascript
// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}

function initWidget() {
  // Check target element exists
  const target = document.getElementById('feedback-container');
  if (!target) {
    console.error('Target element not found');
    return;
  }
  
  new FeedbackWidget({
    type: 'star',
    targetElement: target,
    onSubmit: handleFeedback
  });
}
```

### Styling Conflicts
```javascript
// Widget uses inline styles to avoid conflicts
// If you need custom styling, use the theme option:
new FeedbackWidget({
  type: 'thumbs',
  theme: {
    primaryColor: 'var(--your-primary-color)',
    secondaryColor: 'var(--your-secondary-color)',
    fontFamily: 'inherit' // Use parent font
  }
});
```

## Performance Considerations

- Widget is lightweight (~10KB minified)
- No external dependencies
- Renders synchronously
- Event handlers are automatically cleaned up

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Basic support (polyfills may be required)

## Security Notes

- Text input is automatically sanitized
- No data is sent externally by the widget
- All feedback handling is done through your `onSubmit` callback
- Character limit (140) prevents spam/abuse in text widget

## Need Help?

For issues or questions:
1. Check the examples in `/examples/` directory
2. Use the storyboard tool for interactive testing
3. Review the source code in `/src/feedback-widget.js`