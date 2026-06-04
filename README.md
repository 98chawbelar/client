# 🏢 Meeting Room Booking System

A web-based application for managing meeting room reservations with role-based access control and booking validation.

## 📋 Overview

The Meeting Room Booking System allows users to create and manage meeting room bookings while preventing scheduling conflicts and enforcing permissions based on user roles.

## ✨ Features

### Booking Management

- Create bookings
- View all bookings
- Delete bookings based on permissions
- Prevent overlapping reservations
- Validate booking date and time ranges
- Display clear validation and permission messages

### User Roles

#### User

- Create bookings
- View bookings
- Delete own bookings

#### Owner

- Create bookings
- View bookings
- Delete any booking
- View booking summaries
- View bookings grouped by user

#### Admin

- Manage users
- Create users
- Delete users
- Change user roles
- View all users
- View all bookings
- Delete any booking

## 📌 Booking Rules

- Start time must be before end time
- Bookings cannot overlap
- Identical booking ranges are not allowed
- Partial overlaps are not allowed
- Nested bookings are not allowed
- Back-to-back bookings are allowed

## 🛠️ Built With

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Chart.js

## 🚀 Getting Started

### Clone Repository

```bash
https://github.com/98chawbelar/client.git
