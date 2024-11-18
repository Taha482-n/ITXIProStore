# ItxiAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11 and later on was upgraded to 18.2.12.

This project is an Angular application that demonstrates UI design, authentication, third-party API integration, and role-based access control.

Prerequisites
Node.js: Version 18.x or higher is required.
Angular CLI: If not already installed, run the following command to install it globally:
  ## npm install -g @angular/cli
If Angular CLI is already installed, running npm install is sufficient to install the project dependencies.

# Development Server
Run the following command to start the development server:
  ## ng serve
Navigate to http://localhost:4200/ in your browser. The application will automatically reload if you make changes to the source files.

# Build
Run the following command to build the project:
  ## ng build
The build artifacts will be stored in the dist/ directory.


# Running Unit Tests
Run the following command to execute the unit tests using Karma:
  ## ng test


# Features:

Authentication
Login/Signup: Users can log in or create accounts.
Role Management: Admins can assign roles (e.g., "user", "weather-manager").
use this credentials to login as an admin:
email: moetassem.wehbe.01@gmail.com
password: m20012001w

User Roles
Admin: Manage roles, weather data, and products.
Weather-Manager: Update weather data visibility and formats.
User: Browse and add products to the cart (checkout restricted to logged-in users).

Product Management
Product Card: Display product details.
Cart: Add products to the cart, view contents.

Weather Information
Integrates with Open-Meteo API to display weather data in multiple formats:
Current weather.
Weekly forecasts.
Detailed charts.

UI Design
Responsive Layout: Mobile-friendly using Angular Material.
Component-Based Architecture: Reusable components for header, footer, and product cards.

