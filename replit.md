# Discord Bot Dashboard

An advanced Discord bot dashboard for managing partnerships, analytics, and server configurations.

## Project Overview

This is a full-stack web application that provides a comprehensive dashboard for Discord bot management. Users can authenticate with Discord, select a server, and configure various bot settings including partnerships, channels, categories, and premium features.

## Tech Stack

- **Frontend**: React with TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js, Discord.js, Express Session
- **Styling**: Tailwind CSS, Shadcn UI components (with Dark Mode support)
- **Storage**: In-memory storage (MemStorage)
- **Authentication**: Discord OAuth2 (Standard Authorization Code Flow) with bot credentials

## Current Implementation Status

### ✅ Completed Features

**Frontend:**
- ✅ All data schemas and TypeScript interfaces
- ✅ Complete UI for all pages (server selector, dashboard, analytics, configs)
- ✅ Sidebar navigation with server branding
- ✅ Form components with validation and error handling
- ✅ Responsive design implementation
- ✅ **Form state persistence** - All config forms correctly load and display saved values
- ✅ **Dark Mode** - Full light/dark theme support with toggle button
- ✅ **Theme Provider** - Context-based theme management with localStorage persistence
- ✅ **Login Page** - Discord OAuth login interface

**Backend:**
- ✅ Discord OAuth2 authentication flow (standard authorization code grant)
- ✅ Session management with express-session
- ✅ Discord API integration (user info, servers, channels, server details)
- ✅ Bot presence detection in servers
- ✅ Server filtering (only owned servers shown)
- ✅ Bot invite URL generation
- ✅ All API endpoints for CRUD operations with auth protection
- ✅ Analytics data generation
- ✅ Configuration storage and caching

**Integration:**
- ✅ All pages connected to backend APIs
- ✅ Loading states and error handling
- ✅ Form validation with real-time feedback
- ✅ Authentication guards on all protected routes
- ✅ Application running successfully

### 🔐 Authentication System

**Current Implementation (NEW!):**
The application uses standard Discord OAuth2 Authorization Code Flow with your Discord bot credentials. This provides:
- ✅ Multi-user authentication - any Discord user can log in
- ✅ Session-based authentication with express-session
- ✅ Server ownership filtering - only servers the user owns are shown
- ✅ Bot presence detection - shows which servers have the bot installed
- ✅ Bot invite functionality - easy one-click bot invitation to servers

**Required Environment Variables:**
- `DISCORD_CLIENT_ID` - Your Discord application's client ID
- `DISCORD_CLIENT_SECRET` - Your Discord application's client secret  
- `DISCORD_BOT_TOKEN` - Your Discord bot token
- `SESSION_SECRET` - (Optional) Custom session secret for production

**Authentication Flow:**
1. User clicks "Sign in with Discord" on the login page
2. Redirected to Discord for OAuth approval
3. Discord redirects back to `/api/auth/callback` with authorization code
4. Backend exchanges code for access token and stores in session
5. User can now access all protected routes with their Discord identity

**Server Filtering:**
- Only servers where the authenticated user is the **owner** are displayed
- Servers are sorted: bot-present servers first, then bot-absent servers
- Each server shows:
  - Owner badge
  - Bot active status (if bot is in the server)
  - "Manage" button (if bot is present) 
  - "Invite Bot" button (if bot is not present)

## Features

### Authentication & Server Selection
- Discord OAuth2 authentication with bot credentials
- Login page with "Sign in with Discord" button
- Server selector showing only servers where user is the owner
- Servers sorted by bot presence (bot-present servers first)
- Bot status badges and invite functionality
- Persistent server selection via localStorage
- Session-based authentication with automatic token refresh

### Main Dashboard
- Overview statistics (Growth, Sent/Received Requests, Reputation Score)
- Request overview (Total Partnerships, Pending, Approved, Rejected)
- Quick actions and guidance

### Analytics Page
- Comprehensive metrics display
  - Growth statistics
  - Partnership requests (sent/received)
  - Reputation score tracking
  - Approval/rejection statistics
- Server information card
  - Member count
  - Boost level
  - Verification level
  - Server creation date
- Performance summary with visual progress bars

### Configuration Pages

**Main Config**
- Ad title (embed title)
- Ad description (4000 character limit with counter)
- Discord invite link
- Additional links (up to 2)
- Banner image URL with preview
- ✅ Loads saved configurations correctly

**Channel Config**
- Partner channel selector
- Review channel selector
- Bump channel selector
- Log channel selector
- Dropdown selectors showing available text channels
- ✅ Loads saved configurations correctly

**Other Config**
- Category selection with icon grid
- 10 categories: Gaming, Technology, Music, Education, Community, Entertainment, Art & Design, Business, Lifestyle, Other
- ✅ Loads saved configurations correctly

**Premium Config**
- Embed color picker with hex input
- Auto-approve toggle
- Auto-bump toggle
- Auto-mass toggle
- Auto-burst toggle
- ✅ Loads saved configurations correctly

## API Endpoints

### Discord Integration
- `GET /api/discord/user` - Get authenticated user information
- `GET /api/discord/servers` - Get user's Discord servers
- `GET /api/discord/server-info/:serverId` - Get specific server details
- `GET /api/discord/channels/:serverId` - Get server channels

### Configuration Management
- `GET /api/config/:serverId` - Get server configuration
- `POST /api/config/main/:serverId` - Update main configuration
- `POST /api/config/channels/:serverId` - Update channel configuration
- `POST /api/config/other/:serverId` - Update other configuration
- `POST /api/config/premium/:serverId` - Update premium configuration

### Analytics
- `GET /api/analytics/:serverId` - Get analytics data for server

## Architecture

### Data Models
All schemas defined in `shared/schema.ts`:
- `DiscordUser` - User information from Discord
- `DiscordServer` - Server/guild information
- `DiscordChannel` - Channel information
- `MainConfig` - Advertisement configuration
- `ChannelConfig` - Channel assignments
- `OtherConfig` - Category selection
- `PremiumConfig` - Premium features and customization
- `ServerConfig` - Combined configuration
- `AnalyticsData` - Performance metrics
- `ServerInfo` - Server details from Discord API

### Storage Interface
In-memory storage with methods for:
- Server configuration CRUD operations
- Analytics data retrieval
- Channel caching
- Server info caching

### Routes Structure
- `/` - Server selector (if no server selected)
- `/dashboard` - Main dashboard overview
- `/analytics` - Analytics and metrics
- `/config/main` - Main advertisement configuration
- `/config/channels` - Channel configuration
- `/config/other` - Category and other settings
- `/config/premium` - Premium features

## Design System

Following Discord-inspired design with:
- Clean, functional UI without glowing effects
- Consistent spacing and typography
- Card-based layouts
- Sidebar navigation with server branding
- Responsive design for all screen sizes
- Form validation and user feedback
- Loading states and error handling

### Dark Mode System
- Light and dark themes with smooth transitions
- Theme toggle button in header (sun/moon icon)
- Theme preference stored in localStorage
- Full CSS variable system for theming
- All components support both light and dark modes

## Recent Changes

### Latest Updates - OAuth2 Authentication & Dark Mode (October 29, 2025)
- **Replaced Replit Connector with standard Discord OAuth2 flow**
  - Implemented authorization code grant flow
  - Added session management with express-session
  - Created login page with Discord OAuth button
  - Added authentication guards on all protected routes
  - Implemented automatic token refresh capability

- **Server Filtering & Bot Management**
  - Filter servers to show only those where user is the owner
  - Check bot presence in each server using Discord.js
  - Sort servers: bot-present first, then bot-absent
  - Added "Invite Bot" button for servers without the bot
  - Added "Manage" button for servers with the bot
  - Visual indicators (badges, icons) for bot status and ownership

- **Dark Mode Implementation**
  - Created ThemeProvider with React Context
  - Added theme toggle button in header
  - Theme persists in localStorage
  - Default theme is dark mode
  - All existing CSS already supports both themes

- **Backend Enhancements**
  - New endpoints: `/api/auth/url`, `/api/auth/callback`, `/api/auth/logout`, `/api/auth/status`
  - New endpoint: `/api/discord/bot-invite/:serverId?` for generating bot invite URLs
  - Updated all Discord endpoints to use session-based auth
  - Added `requireAuth` middleware for protected routes
  - Bot client connection management for server checks

## Recent Changes (Previous)

### Latest Updates - Form State Persistence
- **Fixed critical form loading bug**: Added `useEffect` hooks to all config pages
- Forms now correctly reset with saved values when config data loads
- Additional links state properly synchronized in Main Config
- All configuration forms working correctly with data persistence

### Backend Implementation
- Implemented Discord OAuth2 flow using Replit Connectors
- Created Discord API integration for fetching user guilds and guild details
- Built all API endpoints for configuration management
- Added channel and server info caching for performance
- Implemented analytics data generation
- Added comprehensive error handling in routes

### Frontend Implementation
- Created comprehensive data schemas for all configuration types
- Built all frontend pages with proper form validation
- Implemented server selector with Discord OAuth flow
- Created sidebar navigation with server context
- Added analytics dashboard with statistics visualization
- Implemented all configuration pages (Main, Channels, Other, Premium)

## User Preferences

- Clean, professional UI without glowing effects
- Discord-inspired design language
- Advanced features for bot management
- Comprehensive analytics tracking

## How to Use

1. **Initial Setup**: Connect your Discord account via Replit Connector
2. **Select Server**: Choose a Discord server from the server selector
3. **Configure Bot**: 
   - Set up your partnership ad in Main Config
   - Assign channels in Channel Config
   - Choose your server category in Other Config
   - Enable premium features in Premium Config
4. **Monitor Performance**: View analytics and statistics on the Dashboard and Analytics pages
5. **Edit Configurations**: Return to any config page to update your settings - saved values will load automatically

## Next Steps (Optional Enhancements)

- Implement multi-user OAuth flow for multiple dashboard users
- Add real Discord bot commands for partnership automation
- Implement actual partnership request sending/receiving
- Add historical analytics data tracking and graphs
- Create admin panel for bot management
