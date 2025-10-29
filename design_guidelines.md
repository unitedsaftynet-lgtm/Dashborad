# Discord Bot Dashboard Design Guidelines

## Design Approach

**Selected Approach:** Design System (Fluent Design) + Discord Visual Language

**Justification:** This dashboard is utility-focused with information-dense interfaces requiring efficiency and learnability. Drawing inspiration from Discord's own interface ensures familiarity for the target user base, while Fluent Design principles provide structure for complex data visualization and form management.

**Key Design Principles:**
1. **Functional Clarity** - Every element serves a clear purpose in bot management
2. **Consistent Hierarchy** - Standardized patterns across all configuration pages
3. **Efficient Workflows** - Minimize clicks to accomplish common tasks
4. **Discord Native Feel** - Visual language that feels at home with Discord's ecosystem

---

## Core Design Elements

### A. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (clean, readable for data/forms)
- Monospace: 'JetBrains Mono', 'Courier New', monospace (for IDs, codes, links)

**Hierarchy:**
- Page Titles: 32px, weight 700, tracking -0.02em
- Section Headers: 24px, weight 600
- Card Titles: 18px, weight 600
- Body Text: 15px, weight 400, line-height 1.6
- Labels: 13px, weight 500, uppercase with letter-spacing 0.05em
- Small Text/Captions: 12px, weight 400

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, and 12
- Tight spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4 (between related elements)
- Section spacing: p-6, gap-6 (card interiors)
- Large spacing: p-8, gap-8 (between major sections)
- Extra large: p-12 (page margins)

**Grid Structure:**
- Dashboard Layout: Persistent left sidebar (240px fixed) + main content area
- Content Max-Width: max-w-7xl with px-6 or px-8
- Card Grids: 2-column on desktop (grid-cols-2 gap-6), single-column on mobile
- Analytics Cards: 3-4 column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)

---

## C. Component Library

### Navigation & Structure

**Top Bar:**
- Height: h-16
- Contains: Server selector (left), user profile dropdown (right)
- Server selector: Dropdown button showing current server icon + name
- Profile: Avatar thumbnail + username + logout option

**Sidebar Navigation:**
- Width: w-60 (240px)
- Sticky positioning with overflow-y-auto
- Nav items: p-3, rounded-lg, flex items with icon (20px) + label
- Active state: Distinct treatment without glow effects
- Sections: Dashboard, Analytics, Configurations (collapsible group), Premium
- Each config sub-item indented with pl-8

**Page Container:**
- Padding: p-8 on desktop, p-4 on mobile
- Vertical spacing between sections: space-y-6

### Data Display Components

**Stat Cards (Analytics Page):**
- Aspect: Rectangular cards in grid layout
- Structure: Icon/visual indicator (top-left), large metric number, label below, optional trend indicator
- Padding: p-6
- Border treatment: 1px border, rounded-xl

**Server Info Card:**
- Two-column layout: Server icon/banner (left), details list (right)
- Details: Member count, boost level, verification status, creation date
- Icon size: 80px × 80px, rounded-lg

**Charts/Growth Visualizations:**
- Use chart.js or similar library for line/bar charts
- Contained in cards with p-6 padding
- Title above chart (text-lg font-semibold mb-4)
- Height: h-64 to h-80 for optimal data visibility

### Forms & Configuration

**Form Layouts:**
- Single-column for most configs: space-y-6 between form groups
- Form Group Structure: Label (mb-2), Input/Component, Helper text (mt-1, text-sm)

**Input Fields:**
- Height: h-12 for text inputs
- Padding: px-4
- Border: 1px border, rounded-lg
- Focus state: 2px border (no glow/shadow)
- Full width: w-full with max-width constraints where appropriate

**Text Area (Ad Description):**
- Min height: h-32
- Character counter: Positioned bottom-right, text-xs
- Max characters: 4000 displayed as "0/4000"

**Channel Selectors:**
- Custom dropdown component mimicking Discord's channel picker
- Shows channel icon + # + channel name
- Grouped by category if categories exist
- Height: h-12

**Link Inputs:**
- Pattern: Input field + "Test Link" button adjacent (inline-flex gap-2)
- For multiple links: Vertical stack with "Add Link" option (max 2)
- Validation indicator: Icon on right side of input

**Image Upload (Ad Banner):**
- Two-tab interface: "Upload Image" | "Image URL"
- Upload: Drag-and-drop zone (h-40) with centered icon + text
- Preview: Shows uploaded/linked image below input (max-h-48, rounded-lg)

**Category Selector:**
- Radio button group or segmented control
- Options displayed in grid: grid-cols-2 md:grid-cols-3 gap-4
- Each option: p-4 card with icon + label

### Premium Components

**Color Picker:**
- Custom component or native input type="color"
- Display: Color preview circle (48px diameter) + hex input field (w-32)
- Inline layout: flex items-center gap-4

**Toggle Switches:**
- Modern toggle design: w-12 h-6 with sliding circle
- Label positioned left of toggle: flex items-center justify-between
- Each toggle in card: p-4 with border-b (except last)
- Stack vertically: space-y-0 (borders create separation)

### Actions & Buttons

**Primary Actions:**
- Height: h-11
- Padding: px-6
- Font: 15px, weight 500
- Rounded: rounded-lg
- Width: Auto-width with px padding, or full-width (w-full) for mobile

**Secondary Actions:**
- Same dimensions as primary
- Outlined variant: 1px border

**Icon Buttons:**
- Size: h-10 w-10
- Icon size: 20px
- Rounded: rounded-lg

**Save/Submit Buttons:**
- Position: Sticky bottom bar (bottom-0, h-20, border-t) OR at end of page
- Arrangement: flex justify-end gap-4 (Cancel + Save)

### Status & Feedback

**Request Status Badges:**
- Inline badges: px-3 py-1, rounded-full, text-xs font-medium
- States: Pending, Approved, Rejected
- Used in lists and analytics displays

**Empty States:**
- Centered content: Illustrative icon (64px), heading, description, CTA button
- For: No servers selected, no partnership requests, etc.

**Loading States:**
- Skeleton screens for data-heavy pages (Analytics)
- Spinner for form submissions: Inline with button text, 16px

---

## D. Animations

**Minimal Motion Philosophy:**
Use animations sparingly for functional feedback only:

- Navigation transitions: 150ms ease for active state changes
- Dropdown menus: 200ms ease slide-in from top
- Toggle switches: 200ms ease for circle movement
- Modal/dialog entry: 250ms ease fade + scale
- Hover states: Instant visual change, no transitions
- Page transitions: None (instant content swap)

**Explicitly Avoid:**
- Glowing effects
- Pulsing animations
- Elaborate entrance animations
- Parallax scrolling
- Hover lift/shadow effects

---

## Page-Specific Layouts

### Server Selector Gate (Entry Point)
- Centered modal/card on neutral background
- Discord OAuth button (w-80, h-12)
- After auth: Grid of user's servers (grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4)
- Each server: Icon + name in card, p-4, clickable

### Main Dashboard Page
- 2-column layout: Left (2/3 width) = Quick stats + Recent activity, Right (1/3) = Server summary card
- Quick stats: 4-card grid showing key metrics
- Recent activity: List/table of recent partnership requests/bumps

### Analytics Page
- Top row: 4 stat cards (grid-cols-4 gap-6) - Growth, Sent, Received, Reputation
- Second row: 3 cards (grid-cols-3) - Total Partnerships, Pending, Approved/Rejected split
- Third row: 2 columns - Growth chart (2/3 width) + Server Info card (1/3)

### Configuration Pages
- Single-column form layout: max-w-3xl mx-auto
- Sections grouped in cards with section headers
- Consistent vertical rhythm: space-y-6 between cards
- Sticky save bar at bottom

---

## Images

**No Hero Images Required** - This is a dashboard application, not a marketing site.

**Functional Images:**
1. **Server Icons** - Throughout interface (40px × 40px in selectors, 80px × 80px in info cards)
2. **User Avatars** - Top bar and profile areas (32px × 32px)
3. **Ad Banner Preview** - In Main Config page, displays user-uploaded promotional banner (max-h-48)
4. **Empty State Illustrations** - Simple iconography for no-data scenarios (64px × 64px, can be icon font)

All functional - no decorative imagery needed.