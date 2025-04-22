# Real-Time Experiment Monitoring API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" />
</p>

<p align="center">A flexible real-time API for monitoring A/B test experiments built with NestJS.</p>

## 📊 Overview

This API serves as the backend for a real-time experiment monitoring dashboard. It enables product teams to track the performance of A/B tests with live data streaming, providing immediate insights into experiment variants' performance metrics including visitors, conversions, and revenue.

### Key Features

- **Real-time Data Streaming**: Uses Server-Sent Events (SSE) to push updates to clients
- **Configurable Update Frequencies**: Dynamic control of data flow rate with the "Rabbit-Turtle" system
- **Realistic Data Simulation**: Generates statistically realistic experiment data with natural variance
- **RESTful API Design**: Clean and intuitive endpoints for experiment metrics
- **Well-Documented API**: Comprehensive Swagger documentation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
$ npm install
```

### Running the API

```bash
# Development mode
$ npm run start

# Watch mode (recommended during development)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The server will start on port 4000: [http://localhost:4000](http://localhost:4000)

### API Documentation

Swagger documentation is available at: [http://localhost:4000/api](http://localhost:4000/api)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experiments/:id/metrics` | Get aggregate metrics for a specific experiment |
| GET (SSE) | `/api/experiments/:id/events` | Subscribe to real-time event stream for experiment updates |
| POST | `/api/experiments/:id/interval` | Configure the update interval for experiment data stream |

### Example: Subscribing to Experiment Events

```javascript
// Client-side code to connect to the SSE endpoint
const eventSource = new EventSource('http://localhost:4000/api/experiments/exp_live_001/events');

eventSource.addEventListener('experiment-update', (event) => {
  const update = JSON.parse(event.data);
  console.log('New experiment data:', update);
  // Update your UI with the new data
});

eventSource.onerror = (error) => {
  console.error('EventSource error:', error);
  eventSource.close();
};
```

### Example: Configuring the Update Interval

```javascript
// Setting the update frequency to a "rabbit" (fast) mode
fetch('http://localhost:4000/api/experiments/exp_live_001/interval', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ interval: 1000 }),  // Update every 1 second
});

// Setting the update frequency to a "turtle" (slow) mode
fetch('http://localhost:4000/api/experiments/exp_live_001/interval', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ interval: 30000 }),  // Update every 30 seconds
});
```

## 🐰🐢 The "Rabbit-Turtle" Feature

This API implements an innovative "Rabbit-Turtle" system for controlling the flow of real-time data. This feature allows users to:

- 🐰 **Rabbit Mode**: Accelerate data updates for rapid assessment of experiment performance
- 🐢 **Turtle Mode**: Slow down updates to reduce noise and focus on significant changes
- ⚖️ **Neutral Mode**: Standard update frequency for balanced monitoring

### Technical Implementation

The system uses RxJS Observables with switchMap and interval operators to dynamically adjust the frequency of updates sent through the SSE connection. When a client requests a different interval, the system seamlessly transitions without dropping the connection.

### Why This Approach?

I've implemented this way because of the following:

1. **User Experience**: Different stakeholders have different monitoring needs - executives may want slower updates for big-picture trends, while data analysts may need rapid updates for detailed analysis
2. **Statistical Significance**: Slower updates allow trends to develop before making assessments, reducing "noise" in the data
3. **Technical Demonstration**: This implementation showcases advanced RxJS usage and reactive programming principles

## 🏗️ Architecture

The application follows a clean and modular architecture:

- **Core Module**: Global services including the data simulator
- **Experiments Module**: Business logic for experiment management
- **Controllers**: Handle HTTP requests and SSE connections
- **Services**: Contain business logic and manage data flow
- **Repositories**: Interface with the data layer (simulation in this case)
- **DTOs**: Ensure type safety and validation

## 🔍 Testing
I didn't implement unit testing because of the time constraint.

## 🛣️ Future Improvements

- Add authentication and authorization
- Implement more sophisticated statistical analysis of experiment results
- Add support for multiple experiment types beyond A/B testing (multivariate, etc.)
- Create a caching layer for improved performance
- Add database persistence for experiment history
- Implement real-time alerts for significant metric changes
- Make SSE reactive to further type of incoming data (not only `interval`)
