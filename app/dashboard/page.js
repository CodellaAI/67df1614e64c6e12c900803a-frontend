
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookOpen, Loader2, Eye, EyeOff, Trash2, Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tales, setTales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
    
    if (status === 'authenticated') {
      fetchTales();
    }
  }, [status, router]);

  const fetchTales = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tales/user`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`
        }
      });
      setTales(response.data);
    } catch (error) {
      console.error('Error fetching tales:', error);
      toast.error('Failed to load your tales');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublicStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/tales/${id}`, 
        { isPublic: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      setTales(tales.map(tale => 
        tale._id === id ? { ...tale, isPublic: !currentStatus } : tale
      ));
      
      toast.success(`Tale is now ${!currentStatus ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error updating tale:', error);
      toast.error('Failed to update tale');
    }
  };

  const deleteTale = async (id) => {
    if (!confirm('Are you sure you want to delete this tale?')) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tales/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`
        }
      });
      
      setTales(tales.filter(tale => tale._id !== id));
      toast.success('Tale deleted successfully');
    } catch (error) {
      console.error('Error deleting tale:', error);
      toast.error('Failed to delete tale');
    }
  };

  const filteredTales = tales.filter(tale => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'public') return tale.isPublic;
    if (selectedTab === 'private') return !tale.isPublic;
    return true;
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">Your Tales</h1>
          <p className="text-neutral-600 mt-2">Manage your collection of magical stories</p>
        </div>
        
        <Link href="/create" className="btn btn-primary">
          <Wand2 className="mr-2 h-5 w-5" />
          Create New Tale
        </Link>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-8">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 font-medium text-sm ${
            selectedTab === 'all'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          All Tales ({tales.length})
        </button>
        <button
          onClick={() => setSelectedTab('public')}
          className={`px-4 py-2 font-medium text-sm ${
            selectedTab === 'public'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Public ({tales.filter(t => t.isPublic).length})
        </button>
        <button
          onClick={() => setSelectedTab('private')}
          className={`px-4 py-2 font-medium text-sm ${
            selectedTab === 'private'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Private ({tales.filter(t => !t.isPublic).length})
        </button>
      </div>
      
      {/* Tales List */}
      {filteredTales.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 rounded-xl">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
          <h3 className="text-xl font-medium mb-2">No tales found</h3>
          <p className="text-neutral-600 mb-6">
            {tales.length === 0 
              ? "You haven't created any tales yet." 
              : "No tales match the selected filter."}
          </p>
          {tales.length === 0 && (
            <Link href="/create" className="btn btn-primary">
              Create Your First Tale
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTales.map((tale) => (
            <div key={tale._id} className="card flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {tale.isPublic ? (
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      Public
                    </div>
                  ) : (
                    <div className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Private
                    </div>
                  )}
                </div>
                <div className="text-sm text-neutral-500">
                  {new Date(tale.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{tale.title}</h3>
              
              <p className="text-neutral-600 mb-4 line-clamp-3">
                {tale.content.substring(0, 150)}...
              </p>
              
              <div className="mt-auto pt-4 border-t border-neutral-200 flex justify-between">
                <button
                  onClick={() => togglePublicStatus(tale._id, tale.isPublic)}
                  className="text-sm font-medium text-neutral-700 hover:text-primary-600 flex items-center"
                >
                  {tale.isPublic ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Make Private
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Make Public
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => deleteTale(tale._id)}
                  className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
