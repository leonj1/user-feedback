# User Feedback Widget

A lightweight JavaScript widget for collecting user feedback, supporting star ratings, thumbs up/down, and text feedback.

## Features

- **Multiple Feedback Types**: Support for star ratings, thumbs up/down, and text feedback.
- **Customizable Themes**: Easily customize the widget's appearance to match your site's design.
- **No Dependencies**: Built with vanilla JavaScript for maximum compatibility and performance.
- **Easy Integration**: Simple to embed with just a few lines of code.
- **Lightweight**: Minified size ~5KB for fast loading.
- **UMD Support**: Compatible with various module systems (CommonJS, AMD, global).

## Installation

### Direct Script Include

```html
<script src="dist/feedback-widget.min.js"></script>
```

### NPM

```bash
npm install user-feedback-widget
```

Then import it in your JavaScript:

```javascript
// ES6 module
import FeedbackWidget from 'user-feedback-widget';

// CommonJS
const FeedbackWidget = require('user-feedback-widget');
```

## Basic Usage

```html
<script src="dist/feedback-widget.min.js"></script>
<script>
  const feedbackWidget = new FeedbackWidget({
    type: 'star', // 'star', 'thumbs', or 'text'
    targetElement: document.getElementById('feedback-container'), // Where to render the widget
    theme: {
      primaryColor: '#007BFF',
      secondaryColor: '#6C757D',
      fontFamily: 'Arial, sans-serif'
    },
    onSubmit: function(data) {
      console.log('Feedback submitted:', data);
      // Send data to your server, etc.
    }
  });
  
  feedbackWidget.init();
</script>
```

## Configuration Options

The `FeedbackWidget` constructor accepts an options object with the following properties:

### Required Options

- **type** (string): The type of feedback widget to display.
  - `'star'`: A 5-star rating system.
  - `'thumbs'`: Thumbs up/down options.
  - `'text'`: A text area for written feedback (limited to 140 characters).

### Optional Options

- **targetElement** (DOM Element): The element where the widget should be rendered. Defaults to `document.body`.
- **theme** (object): Customization options for the widget's appearance.
  - `primaryColor` (string): The main color for the widget. Default: `'#007BFF'`.
  - `secondaryColor` (string): Secondary color for accents. Default: `'#6C757D'`.
  - `fontFamily` (string): Font family for the widget text. Default: `'Helvetica, Arial, sans-serif'`.
- **onSubmit** (function): Callback function that receives the feedback data when submitted.

## Methods

- **init()**: Initializes and renders the widget. Returns the widget instance for chaining.
- **remove()**: Removes the widget from the DOM.

## Feedback Data Format

The feedback data passed to the `onSubmit` callback has the following format:

```javascript
// Star rating feedback
{
  type: 'star',
  value: '4' // String value from '1' to '5'
}

// Thumbs feedback
{
  type: 'thumbs',
  value: 'up' // 'up' or 'down'
}

// Text feedback
{
  type: 'text',
  value: 'Your service is great!' // User's text input (max 140 chars)
}
```

## Examples

Check out the `/examples` directory for working demonstrations of all feedback types.

### Storyboard

We've included a custom storyboard interface to help you test and visualize different widget configurations:

```bash
# Open the storyboard in your browser
open examples/storyboard.html
```

The storyboard provides:
- Interactive controls to customize each widget's appearance
- Live previews of all three feedback types
- Generated code snippets based on your customizations
- A tab-based interface to switch between different widget types

This makes it easy to experiment with different themes and configurations before implementing them in your project.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11+ (with appropriate polyfills)

## Development

### Prerequisites

- Node.js (v12+)
- npm (v6+)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/user-feedback-widget.git
cd user-feedback-widget

# Install dependencies
npm install
```

### Build

```bash
# Build minified version
npm run build
```

### Testing

```bash
# Run tests
npm test
```

## License

MIT