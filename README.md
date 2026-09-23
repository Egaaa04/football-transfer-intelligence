# Football Transfer Intelligence

Football Transfer Intelligence is a web-based football data analytics application for collecting, managing, exploring, and analyzing player transfer data across football seasons.

The application integrates football data from **API-Football**, processes the data through a Laravel backend, stores structured transfer records in a relational database, and presents the results through an interactive React dashboard.

The project was developed as part of a personal software engineering and data analytics portfolio.

---

## Features

### Transfer Intelligence

* Browse player transfer records
* View transfer dates and transfer fees
* Track player movements between clubs
* Filter transfers by season, league, player, and club
* View detailed information for individual transfers

### Player Data

* Player profiles
* Player age and position
* Player profile photos
* Player transfer history
* Player-season data tracking

### Club Data

* Club directory
* Club logos
* Club transfer activity
* Incoming and outgoing transfers
* Club detail pages

### Analytics Dashboard

* Total transfers
* Total players
* Total clubs
* Transfer activity by season
* Top transfers
* Active clubs
* Transfer fee analysis

### Multi-Season Data Import

* Import football league data by season
* Import clubs and players
* Import player transfer histories
* Track imported player-season combinations
* Prevent unnecessary repeated API requests
* Handle API rate limits and failed requests

---

## Tech Stack

### Backend

* PHP 8.4
* Laravel 13
* Laravel Eloquent ORM
* REST API

### Frontend

* React
* Vite
* JavaScript
* CSS

### Database

* SQLite

### External API

* API-Football

### Development Tools

* Visual Studio Code
* Git
* GitHub
* PowerShell

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │    API-Football     │
                    │  External Football  │
                    │        Data         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Laravel Backend   │
                    │                     │
                    │ Import Services     │
                    │ REST API            │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    │                     │
                    │ Players             │
                    │ Clubs               │
                    │ Transfers           │
                    │ Leagues             │
                    │ Seasons             │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │ Dashboard           │
                    │ Transfers           │
                    │ Players             │
                    │ Clubs               │
                    │ Analytics            │
                    └─────────────────────┘
```

---

## Data Flow

The application follows this general data flow:

```text
API-Football
     │
     ▼
FootballApiService
     │
     ▼
TransferImportService
     │
     ▼
Laravel Eloquent
     │
     ▼
SQLite Database
     │
     ▼
Laravel REST API
     │
     ▼
React Frontend
     │
     ▼
Dashboard & Analytics
```

---

## Database Structure

The main entities in the application are:

```text
League
   │
   └── Season
          │
          └── Transfer
                 │
                 ├── Player
                 │
                 ├── From Club
                 │
                 └── To Club
```

### Main Tables

#### `players`

Stores player information.

Important fields:

```text
id
external_id
name
age
position
photo_url
```

#### `clubs`

Stores football club information.

Important fields:

```text
id
external_id
name
logo_url
```

#### `leagues`

Stores football competition information.

#### `seasons`

Stores football season information.

#### `transfers`

Stores transfer transactions.

Important fields:

```text
player_id
from_club_id
to_club_id
league_id
season_id
transfer_date
fee_raw
transfer_fee
```

#### `player_season_imports`

Tracks whether a player's transfer data has already been imported for a particular season.

This table helps reduce unnecessary API requests when importing large datasets.

---

## API Integration

The application uses API-Football as the external football data provider.

The backend communicates with the API through a dedicated service:

```text
App\Services\FootballApiService
```

Transfer processing is handled by:

```text
App\Services\TransferImportService
```

The import process retrieves player information and transfer history, then converts the external API data into structured database records.

---

## API Endpoints

The backend provides REST endpoints for the frontend.

### Transfers

```http
GET /api/transfers
GET /api/transfers/{id}
```

Supported filters include:

```text
season
league
player
club
```

Example:

```http
GET /api/transfers?season=2022
```

---

### Players

```http
GET /api/players
GET /api/players/{id}
```

---

### Clubs

```http
GET /api/clubs
GET /api/clubs/{id}
```

---

### Leagues

```http
GET /api/leagues
```

---

### Seasons

```http
GET /api/seasons
```

---

## Data Import Commands

The application provides Laravel Artisan commands for importing football data.

### Import a League Season

```powershell
php artisan football:import-league 39 2022
```

Example:

```text
League: Premier League
League ID: 39
Season: 2022
```

---

### Import Player Transfers

```powershell
php artisan football:import-player {playerId} {leagueId} {season}
```

Example:

```powershell
php artisan football:import-player 874 39 2022
```

---

### Import Multiple Player Transfers by Season

```powershell
php artisan football:import-season-transfers 39 2022
```

Optional parameters:

```powershell
--limit=10
--club-limit=4
--club-offset=0
```

Example:

```powershell
php artisan football:import-season-transfers 39 2022 --limit=10 --club-limit=1 --club-offset=3
```

The import system tracks previously processed player-season combinations to minimize unnecessary API requests.

---

## API Request Protection

API-Football has request limits depending on the subscription plan.

To avoid repeatedly requesting the same player-season data, the project uses:

```text
player_season_imports
```

Before making a transfer request, the importer checks whether the player-season combination has already been processed.

Conceptually:

```text
Player + Season
       │
       ▼
Already imported?
   │          │
  YES         NO
   │          │
   ▼          ▼
 Skip      API Request
              │
              ▼
         Save Transfers
              │
              ▼
       Mark as Imported
```

This approach makes the import process more efficient when working with large datasets.

---

## Frontend Pages

The React frontend currently contains several main sections.

### Dashboard

Provides an overview of football transfer data and analytics.

Includes:

* Total players
* Total clubs
* Total transfers
* Transfer activity
* Top transfers
* Active clubs
* Season filtering

### Transfers

Displays transfer records with:

* Player
* Player photo
* From club
* To club
* Transfer date
* Transfer fee
* Season

Transfer rows can be opened to view more details.

### Players

Provides:

* Player list
* Player profiles
* Player photos
* Position
* Age
* Transfer history

### Clubs

Provides:

* Club list
* Club logos
* Club details
* Incoming transfers
* Outgoing transfers
* Market activity

---

## Project Structure

```text
football-transfer-intelligence/
│
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │
│   ├── Models/
│   │
│   └── Services/
│       ├── FootballApiService.php
│       └── TransferImportService.php
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── ...
│
├── routes/
│   └── api.php
│
├── resources/
│
├── public/
│
├── storage/
│
├── artisan
├── composer.json
├── package.json
└── README.md
```

---

## Installation

### 1. Clone Repository

```powershell
git clone https://github.com/Egaaa04/football-transfer-intelligence.git
```

Enter the project:

```powershell
cd football-transfer-intelligence
```

---

### 2. Install PHP Dependencies

```powershell
composer install
```

---

### 3. Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

---

### 4. Configure Environment

Copy the environment file:

```powershell
copy .env.example .env
```

Generate the Laravel application key:

```powershell
php artisan key:generate
```

Configure the API-Football credentials in `.env`.

Example:

```env
FOOTBALL_API_KEY=your_api_key
FOOTBALL_API_HOST=v3.football.api-sports.io
```

---

### 5. Configure Database

The project currently uses SQLite.

Create the database file if necessary:

```powershell
New-Item database/database.sqlite -ItemType File
```

Then run migrations:

```powershell
php artisan migrate
```

---

### 6. Start Laravel Backend

```powershell
php artisan serve
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

### 7. Start React Frontend

Open another terminal:

```powershell
cd frontend
npm run dev
```

Vite will provide the frontend URL, normally:

```text
http://localhost:5173
```

---

## Example Workflow

A typical data collection workflow is:

### Step 1 — Import League

```powershell
php artisan football:import-league 39 2022
```

### Step 2 — Import Player Transfer Data

```powershell
php artisan football:import-season-transfers 39 2022 --limit=10 --club-limit=1
```

### Step 3 — Open Backend

```text
http://127.0.0.1:8000
```

### Step 4 — Open Frontend

```text
http://localhost:5173
```

### Step 5 — Explore

```text
Dashboard
   │
   ├── Transfers
   ├── Players
   ├── Clubs
   └── Analytics
```

---

## Current Data Scope

The project is designed to support football transfer analysis across multiple seasons.

The initial dataset focuses on:

```text
Competition:
Premier League

League ID:
39

Example Season:
2022
```

Additional seasons and clubs can be imported through the Laravel Artisan import commands.

---

## Future Improvements

Possible future development includes:

* Transfer market visualization
* Club spending analysis
* Player transfer timeline
* Transfer fee comparison
* Season-to-season transfer trends
* Club recruitment analysis
* Player movement network visualization
* More football leagues
* More seasons
* Advanced filtering
* Data export
* Automated scheduled data synchronization
* Advanced statistical analysis

---

## Learning Objectives

This project was developed to demonstrate practical experience with:

* REST API integration
* Laravel development
* React development
* Database design
* Eloquent ORM
* Data ingestion
* Data transformation
* Data analytics
* API rate-limit management
* Multi-season data processing
* Frontend-backend integration
* Git and GitHub workflow

---

## Project Status

**Status:** Active Development

The core transfer data pipeline, REST API, dashboard, player pages, club pages, and transfer analytics have been implemented.

The current development focus is expanding the dataset across multiple clubs and seasons while maintaining efficient API usage.

---

## License

This project is intended for educational and portfolio purposes.

Football data is provided through API-Football and remains subject to the provider's terms and conditions.
