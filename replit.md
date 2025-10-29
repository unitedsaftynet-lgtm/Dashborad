# Discord Bot Dashboard

An advanced Discord bot dashboard for managing partnerships, analytics, and server configurations.

## Project Overview

This is a full-stack web application that provides a comprehensive dashboard for Discord bot management. Users can authenticate with Discord, select a server, and configure various bot settings including partnerships, channels, categories, and premium features.

## Tech Stack

- **Frontend**: React with TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js, Discord.js
- **Styling**: Tailwind CSS, Shadcn UI components
- **Storage**: In-memory storage (MemStorage)
- **Authentication**: Discord OAuth2 integration via Replit Connectors

## Current Implementation Status

### ✅ Completed Features

**Frontend:**
- ✅ All data schemas and TypeScript interfaces
- ✅ Complete UI for all pages (server selector, dashboard, analytics, configs)
- ✅ Sidebar navigation with server branding
- ✅ Form components with validation and error handling
- ✅ Responsive design implementation
- ✅ **Form state persistence** - All config forms now correctly load and display saved values

**Backend:**
- ✅ Discord API integration (user info, servers, channels, server details)
- ✅ All API endpoints for CRUD operations
- ✅ Analytics data generation
- ✅ Configuration storage and caching

**Integration:**
- ✅ All pages connected to backend APIs
- ✅ Loading states and error handling
- ✅ Form validation with real-time feedback
- ✅ Application running successfully

### 🔄 Authentication Approach

**Current Implementation:**
The application uses Replit Discord Connector for authentication. This provides:
- Single-user authentication (the connector owner)
- Access to all servers the authenticated user is in
- Server selection and configuration management
- Suitable for personal bot dashboard use

**For Multi-User Support:**
If you need multiple users to log in with their own Discord accounts, you would need:
1. Implement Discord OAuth2 authorization code flow
2. Add session management (cookies + session store)
3. Per-user token storage and scoping
4. User-specific configuration isolation

## Features

### Authentication & Server Selection
- Discord authentication via Replit Connector
- Server selector showing all servers user has access to
- Persistent server selection via localStorage

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

## Recent Changes

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
