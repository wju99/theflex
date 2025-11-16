"use client";

export function PropertyStayPolicies() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Stay Policies</h2>
      
      {/* Check-in & Check-out */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-gray-900">Check-in & Check-out</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
            <p className="font-medium text-gray-900">3:00 PM</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Check-out Time</p>
            <p className="font-medium text-gray-900">10:00 AM</p>
          </div>
        </div>
      </div>

      {/* House Rules */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="font-semibold text-gray-900">House Rules</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className="text-gray-700">No smoking</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className="text-gray-700">No pets</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className="text-gray-700">No parties or events</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-gray-700">Security deposit required</span>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-900 mb-2">For stays less than 28 days:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Full refund up to 14 days before check-in</li>
              <li>No refund for bookings less than 14 days before check-in</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">For stays of 28 days or more:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Full refund up to 30 days before check-in</li>
              <li>No refund for bookings less than 30 days before check-in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

