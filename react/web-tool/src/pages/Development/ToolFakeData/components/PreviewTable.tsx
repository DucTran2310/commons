import { useFieldStore } from "@/lib/store";
import { useState } from "react";
// import { CSVLink } from "react-csv";

export const PreviewTable = () => {
  const store = useFieldStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    store.fields.map(field => field.name)
  );

  if (!store.generatedData || store.generatedData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 dark:'text-gray-400 text-gray-500}`}>
        No data generated yet. Configure fields and click "Generate Data".
      </div>
    );
  }

  // Filter data based on search term
  const filteredData = store.generatedData.filter(row =>
    Object.values(row).some(val =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // CSV data preparation
  const csvData = [
    selectedColumns, // headers
    ...store.generatedData.map(row =>
      selectedColumns.map(col => row[col]?.toString() || ''))
  ];

  const toggleColumn = (columnName: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(col => col !== columnName)
        : [...prev, columnName]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2
              dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white 
                bg-white border-gray-300 focus:ring-blue-500
            `}
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
              dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
                bg-white border-gray-300 focus:ring-blue-500
            `}
          >
            {[5, 10, 20, 50, 100].map(size => (
              <option key={size} value={size}>Show {size}</option>
            ))}
          </select>

          <div className="relative group">
            <button
              className={`px-3 py-2 border rounded-lg flex items-center gap-1 
                dark:'bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 text-white
                  bg-white border-gray-300 hover:bg-gray-50
              `}
            >
              <span>Columns</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 hidden group-hover:block
              dark:bg-gray-700 bg-white
            border dark:border-gray-600 border-gray-200`}>
              <div className="p-2 max-h-60 overflow-y-auto">
                {store.fields.map(field => (
                  <label key={field.id} className="flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(field.name)}
                      onChange={() => toggleColumn(field.name)}
                      className="mr-2"
                    />
                    <span className="dark:text-white">{field.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* <CSVLink
            data={csvData}
            filename="fake_data.csv"
            className={`px-3 py-2 border rounded-lg flex items-center gap-1 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            Export CSV
          </CSVLink> */}
        </div>
      </div>

      <div className={`border rounded-lg overflow-hidden 
        dark:border-gray-700 border-gray-200
      `}>
        <div className="overflow-auto max-h-[calc(100vh-300px)]">
          <table className="w-full">
            <thead className={`sticky top-0 
              dark:bg-gray-700 bg-gray-50
            `}>
              <tr>
                {store.fields
                  .filter(field => selectedColumns.includes(field.name))
                  .map((field) => (
                    <th
                      key={field.id}
                      className={`px-4 py-2 text-left text-sm font-medium 
                        dark:text-white text-gray-900
                      }`}
                    >
                      {field.name}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className={`divide-y 
              dark:divide-gray-700 : divide-gray-200
            `}>
              {currentData.map((row, i) => (
                <tr
                  key={startIndex + i}
                  className="dark:hover:bg-gray-700 hover:bg-gray-50"
                >
                  {store.fields
                    .filter(field => selectedColumns.includes(field.name))
                    .map((field) => (
                      <td
                        key={field.id}
                        className={`px-4 py-2 text-sm whitespace-nowrap max-w-xs overflow-hidden text-ellipsis 
                          dark:text-gray-300 text-gray-900
                        `}
                      >
                        {row[field.name] === null ? (
                          <span className={`italic 
                            dark:text-gray-400  text-gray-500
                          `}>null</span>
                        ) : typeof row[field.name] === 'object' ? (
                          <span className={"dark:text-blue-400 text-blue-600"}>
                            {Array.isArray(row[field.name]) ? '[Array]' : '{Object}'}
                          </span>
                        ) : (
                          row[field.name]?.toString()
                        )}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className={`flex flex-col sm:flex-row items-center justify-between p-2 
          dark:bg-gray-800 bg-gray-50
         rounded-b-lg`}>
          <div className={`text-sm mb-2 sm:mb-0 
            dark:text-gray-400 text-gray-600
          `}>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded 
                dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:disabled:opacity-50 dark:text-white'
                  bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50
              `}
            >
              Previous
            </button>
            <div className={`px-3 py-1 
              dark:text-gray-300 text-gray-700
            `}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded 
                 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:disabled:opacity-50 dark:text-white
                  bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50
              `}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};