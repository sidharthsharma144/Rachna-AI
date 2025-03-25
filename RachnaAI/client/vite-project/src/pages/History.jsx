import React, { useState } from "react";

const History = () => {
  const historyData = [
    { title: "Today's Searches", date: "Today", items: ["Search 1", "Search 2", "Search 3"] },
    { title: "Yesterday's Searches", date: "Yesterday", items: ["Search 4", "Search 5", "Search 6"] },
    { title: "A Week Ago", date: "Last 7 Days", items: ["Search 7", "Search 8", "Search 9"] }
  ];

  const [recentSearches, setRecentSearches] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-rose-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Search History</h1>
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {historyData.map((section, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
              onClick={() => alert(`Showing details for ${section.title}`)}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{section.date}</p>
              <ul className="text-gray-700 text-sm space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="hover:text-blue-600 transition duration-300">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Recent Searches Section */}
        <div className="mt-10 p-8 bg-white rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Recent Searches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentSearches.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-rose-200 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <p className="text-gray-800 font-medium">{item}</p>
                <span className="text-gray-500 text-xs">🔍</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;