# Campus Security Monitoring System

A modern, AI-powered campus security monitoring system built with React, Tailwind CSS, and Framer Motion. This application provides real-time analytics, entity resolution, and anomaly detection for educational institutions.

## 🚀 Features

- **Modern UI/UX**: Built with React 18 and Tailwind CSS
- **Smooth Animations**: Powered by Framer Motion
- **Interactive Charts**: Real-time data visualization with Chart.js
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Particle Background**: Dynamic animated background
- **Real-time Dashboard**: Live activity monitoring
- **Analytics**: Comprehensive data insights and reporting
- **CCTV Integration**: AI-powered face detection and tracking
- **Data Upload**: Support for Excel, CSV files
- **Search & Filter**: Advanced data filtering capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-security-monitoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navigation.jsx          # Navigation bar with mobile menu
│   ├── Hero.jsx               # Landing section with floating cards
│   ├── Dashboard.jsx          # Real-time statistics and activity feed
│   ├── Analytics.jsx          # Data visualization charts
│   ├── CCTV.jsx              # CCTV upload and AI detection
│   ├── Upload.jsx            # Data upload and processing
│   ├── DataTable.jsx         # Searchable data table
│   ├── Footer.jsx            # Footer with links and contact info
│   ├── LoadingOverlay.jsx    # Loading animation overlay
│   └── ParticleBackground.jsx # Animated particle background
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#6366f1` to `#8b5cf6`)
- **Secondary**: Purple gradient (`#a855f7` to `#ec4899`)
- **Accent**: Pink gradient (`#ec4899` to `#f472b6`)
- **Background**: Dark slate (`#0f172a`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- **Glass Cards**: Semi-transparent cards with backdrop blur
- **Gradient Text**: Animated gradient text effects
- **Floating Cards**: 3D hover effects with animations
- **Status Badges**: Color-coded status indicators

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🎯 Key Features

### Dashboard
- Real-time statistics with animated counters
- Live activity feed with status indicators
- Interactive stat cards with hover effects

### Analytics
- Activity timeline chart
- Anomaly distribution pie chart
- Location heatmap bar chart
- Weekly traffic radar chart

### CCTV Integration
- Drag & drop file upload
- AI detection features showcase
- Processing status indicators
- Support for video and image formats

### Data Management
- Excel/CSV file upload
- Sample data generation
- Export functionality
- Advanced search and filtering

## 🔧 Customization

### Adding New Components
1. Create component in `src/components/`
2. Import and use in `App.jsx`
3. Add navigation link in `Navigation.jsx`

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Use Tailwind classes for component styling

### Animations
- Use Framer Motion for component animations
- Add custom animations in `tailwind.config.js`
- Implement hover effects with Tailwind classes

## 📊 Data Flow

1. **Data Generation**: Sample data created in `App.jsx`
2. **State Management**: React hooks for local state
3. **Component Props**: Data passed down to child components
4. **Real-time Updates**: Simulated with setTimeout

## 🎨 Animation System

- **Page Transitions**: Smooth section transitions
- **Hover Effects**: Interactive element animations
- **Loading States**: Animated loading overlays
- **Particle Effects**: Dynamic background animations

## 🔍 Performance

- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code elimination
- **Optimized Builds**: Production-ready bundles
- **Lazy Loading**: Component-based code splitting

## 📱 Mobile Optimization

- **Touch Gestures**: Mobile-friendly interactions
- **Responsive Images**: Optimized for all screen sizes
- **Mobile Menu**: Collapsible navigation
- **Touch Targets**: Properly sized interactive elements

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: security@iitg.ac.in
- Phone: +91 (361) XXX-XXXX
- Location: IIT Guwahati, Assam

---

**Made with ❤️ for IIT Guwahati**
