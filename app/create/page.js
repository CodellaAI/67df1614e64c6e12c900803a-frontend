
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Wand2, Loader2, Save, BookOpen, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateTalePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTale, setGeneratedTale] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      childAge: '5-8',
      topic: '',
      setting: '',
      characters: '',
      mood: 'happy',
      isPublic: false
    }
  });

  const onSubmit = async (data) => {
    if (!session) {
      toast.error('Please sign in to create a tale');
      router.push('/signin');
      return;
    }

    setIsGenerating(true);
    setGeneratedTale(null);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tales/generate`, data, {
        headers: {
          Authorization: `Bearer ${session.user.token}`
        }
      });
      
      setGeneratedTale({
        ...response.data,
        isPublic: data.isPublic
      });
      toast.success('Tale generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate tale');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTale = async () => {
    if (!generatedTale) return;
    
    setIsSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tales`, 
        {
          ...generatedTale,
          isPublic: generatedTale.isPublic
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      toast.success('Tale saved to your collection!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save tale');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Create a Magical Tale</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Tale Generator Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Tale Parameters</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="childAge">
                Child's Age Range
              </label>
              <select 
                id="childAge"
                className="input"
                {...register('childAge', { required: true })}
              >
                <option value="3-4">3-4 years (Preschool)</option>
                <option value="5-8">5-8 years (Early Elementary)</option>
                <option value="9-12">9-12 years (Upper Elementary)</option>
              </select>
              {errors.childAge && <p className="text-red-500 text-sm mt-1">Please select an age range</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="topic">
                Main Topic or Theme
              </label>
              <input
                id="topic"
                type="text"
                placeholder="e.g., Friendship, Adventure, Animals..."
                className="input"
                {...register('topic', { required: true })}
              />
              {errors.topic && <p className="text-red-500 text-sm mt-1">Please enter a topic</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="setting">
                Story Setting (Optional)
              </label>
              <input
                id="setting"
                type="text"
                placeholder="e.g., Forest, Space, Underwater kingdom..."
                className="input"
                {...register('setting')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="characters">
                Main Characters (Optional)
              </label>
              <input
                id="characters"
                type="text"
                placeholder="e.g., Dragon, Princess, Talking animals..."
                className="input"
                {...register('characters')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="mood">
                Story Mood
              </label>
              <select 
                id="mood"
                className="input"
                {...register('mood')}
              >
                <option value="happy">Happy & Uplifting</option>
                <option value="adventurous">Adventurous & Exciting</option>
                <option value="educational">Educational & Curious</option>
                <option value="calming">Calming & Peaceful</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="isPublic"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...register('isPublic')}
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make this tale public (share with community)
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isGenerating}
              className="btn btn-primary w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Tale...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Tale
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Tale Display */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Tale</h2>
          
          {!generatedTale && !isGenerating && (
            <div className="text-center py-20 text-neutral-500">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Your tale will appear here after generation</p>
            </div>
          )}
          
          {isGenerating && (
            <div className="text-center py-20">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary-500" />
              <p className="text-lg font-medium">Crafting your magical tale...</p>
              <p className="text-neutral-500 mt-2">This may take a minute or two</p>
            </div>
          )}
          
          {generatedTale && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">{generatedTale.title}</h3>
                <div className="prose max-w-none">
                  {generatedTale.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-200">
                <button
                  onClick={saveTale}
                  disabled={isSaving}
                  className="btn btn-primary flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Tale
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => setGeneratedTale(null)}
                  className="btn btn-secondary flex-1"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
