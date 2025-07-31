import { HelpCircle } from "lucide-react";
import { useState } from "react";

export const DocumentationPanel = () => {
  const [showDocs, setShowDocs] = useState(false);

  const fieldExamples = {
    'firstName': 'John, Sarah, Michael',
    'email': 'user@domain.com (specify domain in options)',
    'age': 'Use options: "18-65" for age range',
    'date': 'Format: YYYY-MM-DD, use options for year range',
    'number': 'Use options: "1-100" for number range',
    'custom': 'Use options: "value1,value2,value3" for choices',
    'currency': 'Use options: "10-1000" for price range',
    'creditCard': 'Generates valid credit card numbers',
    'image': 'Returns placeholder image URLs',
    'color': 'Returns hex color codes (#ffffff)',
    'pattern': 'Use pattern field for regex generation',
    'unique': 'Check unique option to avoid duplicates',
    'distribution': 'Choose normal, uniform, or exponential for numbers',
  };

  return (
    <div>
      <button
        onClick={() => setShowDocs(!showDocs)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg 
          dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white
            border-gray-300 hover:bg-gray-50
        `}
      >
        <HelpCircle className="h-4 w-4" />
        Documentation
      </button>

      {showDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto 
            dark:bg-gray-800 bg-white
          `}>
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-2xl font-bold 
                dark:text-white text-gray-900
              `}>
                Fake Data Generator Documentation
              </h2>
              <button
                onClick={() => setShowDocs(false)}
                className={'dark:text-gray-300 dark:hover:text-white text-gray-500 hover:text-gray-700'}
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className={`text-lg font-semibold mb-3 
                  dark:text-white text-gray-900
                `}>
                  Getting Started
                </h3>
                <ol className={`list-decimal list-inside space-y-2 
                  dark:text-gray-300 text-gray-700
                `}>
                  <li>Add fields using the "Add Field" button</li>
                  <li>Configure each field with name, type, and options</li>
                  <li>Set the number of records to generate</li>
                  <li>Click "Generate Data" to create fake data</li>
                  <li>Preview and export your data</li>
                </ol>
              </section>

              <section>
                <h3 className={`text-lg font-semibold mb-3 
                  dark:text-white text-gray-900
                `}>
                  Field Types & Examples
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(fieldExamples).map(([field, description]) => (
                    <div
                      key={field}
                      className={`p-3 rounded-lg 
                        dark:bg-gray-700 bg-gray-50
                      `}
                    >
                      <h4 className={`font-medium capitalize 
                        dark:text-white text-gray-900
                      `}>
                        {field.replace(/([A-Z])/g, ' $1')}
                      </h4>
                      <p className={`text-sm mt-1 
                        dark:text-gray-300 text-gray-600
                      `}>
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className={`text-lg font-semibold mb-3 
                  dark:text-white text-gray-900
                `}>
                  Advanced Features
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className={`font-medium 
                      dark:text-white text-gray-900
                    `}>
                      NULL Values
                    </h4>
                    <p className={`text-sm 
                      dark:text-gray-300 text-gray-600
                    `}>
                      Set percentage of NULL values using the % field (0-100)
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium 
                      dark:text-white text-gray-900
                    `}>
                      Unique Values
                    </h4>
                    <p className={`text-sm 
                      dark:text-gray-300 text-gray-600
                    `}>
                      Enable unique constraint in advanced options to prevent duplicates
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium 
                      dark:text-white text-gray-900
                    `}>
                      Pattern Matching
                    </h4>
                    <p className={`text-sm 
                      dark:text-gray-300 text-gray-600
                    `}>
                      Use regular expressions for string fields (e.g., [A-Z]{3}-\\d{4})
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium 
                      dark:text-white text-gray-900
                    `}>
                      Data Distribution
                    </h4>
                    <p className={`text-sm 
                      dark:text-gray-300 text-gray-600
                    }`}>
                      Choose normal, uniform, or exponential distribution for numeric fields
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className={`text-lg font-semibold mb-3 
                  dark:text-white text-gray-900
                `}>
                  Templates
                </h3>
                <p className={`mb-2 
                  dark:text-gray-300 text-gray-700
                `}>
                  Use built-in templates or save your own configurations:
                </p>
                <ul className={`list-disc list-inside space-y-1 
                  dark:text-gray-300 text-gray-600
                `}>
                  <li><strong>User Profile:</strong> Basic user information with contact details</li>
                  <li><strong>Product Catalog:</strong> E-commerce product data structure</li>
                  <li><strong>Order Management:</strong> Order and transaction data</li>
                  <li><strong>Social Media:</strong> User posts and interactions</li>
                  <li><strong>Inventory:</strong> Product stock and warehouse data</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};