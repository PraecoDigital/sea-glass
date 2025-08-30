import React, { useState } from 'react';
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit3 } from 'lucide-react';
import { AppData, CustomSubcategory, ExpenseType, LIVING_EXPENSE_SUBCATEGORIES, LIABILITY_SUBCATEGORIES, INVESTMENT_SUBCATEGORIES } from '../types/index.ts';

interface ConfigurationProps {
  data: AppData;
  onDataUpdate: (data: AppData) => void;
  onBackToDashboard: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ data, onDataUpdate, onBackToDashboard }) => {
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    icon: '📦',
    type: 'living-expense' as ExpenseType,
  });
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');

  const handleAddCustomSubcategory = () => {
    if (!newSubcategory.name) return;

    const customSubcategory: CustomSubcategory = {
      id: Date.now().toString(),
      name: newSubcategory.name,
      icon: newSubcategory.icon,
      type: newSubcategory.type,
      isVisible: true,
    };

    const updatedData = {
      ...data,
      customSubcategories: [...data.customSubcategories, customSubcategory],
    };

    onDataUpdate(updatedData);
    setNewSubcategory({ name: '', icon: '📦', type: 'living-expense' });
  };

  const handleToggleSubcategoryVisibility = (subcategoryId: string) => {
    const updatedData = {
      ...data,
      customSubcategories: data.customSubcategories.map(sub => 
        sub.id === subcategoryId ? { ...sub, isVisible: !sub.isVisible } : sub
      ),
    };
    onDataUpdate(updatedData);
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    const updatedData = {
      ...data,
      customSubcategories: data.customSubcategories.filter(sub => sub.id !== subcategoryId),
    };
    onDataUpdate(updatedData);
  };

  const handleEditSubcategory = (subcategory: CustomSubcategory) => {
    setEditingSubcategory(subcategory.id);
    setEditingSubcategoryName(subcategory.name);
  };

  const handleSaveEdit = (subcategoryId: string, updatedName: string, updatedIcon: string) => {
    const updatedData = {
      ...data,
      customSubcategories: data.customSubcategories.map(sub => 
        sub.id === subcategoryId ? { ...sub, name: updatedName, icon: updatedIcon } : sub
      ),
    };
    onDataUpdate(updatedData);
    setEditingSubcategory(null);
    setEditingSubcategoryName('');
  };

  const handleEditBuiltInSubcategory = (subcategoryName: string, type: ExpenseType) => {
    setEditingSubcategory(subcategoryName);
    setEditingSubcategoryName(subcategoryName);
  };

  const handleSaveBuiltInSubcategory = (oldName: string, newName: string, type: ExpenseType) => {
    if (!newName.trim()) return;

    const updatedData = { ...data };
    
    // Update fixed costs
    updatedData.fixedCosts = updatedData.fixedCosts.map(cost => 
      cost.subCategory === oldName ? { ...cost, subCategory: newName } : cost
    );
    
    // Update spending history
    updatedData.spendingHistory = updatedData.spendingHistory.map(month => ({
      ...month,
      dailyExpenses: month.dailyExpenses.map(expense => 
        expense.subCategory === oldName ? { ...expense, subCategory: newName } : expense
      ),
    }));
    
    onDataUpdate(updatedData);
    setEditingSubcategory(null);
    setEditingSubcategoryName('');
  };

  const getSubcategoriesByType = (type: ExpenseType) => {
    const builtInSubcategories = type === 'living-expense' 
      ? LIVING_EXPENSE_SUBCATEGORIES 
      : type === 'liability' 
        ? LIABILITY_SUBCATEGORIES 
        : INVESTMENT_SUBCATEGORIES;
    
    const customSubcategories = data.customSubcategories.filter(sub => sub.type === type);
    
    return [...builtInSubcategories, ...customSubcategories];
  };

  const getVisibleSubcategories = (type: ExpenseType) => {
    const allSubcategories = getSubcategoriesByType(type);
    const customSubcategories = data.customSubcategories.filter(sub => sub.type === type);
    
    return allSubcategories.filter(sub => {
      const customSub = customSubcategories.find(cs => cs.name === sub.name);
      return !customSub || customSub.isVisible;
    });
  };

  const iconOptions = ['📦', '🍎', '🚗', '⚡', '🎬', '🏥', '🐕', '☕', '🍽️', '🛍️', '🏠', '🚙', '🎓', '💳', '🛡️', '💰', '📈', '🏦', '📊', '📋', '🏘️', '₿', '🛟', '💎', '🎯', '⭐', '🔥', '💡', '🎨', '🎵', '📚'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBackToDashboard}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuration</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Custom Subcategory */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Custom Subcategory</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={newSubcategory.name}
              onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
              className="input-field"
              placeholder="Subcategory name"
            />
            <select
              value={newSubcategory.icon}
              onChange={(e) => setNewSubcategory({ ...newSubcategory, icon: e.target.value })}
              className="input-field"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <select
              value={newSubcategory.type}
              onChange={(e) => setNewSubcategory({ ...newSubcategory, type: e.target.value as ExpenseType })}
              className="input-field"
            >
              <option value="living-expense">Living Expense</option>
              <option value="liability">Liability</option>
              <option value="investment">Investment</option>
            </select>
            <button
              onClick={handleAddCustomSubcategory}
              disabled={!newSubcategory.name}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Subcategory Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Living Expenses */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Living Expenses</h3>
                         <div className="space-y-2">
               {getSubcategoriesByType('living-expense').map((subcategory) => {
                 const customSub = data.customSubcategories.find(cs => cs.name === subcategory.name);
                 const isCustom = !!customSub;
                 const isVisible = !customSub || customSub.isVisible;

                 return (
                   <div key={subcategory.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                     <div className="flex items-center">
                       <span className="text-lg mr-2">{subcategory.icon}</span>
                       <span className="text-sm font-medium text-gray-900 dark:text-white">
                         {editingSubcategory === (customSub?.id || subcategory.name) ? (
                           <input
                             type="text"
                             value={editingSubcategoryName}
                             onChange={(e) => setEditingSubcategoryName(e.target.value)}
                             onBlur={() => {
                               if (isCustom) {
                                 handleSaveEdit(customSub.id, editingSubcategoryName, subcategory.icon);
                               } else {
                                 handleSaveBuiltInSubcategory(subcategory.name, editingSubcategoryName, 'living-expense');
                               }
                             }}
                             onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                 if (isCustom) {
                                   handleSaveEdit(customSub.id, editingSubcategoryName, subcategory.icon);
                                 } else {
                                   handleSaveBuiltInSubcategory(subcategory.name, editingSubcategoryName, 'living-expense');
                                 }
                               }
                             }}
                             className="input-field text-sm"
                             autoFocus
                           />
                         ) : (
                           subcategory.name
                         )}
                       </span>
                       {isCustom && (
                         <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                           Custom
                         </span>
                       )}
                     </div>
                     <div className="flex items-center space-x-2">
                       <button
                         onClick={() => {
                           if (isCustom) {
                             handleEditSubcategory(customSub);
                           } else {
                             handleEditBuiltInSubcategory(subcategory.name, 'living-expense');
                           }
                         }}
                         className="text-blue-500 hover:text-blue-700"
                       >
                         <Edit3 className="w-4 h-4" />
                       </button>
                       {isCustom && (
                         <>
                           <button
                             onClick={() => handleToggleSubcategoryVisibility(customSub.id)}
                             className={isVisible ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                           >
                             {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                           </button>
                           <button
                             onClick={() => handleDeleteSubcategory(customSub.id)}
                             className="text-red-500 hover:text-red-700"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

          {/* Liabilities */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Liabilities</h3>
                         <div className="space-y-2">
               {getSubcategoriesByType('liability').map((subcategory) => {
                 const customSub = data.customSubcategories.find(cs => cs.name === subcategory.name);
                 const isCustom = !!customSub;
                 const isVisible = !customSub || customSub.isVisible;

                 return (
                   <div key={subcategory.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                     <div className="flex items-center">
                       <span className="text-lg mr-2">{subcategory.icon}</span>
                       <span className="text-sm font-medium text-gray-900 dark:text-white">
                         {editingSubcategory === (customSub?.id || subcategory.name) ? (
                           <input
                             type="text"
                             value={editingSubcategoryName}
                             onChange={(e) => setEditingSubcategoryName(e.target.value)}
                             onBlur={() => {
                               if (isCustom) {
                                 handleSaveEdit(customSub.id, editingSubcategoryName, subcategory.icon);
                               } else {
                                 handleSaveBuiltInSubcategory(subcategory.name, editingSubcategoryName, 'liability');
                               }
                             }}
                             onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                 if (isCustom) {
                                   handleSaveEdit(customSub.id, editingSubcategoryName, subcategory.icon);
                                 } else {
                                   handleSaveBuiltInSubcategory(subcategory.name, editingSubcategoryName, 'liability');
                                 }
                               }
                             }}
                             className="input-field text-sm"
                             autoFocus
                           />
                         ) : (
                           subcategory.name
                         )}
                       </span>
                       {isCustom && (
                         <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                           Custom
                         </span>
                       )}
                     </div>
                     <div className="flex items-center space-x-2">
                       <button
                         onClick={() => {
                           if (isCustom) {
                             handleEditSubcategory(customSub);
                           } else {
                             handleEditBuiltInSubcategory(subcategory.name, 'liability');
                           }
                         }}
                         className="text-blue-500 hover:text-blue-700"
                       >
                         <Edit3 className="w-4 h-4" />
                       </button>
                       {isCustom && (
                         <>
                           <button
                             onClick={() => handleToggleSubcategoryVisibility(customSub.id)}
                             className={isVisible ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                           >
                             {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                           </button>
                           <button
                             onClick={() => handleDeleteSubcategory(customSub.id)}
                             className="text-red-500 hover:text-red-700"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

          {/* Investments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investments</h3>
                         <div className="space-y-2">
               {getSubcategoriesByType('investment').map((subcategory) => {
                 const customSub = data.customSubcategories.find(cs => cs.name === subcategory.name);
                 const isCustom = !!customSub;
                 const isVisible = !customSub || customSub.isVisible;

                 return (
                   <div key={subcategory.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                     <div className="flex items-center">
                       <span className="text-lg mr-2">{subcategory.icon}</span>
                       <span className="text-sm font-medium text-gray-900 dark:text-white">
                         {editingSubcategory === (customSub?.id || subcategory.name) ? (
                           <input
                             type="text"
                             value={editingSubcategoryName}
                             onChange={(e) => setEditingSubcategoryName(e.target.value)}
                             onBlur={() => {
                               if (isCustom) {
                                 handleSaveEdit(customSub.id, editingSubcategoryName, subcategory.icon);
                               } else {
                                 handleSaveBuiltInSubcategory(subcategory.name, editingSubcategoryName, 'investment');
                               }
                             }}
                             onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                 if (isCustom) {
                                   handleSaveEdit(customSub.id, editingSubcategoryName, subcategory.icon);
                                 } else {
                                   handleSaveBuiltInSubcategory(subcategory.name, editingSubcategoryName, 'investment');
                                 }
                               }
                             }}
                             className="input-field text-sm"
                             autoFocus
                           />
                         ) : (
                           subcategory.name
                         )}
                       </span>
                       {isCustom && (
                         <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                           Custom
                         </span>
                       )}
                     </div>
                     <div className="flex items-center space-x-2">
                       <button
                         onClick={() => {
                           if (isCustom) {
                             handleEditSubcategory(customSub);
                           } else {
                             handleEditBuiltInSubcategory(subcategory.name, 'investment');
                           }
                         }}
                         className="text-blue-500 hover:text-blue-700"
                       >
                         <Edit3 className="w-4 h-4" />
                       </button>
                       {isCustom && (
                         <>
                           <button
                             onClick={() => handleToggleSubcategoryVisibility(customSub.id)}
                             className={isVisible ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                           >
                             {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                           </button>
                           <button
                             onClick={() => handleDeleteSubcategory(customSub.id)}
                             className="text-red-500 hover:text-red-700"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
