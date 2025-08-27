'use client';

import { useState, useEffect, Fragment } from 'react'; 
import AdminProtectedLayout from '@/app/admin/layout';

interface Query {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// --- New Tooltip Component for Delete Confirmation ---
interface DeleteConfirmationTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  queryName: string | undefined;
}

const DeleteConfirmationTooltip = ({ isOpen, onClose, onConfirm, queryName }: DeleteConfirmationTooltipProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-5 z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xs animate-slide-in-right">
        <p className="text-sm text-gray-700 mb-4">
          Delete query from <strong>{queryName}</strong>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

// --- New Toast Notification Component ---
interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ToastNotification = ({ message, type, onClose }: ToastNotificationProps) => {
  if (!message) return null;

  const baseClasses = "fixed bottom-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg";
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 font-bold text-lg">&times;</button>
    </div>
  );
};

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const queriesPerPage = 5;

  // State for new tooltip and toast functionality
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'success' }); // Default type set to 'success'

  useEffect(() => {
    fetchQueries();
  }, []);

  // Effect to automatically hide the toast after a few seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: '', type: 'success' }); // Reset to default type
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchQueries = async () => {
    try {
      const response = await fetch('/api/queries');
      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Updated Delete Flow ---
  const handleDeleteRequest = (query: Query) => {
    setQueryToDelete(query);
    setIsTooltipOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!queryToDelete) return;

    try {
      const response = await fetch('/api/queries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: queryToDelete.id }),
      });

      if (response.ok) {
        setQueries(queries.filter(query => query.id !== queryToDelete.id));
        setToast({ message: 'Query deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete query', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting query:', error);
      setToast({ message: 'Error deleting query', type: 'error' });
    } finally {
      setIsTooltipOpen(false);
      setQueryToDelete(null);
    }
  };

  const totalPages = Math.ceil(queries.length / queriesPerPage);
  const displayedQueries = queries.slice((currentPage - 1) * queriesPerPage, currentPage * queriesPerPage);

  if (loading) {
    return (
      <AdminProtectedLayout>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p>Loading queries...</p>
          </div>
        </div>
      </AdminProtectedLayout>
    );
  }

  return (
    <Fragment>
      <AdminProtectedLayout>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Manage Queries</h1>
            <div className="overflow-hidden shadow sm:rounded-lg">
              <div className="bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedQueries.map((query) => (
                      <tr key={query.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{query.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{query.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{query.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            query.status === 'new' 
                              ? 'bg-blue-100 text-blue-800' 
                              : query.status === 'read'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {query.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(query.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteRequest(query)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {displayedQueries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No queries found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminProtectedLayout>

      {/* Render the new tooltip and toast components */}
      <DeleteConfirmationTooltip 
        isOpen={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        onConfirm={handleConfirmDelete}
        queryName={queryToDelete?.name}
      />
      <ToastNotification 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })} // Ensure type is valid
      />
    </Fragment>
  );
}
