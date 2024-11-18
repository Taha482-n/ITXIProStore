# Project Overview
ITXiAngular is a dynamic Angular application that showcases several key features including user authentication, role-based access control, third-party API integration (weather data), and a responsive user interface. The application follows best practices for UI/UX design, ensuring a seamless experience across various devices.

Prerequisites
Before starting, make sure the following dependencies are installed:

Node.js: Version 18.x or higher is required.
Angular CLI: If Angular CLI is not installed globally, you can install it by running the following command:

npm install -g @angular/cli

If Angular CLI is already installed, you can proceed to install the project dependencies.

# Installation
1)Clone the repository to your local machine:
  git clone <https://github.com/moewb1/text-search-project.git> //for hhtps
            <git@github.com:moewb1/text-search-project.git> //for ssh

2)Navigate to the project folder:
  cd ItxiAngular

3)Install the project dependencies:
  npm install

# Development Server
To run the development server, use the following command:
  ng serve
Once the server starts, you can open your browser and navigate to http://localhost:4200/ to see the application. The server will automatically reload when you make changes to any source files.

# Running Unit Tests
The project includes unit tests for all components and services. To run the tests, use the following command:
  ng test
This will execute the unit tests using Karma and display the results in the console.

# Features


Authentication
Login/Signup: Users can log in with an existing account or create a new one.
Role Management: Admins can assign roles such as "user", "weather-manager", or "admin" to different users.
Admin Credentials: You can log in as an admin using the following credentials:
Email: moetassem.wehbe.01@gmail.com
Password: m20012001w


User Roles
Admin: Admin users can manage roles, update weather data, and manage products within the application.
Weather-Manager: Weather managers can update the visibility and formats of weather data displayed in the application.
User: Regular users can browse products, add them to the cart, and proceed to checkout (login required for checkout).


Product Management
Product Cards: Display details such as title, price, and description for each product. The cards are dynamically populated and styled.
Cart: Users can add products to the cart and view the contents. The cart displays product details, quantity, and total price.


Weather Information
The application integrates with the Open-Meteo API to fetch and display weather data. The weather features include:
Current Weather: Displaying real-time weather information.


UI Design
The application features a responsive layout optimized for mobile and desktop views. Key design features include:
Mobile-Friendly Design: The application adapts to different screen sizes and provides a seamless experience across devices.
Component-Based Architecture: Reusable components such as the header, footer, and product cards ensure maintainability and ease of updates.
Angular Material: The project uses Angular Material for UI components, providing a consistent and modern look across all platforms.


# Directory Structure

src/
  app/
    components/         # Contains reusable UI components (e.g., headers, footers, product cards, etc.)
    pages/              # Contains page components (e.g., home, cart, manage-users, etc.)
    services/           # Contains all services (e.g., auth, product, cart, weather)
    models/             # Contains data models (e.g., product, user)
    app.module.ts       # Main application module
  assets/
    images/             # Contains images used throughout the app
  environments/         # Contains environment-specific configurations (e.g., production, development)

# Services
The application relies on various services to handle different functionalities:
Authentication Service: Handles user login, signup, and role management using Firebase Authentication.
Product Service: Manages product data, including fetching products from the server, adding/removing from the cart, and pagination.
Weather Service: Fetches weather data from the Open-Meteo API and provides it to the UI.
Cart Service: Manages the cart state, including adding/removing items and calculating total price.

# Unit Testing
All components and services have been thoroughly unit-tested. The tests ensure that each component functions as expected and that all services handle their tasks correctly. Unit tests are organized by component and service, and they cover:

Component Rendering: Ensures that all UI components render correctly.
Event Emission: Tests user interaction events, such as button clicks and role changes.
Service Logic: Verifies the correct operation of services, including API requests and state management.

# Conclusion

The ITXiAngular project provides a robust, feature-rich platform with modern design practices, role-based access, and integration with third-party services such as the Open-Meteo API. The application utilizes standalone components and signals for efficient state management, alongside the bootstrap application approach for optimal performance. It is fully responsive, ensuring a seamless experience for users on all devices.