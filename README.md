# Next.js TradeSmart Application Setup

This project has been set up using Next.js 13+ with the App Router, Tailwind CSS, and Lucide React for icons.

## File Structure

```
/app
  /globals.css        # Global CSS including Tailwind utilities and custom components
  /layout.js          # Root layout with HTML structure and metadata
  /page.js            # Home page that imports the TradeSmart component
/components
  /TradeSmart.jsx     # Main application component
tailwind.config.js    # Tailwind configuration
postcss.config.js     # PostCSS configuration for Tailwind
package.json          # Project dependencies and scripts
```

## Key Features

1. **Modern Next.js Structure**: Uses the App Router introduced in Next.js 13+
2. **Tailwind CSS**: All styling is done with Tailwind utility classes and custom components
3. **Client Components**: The main component is marked with 'use client' to enable client-side interactivity
4. **Responsive Design**: Mobile-first approach with responsive breakpoints
5. **Component Organization**: Clean separation between layout and component logic

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Dependencies

- Next.js 14.0.0
- React 18.2.0
- Lucide React for icons
- Tailwind CSS for styling

## Key Improvements from Original Code

1. Properly structured for Next.js 13+ App Router
2. All CSS moved to globals.css with proper Tailwind directives
3. Clean separation of concerns between files
4. 'use client' directive properly implemented
5. Path aliases configured for cleaner imports