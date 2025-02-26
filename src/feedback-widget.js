// feedback-widget.js
// Main source code for the user feedback widget

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.FeedbackWidget = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * FeedbackWidget - A lightweight JavaScript widget for collecting user feedback.
   * @class
   */
  class FeedbackWidget {
    /**
     * Create a new FeedbackWidget.
     * @param {Object} options - Configuration options for the widget.
     * @param {string} [options.type='star'] - The type of feedback: 'star', 'thumbs', or 'text'.
     * @param {Object} [options.theme={}] - Theme customization options.
     * @param {string} [options.targetElement=document.body] - The element to append the widget to.
     * @param {Function} [options.onSubmit] - Callback function when feedback is submitted.
     */
    constructor(options = {}) {
      this.type = options.type || 'star';
      this.theme = options.theme || {};
      this.targetElement = options.targetElement || document.body;
      this.onSubmit = options.onSubmit || null;
      this.container = null;
      this.selectedValue = null;
    }

    /**
     * Initialize the widget.
     * @returns {FeedbackWidget} The widget instance for chaining.
     */
    init() {
      // Apply theme and render the widget
      this.applyTheme();
      this.render();
      this.attachEvents();
      return this;
    }

  applyTheme() {
    // Default theme settings
    const defaultTheme = {
      primaryColor: '#007BFF',
      secondaryColor: '#6C757D',
      fontFamily: 'Helvetica, Arial, sans-serif',
    };
    this.theme = { ...defaultTheme, ...this.theme };

    // Inject styles into the document head
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .feedback-widget {
        font-family: ${this.theme.fontFamily};
        color: ${this.theme.primaryColor};
      }
      .feedback-widget .secondary {
        color: ${this.theme.secondaryColor};
      }
      .feedback-widget button {
        background-color: ${this.theme.primaryColor};
        border: none;
        color: #FFFFFF;
        padding: 10px 20px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  render() {
    // Create the widget container
    this.container = document.createElement('div');
    this.container.className = 'feedback-widget';

    // Render feedback type
    switch (this.type) {
      case 'star':
        this.renderStarRating();
        break;
      case 'thumbs':
        this.renderThumbsFeedback();
        break;
      case 'text':
        this.renderTextFeedback();
        break;
      default:
        console.error('Invalid feedback type specified.');
    }

    // Append the widget to the target element
    this.targetElement.appendChild(this.container);
  }

  renderStarRating() {
    const starContainer = document.createElement('div');
    starContainer.className = 'star-rating';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.dataset.value = i;
      star.innerHTML = '&#9733;'; // Unicode star character
      starContainer.appendChild(star);
    }

    this.container.appendChild(starContainer);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    this.container.appendChild(submitButton);
  }

  renderThumbsFeedback() {
    const thumbsContainer = document.createElement('div');
    thumbsContainer.className = 'thumbs-feedback';

    const thumbsUp = document.createElement('span');
    thumbsUp.className = 'thumbs-up';
    thumbsUp.dataset.value = 'up';
    thumbsUp.innerHTML = '&#128077;'; // Unicode thumbs up

    const thumbsDown = document.createElement('span');
    thumbsDown.className = 'thumbs-down';
    thumbsDown.dataset.value = 'down';
    thumbsDown.innerHTML = '&#128078;'; // Unicode thumbs down

    thumbsContainer.appendChild(thumbsUp);
    thumbsContainer.appendChild(thumbsDown);

    this.container.appendChild(thumbsContainer);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    this.container.appendChild(submitButton);
  }

  renderTextFeedback() {
    const textContainer = document.createElement('div');
    textContainer.className = 'text-feedback';

    const textarea = document.createElement('textarea');
    textarea.maxLength = 140;
    textarea.placeholder = 'Enter your feedback (max 140 characters)...';

    textContainer.appendChild(textarea);

    this.container.appendChild(textContainer);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    this.container.appendChild(submitButton);
  }

  attachEvents() {
    // Event listeners based on feedback type
    switch (this.type) {
      case 'star':
        this.attachStarEvents();
        break;
      case 'thumbs':
        this.attachThumbsEvents();
        break;
      case 'text':
        this.attachTextEvents();
        break;
    }
  }

  attachStarEvents() {
    const stars = this.container.querySelectorAll('.star');
    stars.forEach((star) => {
      star.addEventListener('click', (e) => {
        this.clearStarSelection();
        const value = e.currentTarget.dataset.value;
        this.selectStarsUpTo(value);
        this.selectedValue = value;
      });
    });

    const submitButton = this.container.querySelector('button');
    submitButton.addEventListener('click', () => this.handleSubmit());
  }

  attachThumbsEvents() {
    const thumbs = this.container.querySelectorAll('.thumbs-feedback span');
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        this.clearThumbSelection();
        e.currentTarget.classList.add('selected');
        this.selectedValue = e.currentTarget.dataset.value;
      });
    });

    const submitButton = this.container.querySelector('button');
    submitButton.addEventListener('click', () => this.handleSubmit());
  }

  attachTextEvents() {
    const submitButton = this.container.querySelector('button');
    submitButton.addEventListener('click', () => this.handleSubmit());
  }

  clearStarSelection() {
    const stars = this.container.querySelectorAll('.star');
    stars.forEach((star) => star.classList.remove('selected'));
  }

  selectStarsUpTo(value) {
    const stars = this.container.querySelectorAll('.star');
    stars.forEach((star) => {
      if (star.dataset.value <= value) {
        star.classList.add('selected');
      }
    });
  }

  clearThumbSelection() {
    const thumbs = this.container.querySelectorAll('.thumbs-feedback span');
    thumbs.forEach((thumb) => thumb.classList.remove('selected'));
  }

  handleSubmit() {
    const submitStrategies = {
      'star': this.handleStarSubmit.bind(this),
      'thumbs': this.handleThumbsSubmit.bind(this),
      'text': this.handleTextSubmit.bind(this),
    };

    const submitFunction = submitStrategies[this.type];
    if (submitFunction) {
      submitFunction();
    } else {
      console.error('Invalid feedback type specified.');
    }
  }

  handleStarSubmit() {
    const feedbackData = {
      type: 'star',
      value: this.selectedValue || null,
    };
    this.processFeedback(feedbackData);
  }

  handleThumbsSubmit() {
    const feedbackData = {
      type: 'thumbs',
      value: this.selectedValue || null,
    };
    this.processFeedback(feedbackData);
  }

  handleTextSubmit() {
    const textarea = this.container.querySelector('textarea');
    const feedbackData = {
      type: 'text',
      value: textarea.value.trim() || null,
    };
    this.processFeedback(feedbackData);
  }

  processFeedback(feedbackData) {
    if (feedbackData.value) {
      console.log('User Feedback:', feedbackData);
      
      // Call the onSubmit callback if provided
      if (typeof this.onSubmit === 'function') {
        this.onSubmit(feedbackData);
      }
      
      alert('Thank you for your feedback!');
      this.remove();
    } else {
      alert('Please provide your feedback before submitting.');
    }
  }
  
  /**
   * Removes the widget from the DOM.
   */
  remove() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Return the FeedbackWidget class for UMD
return FeedbackWidget;
}));