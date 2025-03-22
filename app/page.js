
import { ArrowRight, Sparkles, BookOpen, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900">
                Craft magical tales for your little ones
              </h1>
              <p className="text-xl text-neutral-700 leading-relaxed">
                Create personalized, age-appropriate stories for children with our AI-powered tale generator. Spark imagination and joy with custom adventures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create" className="btn btn-primary">
                  Create a Tale <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/explore" className="btn btn-secondary">
                  Explore Stories <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-medium">
              <Image 
                src="/images/hero-image.jpg" 
                alt="Children reading a magical storybook"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Storytelling reimagined</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our AI-powered platform creates unique tales tailored to your child's interests and development stage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:translate-y-[-8px]">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Stories</h3>
              <p className="text-neutral-600">
                Customize tales based on age, interests, and educational goals to create the perfect story for your child.
              </p>
            </div>
            
            <div className="card hover:translate-y-[-8px]">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Story Collection</h3>
              <p className="text-neutral-600">
                Build a personal library of tales that you can revisit anytime, organized in your private dashboard.
              </p>
            </div>
            
            <div className="card hover:translate-y-[-8px]">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Sharing</h3>
              <p className="text-neutral-600">
                Share your favorite tales with others and discover stories from parents around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin your storytelling journey today</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of parents creating magical moments with personalized tales
          </p>
          <Link href="/signup" className="btn bg-white text-primary-700 hover:bg-primary-50">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
