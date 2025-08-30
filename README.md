# BadBudget - AI-Powered Personal Budgeting Tool

A modern, intelligent personal budgeting application that uses AI to dynamically allocate funds between variable costs and investments based on your spending patterns.

## 🚀 Features

### Core Functionality
- **Guided Onboarding**: Simple 3-step setup process for income, investment goals, and fixed expenses
- **AI-Powered Allocation**: Intelligent budget allocation that learns from your spending habits
- **Expense Classification**: Categorize expenses as living expenses or liabilities with detailed subcategories
- **Daily Expense Tracking**: Log and categorize daily expenses with intuitive interface
- **Real-time Insights**: Visual charts and analytics showing spending patterns
- **Dark Mode Support**: Beautiful dark/light theme toggle
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### AI Intelligence
- **Pattern Recognition**: Analyzes historical spending to optimize future allocations
- **Adaptive Budgeting**: Automatically adjusts variable/investment splits based on spending efficiency
- **Smart Recommendations**: Provides reasoning for allocation decisions
- **Goal Respect**: Ensures investment allocations stay within user-defined ranges

### Data Privacy
- **Local Storage**: All data stored locally on your device using localStorage
- **No Cloud Dependencies**: Complete privacy with no external data transmission
- **Offline Capable**: Works without internet connection

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for beautiful, consistent icons
- **Build Tool**: Create React App
- **State Management**: React hooks with localStorage persistence

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BadBudget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

## 🏗️ Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

## 📱 Usage

### Initial Setup
1. **Income & Goals**: Enter your monthly income and set investment goal ranges
2. **Fixed Expenses**: Add your recurring expenses (rent, utilities, loans, etc.)
3. **Review**: Confirm your setup and let AI calculate your optimal budget

### Daily Usage
1. **Dashboard Overview**: View your budget allocation and spending insights
2. **Add Expenses**: Click "Add Expense" to log daily spending
3. **Track Progress**: Monitor spending against AI-allocated budgets
4. **Learn & Adapt**: AI improves recommendations based on your spending patterns

### Features
- **Dark Mode**: Toggle between light and dark themes
- **Reset Data**: Use the settings button to start fresh
- **Responsive**: Works on all device sizes
- **Real-time Updates**: Changes save automatically

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main brand color
- **Accent**: Green (#22C55E) - Success and positive actions
- **Neutral**: Gray scale for backgrounds and text
- **Semantic**: Red for warnings, green for success, blue for info

### Typography
- **Font**: Inter - Clean, readable sans-serif
- **Hierarchy**: Clear size and weight variations
- **Responsive**: Scales appropriately across devices

### Components
- **Cards**: Clean, rounded containers with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible inputs with clear labels
- **Charts**: Interactive data visualizations

## 📊 Data Structure

The application stores all data in localStorage as a single JSON object:

```typescript
interface AppData {
  userId: string;
  income: number;
  investmentGoals: {
    min: number;
    max: number;
  };
  fixedCosts: FixedCost[];
  currentBudget: {
    month: string;
    variableAllocated: number;
    investmentAllocated: number;
  };
  spendingHistory: SpendingHistory[];
}
```

## 🤖 AI Allocation Logic

The AI system uses several algorithms to optimize budget allocation:

1. **Historical Analysis**: Analyzes past spending patterns
2. **Trend Detection**: Identifies increasing/decreasing spending trends
3. **Efficiency Scoring**: Measures spending efficiency vs. allocations
4. **Goal Optimization**: Ensures investment goals are met
5. **Adaptive Learning**: Adjusts recommendations based on user behavior

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard
│   └── Onboarding.tsx  # Setup wizard
├── types/              # TypeScript definitions
├── utils/              # Utility functions
│   ├── storage.ts      # localStorage management
│   └── aiAllocation.ts # AI logic
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

### Key Components
- **Onboarding**: Multi-step setup wizard
- **Dashboard**: Main application interface
- **AI Allocation**: Intelligent budget calculation
- **Storage Utils**: Data persistence management

### Adding Features
1. Update TypeScript interfaces in `types/index.ts`
2. Add utility functions in `utils/`
3. Create new components in `components/`
4. Update main App component as needed

## 🚀 Deployment

### V0 Platform
This application is designed to be deployable on V0 platform:
- Single-page application structure
- Standard web technologies
- No external dependencies beyond npm packages
- Responsive design for all devices

### Other Platforms
The application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

## 📈 Future Enhancements

- **Export Data**: CSV/PDF export functionality
- **Budget Templates**: Pre-built budget categories
- **Notifications**: Spending alerts and reminders
- **Multi-currency**: Support for different currencies
- **Backup/Restore**: Data backup capabilities
- **Advanced Analytics**: More detailed spending insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**BadBudget** - Making personal finance intelligent and accessible. 💰✨
