# Google Ads Dashboard

A modern, responsive dashboard for managing Google Ads campaigns built with React, Vite, Tailwind CSS, and Lucide icons.

## 🚀 Features

- **Real Google Ads Integration**: Connect to your Google Ads account via OAuth
- **Live Data Dashboard**: View real-time campaign performance, keywords, and metrics
- **Modern React**: Built with React 18 and modern hooks
- **Fast Development**: Powered by Vite for lightning-fast HMR
- **Beautiful UI**: Styled with Tailwind CSS for a clean, professional look
- **Interactive Charts**: Data visualization with Recharts
- **Icon System**: Uses Lucide React for consistent, beautiful icons
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **OAuth Authentication**: Secure Google OAuth 2.0 integration
- **TypeScript Ready**: Configured for TypeScript development (optional)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: Google OAuth 2.0
- **API Integration**: Google Ads API v17
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

3. **Set up environment variables**:
   Create a `.env` file in the root directory with your Google Ads API credentials:
   ```env
   # Google Ads API Configuration
   VITE_GOOGLE_ADS_CLIENT_ID=your_client_id
   VITE_GOOGLE_MCC_TOKEN=your_mcc_token

   GOOGLE_ADS_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET=your_oauth_client_secret

   GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
   GOOGLE_ADS_CUSTOMER_ID=your_customer_id

   # OAuth Configuration
   VITE_GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com
   VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

   **Important**: Replace the placeholder values with your actual Google Ads API credentials.

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
- **Google Ads Integration**: Real-time data from Google Ads API
- **OAuth Authentication**: Secure login with Google OAuth 2.0
- **Overview Dashboard**: Key metrics and statistics display with interactive charts
- **Campaign Management**: View campaign performance, status, and metrics
- **Keyword Analysis**: Track keyword performance and optimization opportunities
- **Navigation Tabs**: Overview, Campaigns, Keywords, Reports
- **Responsive Stats Cards**: Display important KPIs with icons and trend indicators
- **Interactive Charts**: Campaign performance visualization with Recharts
- **Modern UI Components**: Clean, professional interface design
- **Real-time Data Refresh**: Manual refresh capability for latest data

### Metrics Displayed
- Total Spend with trend indicators
- Impressions count with campaign breakdown
- Click-through rates and click counts
- Conversion tracking and analysis
- Cost-per-click (CPC) analysis
- Campaign type distribution

### Authentication Features
- **OAuth 2.0 Flow**: Secure Google authentication
- **Token Management**: Automatic token refresh
- **Connection Status**: Visual indicators for connection state
- **Demo Mode**: Fallback to demo data when not connected

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
│   ├── components/
│   │   ├── AuthComponent.jsx    # OAuth authentication UI
│   │   └── Charts.jsx           # Data visualization components
│   ├── services/
│   │   ├── googleAdsService.js  # Google Ads API integration
│   │   └── googleAuthService.js # OAuth authentication service
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles (Tailwind imports)
├── .env                         # Environment variables (not in repo)
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # This file
```

## 🌟 Future Enhancements

- Advanced filtering and search capabilities
- Automated reporting and email notifications
- Budget optimization recommendations
- A/B testing for ad variations
- Competitor analysis integration
- Mobile app companion
- Advanced data export options
- Custom dashboard layouts
- Multi-account management
- Real-time alerts and notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
