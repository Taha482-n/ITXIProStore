# ITXIStore

## Project Overview

ITXIStore is a dynamic Angular application that showcases several key features including user authentication, role-based access control, third-party API integration (weather data), and a responsive user interface. The application follows best practices for UI/UX design, ensuring a seamless experience across various devices.

## Prerequisites

Before starting, make sure the following dependencies are installed:

- **Node.js**: Version 18.x or higher is required.
- **Angular CLI**: If Angular CLI is not installed globally, you can install it by running the following command:

  ```bash
  npm install -g @angular/cli
  ```

If Angular CLI is already installed, you can proceed to install the project dependencies.

## Installation

1. **Clone the repository to your local machine:**

   Using HTTPS:

```bash
git clone https://github.com/Taha482-n/ITXIProStore.git
```

2)**Navigate to the project folder:**

```bash
cd ITXIProStore-main
```

3)**Install the project dependencies:**

```bash
npm install
```

## Development Server

To start the development server, run:
ng serve
After it launches, open your browser and go to http://localhost:4200/ to view the app. Any changes you make to the source code will trigger an automatic reload.

## Features

Authentication
Login/Signup: Users can sign in with an existing account or register a new one.
Role Management: Admins can assign roles such as "user", "weather-manager", or "admin" to other users.
Admin Credentials: You can access an admin account using these credentials:
Email: admin@gmail.com
Password: 123qweasd!@#

User Roles
Admin: Can manage user roles, update weather information, and manage products across the application.
Weather-Manager: Can control weather data visibility and the formats used to display weather information.
User: Standard users can browse products, add items to the cart, and complete checkout (checkout requires login).

Product Management
Product Cards: Show product details including title, price, and description. Cards are styled and filled dynamically from data.
Cart: Users can add items to the cart and view everything inside it. The cart displays product information, quantity, and the total cost.

Weather Information
The app integrates with the Open-Meteo API to retrieve and present weather details. Weather functionality includes:
Current Weather: Shows up-to-date, real-time weather information.

UI Design
The interface is responsive and designed for both mobile and desktop screens. Main UI highlights include:
Mobile-Friendly Design: Layout adjusts smoothly across different screen sizes for a consistent experience.
Component-Based Architecture: Reusable elements like the header, footer, and product cards improve maintainability and make updates easier.
Angular Material: Uses Angular Material components to deliver a modern, consistent visual style on all platforms.

## Services

The application uses multiple services to support different parts of the system:

- **Authentication Service**: Manages signup, login, and role management via Firebase Authentication.

- **Product Service**: Handles product data operations such as retrieving products, adding/removing cart items, and pagination.

- **Weather Service**: Requests weather data from the Open-Meteo API and supplies it to the UI.

Cart Service: Controls cart state, including adding/removing items and computing the total amount.

## Unit Testing

Each service and component has been fully unit-tested. The test suite confirms correct behavior across the app, and tests are grouped by component/service. Coverage includes:

- **Component Rendering**: Confirms UI components display properly.

- **Event Emission**: Validates user-driven actions like button clicks and role updates.

- **Service Logic**: Ensures services work correctly, including API calls and state handling.

## Conclusion

The ITXIStore project delivers a powerful, modern platform featuring role-based access, a polished UI, and third-party integration with the Open-Meteo API. It is built with standalone components and signals for efficient state management, and it uses the bootstrap application approach to improve performance. The design is fully responsive, providing a smooth experience across all device types.
