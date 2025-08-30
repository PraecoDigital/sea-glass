# **Personal Budgeting Tool: AI-Powered Financial Allocation**

### **1\. Project Goal**

To create a single-page web application that serves as a personal budgeting tool. The primary innovation is an integrated AI component that dynamically allocates funds for variable costs and investments, while allowing users to define their fixed expenses upfront. Data will be stored locally on the user's device for privacy and ease of use.

### **2\. Core Features**

* **User Authentication:** Secure user registration and login system using Supabase authentication with email/password credentials.
* **User Setup:** A simple, guided onboarding process where the user inputs their total monthly income, sets a **minimum and maximum range for their investment goals**, and lists their fixed expenses.  
* **Expense Classification:** Fixed expenses are now classified as either **living expenses** (e.g., rent, utilities) or **liabilities** (e.g., car payment, student loans). Users can also define subcategories for living expenses, such as food, transportation, and pet supplies.  
* **Benchmark Percentages:** Financial health benchmarks for budget categories:
  * **Living Expenses:** 70% of income (recommended maximum)
  * **Liabilities:** 20% of income (recommended maximum)
  * **Investments:** 10% of income (recommended minimum)
* **Benchmark Comparison:** Real-time comparison between user's actual spending percentages and recommended benchmarks with visual indicators and status messages.
* **AI-Powered Allocation:** After fixed costs are deducted, an AI model will analyze the remaining funds. It will then propose a budget allocation for two primary categories:  
  * **Variable Costs:** Everyday expenses like groceries and gas.  
  * **Investments:** Savings goals or investment accounts. The AI's proposed allocation for investments will fall within the user-defined range.  
* **Budget Overview:** A dashboard view that visually presents the budget, showing the user's total income, total fixed costs, the AI-proposed allocations for variable costs and investments, and benchmark comparisons.
* **Daily Tracking:** A simple interface for the user to log their daily expenses, classifying them with the appropriate subcategory. This data will be used by the AI to learn and adjust future allocations.  
* **Historical Data & Insights:** The tool should store historical spending data to provide insights and trends over time.
* **Data Persistence:** Cloud-based data storage with automatic synchronization and local storage fallback for offline functionality.

### **3\. Technology Stack**

* **Frontend:**  
  * **Language:** TypeScript  
  * **Framework/Library:** React (or a similar modern framework)  
  * **Styling:** Tailwind CSS (for a clean, responsive, and utility-first design)  
* **Data Storage:**  
  * **Cloud Database:** Supabase (PostgreSQL) for user authentication and data persistence
  * **Client-Side:** localStorage API as fallback for offline functionality
  * **Data Model:** A single JSON object containing user information, fixed costs, AI allocations, historical spending records, and benchmark percentages
* **Authentication:**  
  * **Provider:** Supabase Auth with email/password authentication
  * **Features:** User registration, login, logout, and session management
* **AI/Logic:**  
  * The "AI" component will be a set of JavaScript functions that perform statistical analysis on the user's spending habits. It should not be a true remote LLM.  
  * The logic should dynamically adjust the variable/investment split based on historical spending data. For example, if the user consistently spends less on variable costs, the AI can propose a larger allocation to investments next month. A simple rule-based system or a basic regression model could be used.

### **4\. Data Structure**

The data structure includes both cloud storage (Supabase) and local storage (localStorage) with the following JSON object structure:

{  
  "user": {
    "id": "unique\_user\_id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "income": 3000,  
  "investmentGoals": {  
    "min": 500,  
    "max": 1500  
  },
  "benchmarkPercentages": {
    "livingExpenses": 70,
    "liabilities": 20,
    "investments": 10
  },
  "fixedCosts": \[  
    {  
      "id": "rent-1",  
      "name": "Rent",  
      "amount": 1000,  
      "type": "living-expense",
      "classification": "fixed",
      "subCategory": "Rent/Mortgage"
    },  
    {  
      "id": "car-2",  
      "name": "Car Payment",  
      "amount": 350,  
      "type": "liability",
      "classification": "fixed",
      "subCategory": "Car Payment"
    }  
  \],  
  "currentBudget": {  
    "month": "2024-08",  
    "variableAllocated": 800,  
    "investmentAllocated": 850  
  },  
  "spendingHistory": \[  
    {  
      "month": "2024-08",  
      "dailyExpenses": \[  
        {  
          "id": "expense-1",
          "date": "2024-08-20",  
          "category": "Living Expenses",  
          "subCategory": "Groceries",  
          "amount": 55.20,
          "classification": "variable"
        },  
        {  
          "id": "expense-2",
          "date": "2024-08-21",  
          "category": "Living Expenses",  
          "subCategory": "Coffee",  
          "amount": 4.50,
          "classification": "variable"
        }  
      \]  
    }  
  \],
  "customSubcategories": []
}

### **5\. UI/UX Considerations**

* **Responsive Design:** The application must be fully responsive and work seamlessly on desktop, tablet, and mobile devices using Tailwind's utility-first approach.  
* **V0 Compatibility:** The final application should be designed to be deployable on the V0 platform, which means adhering to standard web technologies and using a single-file structure if possible, or a simple component-based structure.

### **6\. UI/UX Design Specification**

The design should be clean, minimalist, and engaging to encourage daily use.

* **Color Palette:**  
  * **Primary:** A calm, professional color like a shade of blue or green (\#3B82F6 or \#22C55E).  
  * **Accent:** A complementary, vibrant color for call-to-action buttons.  
  * **Neutral:** Shades of grey for backgrounds, borders, and text to maintain a clean aesthetic.  
  * The design should support a **dark mode** for user preference.  
* **Typography:**  
  * Use a clean, readable sans-serif font. **Inter** is recommended for its versatility.  
  * Ensure a clear hierarchy with different font sizes and weights for titles, headings, and body text.  
* **Layout & Components:**  
  * **Dashboard:** The main dashboard should feature a prominent budget summary at the top, followed by interactive charts and benchmark comparisons. Key metrics (income, fixed costs, allocated funds, benchmark percentages) should be easily visible.  
  * **Input Forms:** Use clean, rounded input fields with clear labels and intuitive dropdown menus for categories and subcategories.  
  * **Data Visualization:** Use **charts** to visually represent data. A donut chart or a pie chart could show the budget breakdown, while a bar chart could visualize spending over time.  
  * **Benchmark Indicators:** Visual progress bars and status indicators showing comparison between user spending and recommended benchmarks with color-coded feedback (green for good, red for over budget).
  * **Icons:** Integrate icons from a library like **Lucide React** to enhance navigation and provide visual cues.  
  * **Animations:** Use subtle CSS animations and transitions for state changes, like when an element appears or a chart animates its data. This will create a more polished and responsive feel.  
  * **Buttons:** Style buttons with a distinct look, using the accent color for primary actions and subtle styles for secondary actions. Use rounded corners and a soft shadow for depth.