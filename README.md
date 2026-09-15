# RentalCar App

RentalCar is a car rental frontend built with Next.js and React. It allows users to browse available cars, filter the catalog, view detailed vehicle information, and submit a rental request.

## Features

- Browse a paginated car catalog.
- Filter cars by brand, hourly price, and mileage range.
- View car specifications, rental conditions, features, location, and rental company details.
- Submit a rental request from the car details page.
- Preserve rental form draft data in browser storage.
- Display loading, empty, validation, and request feedback states.
- Use responsive layouts and keyboard-accessible custom controls.

## Tech Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- TanStack Query for server-state management
- Axios for API requests
- Zustand for rental form draft state
- Yup for form validation
- React Hot Toast for request feedback
- CSS Modules and `modern-normalize` for styling

## Requirements

- Node.js 20 or later
- npm
- Access to the car rental API

## Installation

1. Clone the repository and open the project directory:

	```bash
	git clone <repository-url>
	cd car-rental-next-js
	```

2. Install dependencies:

	```bash
	npm ci
	```

3. Create a `.env.local` file in the project root and configure the API URL:

	```env
	NEXT_PUBLIC_API_BASE_URL=https://your-api-host.example.com
	```

	The API should provide the car catalog endpoints used by the application:

	- `GET /cars`
	- `GET /cars/filters`
	- `GET /cars/:carId`
	- `POST /cars/:carId/booking-requests`

## Usage

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application contains the following main routes:

- `/` - landing page with a link to the catalog.
- `/catalog` - searchable and filterable car catalog.
- `/catalog/:carId` - car details and rental request form.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after building. |
| `npm run lint` | Run ESLint checks. |

## Project Structure

```text
app/             Next.js routes and page-level components
components/      Reusable UI components
constants/       Shared application constants
hooks/           Reusable React hooks and mutations
lib/             API client and Zustand store
public/          Static images and other public assets
types/           Shared TypeScript types
```

## Author

This project was created as part of the Neoversity Advanced Front-End Engineering with React course.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ponomalex)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ponomaleks)

## License

This project is intended for educational purposes.
