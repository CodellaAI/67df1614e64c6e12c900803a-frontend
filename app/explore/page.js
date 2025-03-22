
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, BookOpen, Heart, Loader2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  const { data: session } = useSession();
  const [tales, setTales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const topics = ['Adventure', 'Animals', 'Fantasy', 'Friendship', 'Nature', 'Space', 'Other'];
  const ageRanges = ['3-4', '5-8', '9-12'];

  useEffect(() => {
    fetchPublicTales();
  }, []);

  const fetchPublicTales = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tales/public`);
      setTales(response.data);
    } catch (error) {
      console.error('Error fetching tales:', error);
      toast.error('Failed to load tales');
    } finally {
      setIsLoading(false);
    }
  };

  const likeTale = async (id) => {
    if (!session) {
      toast.error('Please sign in to like tales');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      // Update the tales array with the updated like count
      setTales(tales.map(tale => 
        tale._id === id ? { ...tale, likes: response.data.likes, isLiked: response.data.isLiked } : tale
      ));
      
      toast.success(response.data.isLiked ? 'Tale liked!' : 'Like removed');
    } catch (error) {
      console.error('Error liking tale:', error);
      toast.error('Failed to like tale');
    }
  };

  const filteredTales = tales.filter(tale => {
    const matchesSearch = tale.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tale.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic ? tale.topic === selectedTopic : true;
    const matchesAge = ageRange ? tale.childAge === ageRange : true;
    
    return matchesSearch && matchesTopic && matchesAge;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTopic('');
    setAgeRange('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Tales</h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Discover magical stories created by our community of storytellers
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search for tales..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-neutral-700 hover:text-primary-600"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {(searchTerm || selectedTopic || ageRange) && (
            <button 
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Reset Filters
            </button>
          )}
        </div>
        
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-neutral-50 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Topic
                </label>
                <select
                  className="input"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  <option value="">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Age Range
                </label>
                <select
                  className="input"
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                >
                  <option value="">All Ages</option>
                  {ageRanges.map(range => (
                    <option key={range} value={range}>{range} years</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Tales Grid */}
      {filteredTales.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 rounded-xl">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
          <h3 className="text-xl font-medium mb-2">No tales found</h3>
          <p className="text-neutral-600">
            Try adjusting your search or filters to find more stories
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTales.map((tale) => (
            <motion.div 
              key={tale._id} 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                  {tale.childAge} years
                </div>
                <div className="text-sm text-neutral-500">
                  {new Date(tale.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{tale.title}</h3>
              
              <p className="text-neutral-600 mb-4 line-clamp-4">
                {tale.content.substring(0, 200)}...
              </p>
              
              <div className="mt-auto pt-4 border-t border-neutral-200 flex justify-between items-center">
                <div className="text-sm text-neutral-600">
                  By {tale.author?.name || 'Anonymous'}
                </div>
                
                <button
                  onClick={() => likeTale(tale._id)}
                  className={`flex items-center text-sm font-medium ${
                    tale.isLiked 
                      ? 'text-red-500 hover:text-red-700' 
                      : 'text-neutral-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-1 ${tale.isLiked ? 'fill-current' : ''}`} />
                  {tale.likes}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
