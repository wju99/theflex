"use client";

export function PropertyBookingWidget() {
  return (
    <div className="bg-[rgb(40,78,76)] rounded-t-lg p-6 text-white">
      <h3 className="text-xl font-semibold mb-2">Book Your Stay</h3>
      <p className="text-sm opacity-90 mb-4">Select dates to see prices</p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Select dates</span>
            </span>
          </button>
          
          <button className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>1</span>
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <button className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Check availability</span>
        </button>
        
        <button className="w-full bg-white text-[rgb(40,78,76)] border-2 border-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Send Inquiry</span>
        </button>
        
        <div className="flex items-center justify-center gap-2 text-sm opacity-90 pt-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Instant booking confirmation</span>
        </div>
      </div>
    </div>
  );
}

