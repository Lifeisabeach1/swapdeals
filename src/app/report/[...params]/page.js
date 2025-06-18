"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Flag, AlertTriangle, User, MessageSquare, Image, Shield } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  
  // Extract parameters from the catch-all route
  const routeParams = params.params || [];
  const userId = routeParams[0];
  const contentId = routeParams[1];
  const contentType = routeParams[2] || 'user';
  
  const [reportData, setReportData] = useState({
    reason: '',
    description: '',
    contentType: contentType || 'user',
    contentId: contentId || null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reportedUser, setReportedUser] = useState(null);

  // Debug logging (remove in production)
  console.log('Route params:', routeParams);
  console.log('Parsed - userId:', userId, 'contentId:', contentId, 'contentType:', contentType);

  // Report reasons
  const reportReasons = {
    user: [
      { value: 'harassment', label: 'Harassment or bullying', icon: Shield },
      { value: 'spam', label: 'Spam or unwanted messages', icon: MessageSquare },
      { value: 'fake_profile', label: 'Fake or impersonation profile', icon: User },
      { value: 'inappropriate_content', label: 'Inappropriate content', icon: AlertTriangle },
      { value: 'fraud', label: 'Fraudulent activity', icon: AlertTriangle },
      { value: 'other', label: 'Other (please specify)', icon: Flag }
    ],
    listing: [
      { value: 'spam', label: 'Spam or duplicate listing', icon: MessageSquare },
      { value: 'inappropriate_content', label: 'Inappropriate content', icon: AlertTriangle },
      { value: 'fraud', label: 'Fraudulent or misleading', icon: AlertTriangle },
      { value: 'fake_item', label: 'Fake or counterfeit item', icon: Flag },
      { value: 'overpriced', label: 'Extremely overpriced', icon: Flag },
      { value: 'other', label: 'Other (please specify)', icon: Flag }
    ]
  };

  const currentReasons = reportReasons[reportData.contentType] || reportReasons.user;

  // Mock user data for development (replace with actual API call)
  useEffect(() => {
    if (userId && reportData.contentType === 'user') {
      // Mock user data - replace with actual API call
      setReportedUser({
        username: userId,
        first_name: 'Mock',
        last_name: 'User',
        created_at: new Date().toISOString()
      });
    }
  }, [userId, reportData.contentType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Mock API call - replace with actual API endpoint
      console.log('Submitting report:', {
        reported_user_id: userId,
        reason: reportData.reason,
        description: reportData.description,
        content_type: reportData.contentType,
        content_id: reportData.contentId
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        router.back();
      }, 8000);

    } catch (error) {
      console.error('Report submission error:', error);
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReasonChange = (reason) => {
    setReportData(prev => ({
      ...prev,
      reason,
      description: reason === 'other' ? prev.description : ''
    }));
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h2>
          <p className="text-gray-600 mb-4">
            Thank you for helping keep our community safe. Well review your report and take appropriate action.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you back...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report {reportData.contentType === 'user' ? 'User' : 'Listing'}</h1>
                <p className="text-gray-600">Help us maintain a safe and respectful community</p>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info:</h3>
            <div className="text-xs text-blue-700">
              <p>User ID: {userId}</p>
              <p>Content ID: {contentId}</p>
              <p>Content Type: {contentType}</p>
              <p>Route Params: {JSON.stringify(routeParams)}</p>
            </div>
          </div>

          {/* Reported User/Content Info */}
          {reportedUser && reportData.contentType === 'user' && (
            <div className="p-6 bg-gray-50 border-b">
              <h3 className="text-lg font-medium mb-3">Reporting User</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
                  {reportedUser.username?.charAt(0) || reportedUser.first_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-medium">{reportedUser.username || `${reportedUser.first_name} ${reportedUser.last_name}`}</h4>
                  <p className="text-sm text-gray-600">Member since {new Date(reportedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Show listing info when reporting a listing */}
          {reportData.contentType === 'listing' && (
            <div className="p-6 bg-gray-50 border-b">
              <h3 className="text-lg font-medium mb-3">Reporting Listing</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <Flag className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium">Listing ID: {contentId}</h4>
                  <p className="text-sm text-gray-600">By: {userId}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Report Reason */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Whats the issue?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentReasons.map((reason) => {
                  const IconComponent = reason.icon;
                  return (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => handleReasonChange(reason.value)}
                      className={`flex items-center p-4 rounded-lg border-2 text-left transition-all ${
                        reportData.reason === reason.value
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{reason.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Additional Details {reportData.reason === 'other' && <span className="text-red-500">*</span>}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Please provide specific details about the issue. This helps our moderators take appropriate action.
              </p>
              <textarea
                value={reportData.description}
                onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="4"
                placeholder="Describe the issue in detail..."
                required={reportData.reason === 'other'}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>False reports may result in action against your account</li>
                    <li>We investigate all reports thoroughly</li>
                    <li>You may be contacted for additional information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!reportData.reason || isSubmitting || (reportData.reason === 'other' && !reportData.description.trim())}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}