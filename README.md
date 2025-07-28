# Google Ads Dashboard

A modern, responsive dashboard for managing Google Ads campaigns built with React, Vite, Tailwind CSS, and Lucide icons.

## 🚀 Features

- **Modern React**: Built with React 18 and modern hooks
- **Fast Development**: Powered by Vite for lightning-fast HMR
- **Beautiful UI**: Styled with Tailwind CSS for a clean, professional look
- **Icon System**: Uses Lucide React for consistent, beautiful icons
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript Ready**: Configured for TypeScript development (optional)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Linting**: ESLint
- **Development**: Hot Module Replacement (HMR)

## 📦 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd googleadsdashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Project

### Development Mode
Start the development server with hot reload:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Build for Production
Create an optimized production build:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## 🎨 Dashboard Features

### Current Features
- **Overview Dashboard**: Key metrics and statistics display
- **Navigation Tabs**: Overview, Campaigns, Keywords, Reports
- **Responsive Stats Cards**: Display important KPIs with icons and trend indicators
- **Modern UI Components**: Clean, professional interface design

### Metrics Displayed
- Total Spend with trend indicators
- Impressions count
- Click-through rates
- Conversion tracking

## 🔧 Customization

### Adding New Components
Components are located in the `src/` directory. The main App component is in `src/App.jsx`.

### Styling
- Tailwind CSS classes are used throughout the application
- Custom styles can be added to `src/index.css`
- Tailwind configuration is in `tailwind.config.js`

### Icons
Lucide React icons are used throughout the application. To add new icons:
```jsx
import { IconName } from 'lucide-react'
```

## 📁 Project Structure

```
googleadsdashboard/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles (Tailwind imports)
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── eslint.config.js     # ESLint configuration
└── README.md           # This file
```

## 🌟 Future Enhancements

- Integration with Google Ads API
- Real-time data updates
- Advanced filtering and search
- Data visualization with charts
- Campaign management features
- Keyword optimization tools
- Automated reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
