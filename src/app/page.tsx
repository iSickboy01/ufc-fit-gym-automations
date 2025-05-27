'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Zap, GitBranch, TestTube, Sparkles } from 'lucide-react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const workflows = [
    {
      id: 'welcome',
      title: '5-Days Pass Sign Up & Reminders',
      description: 'Test the sign up and reminders experience flow',
      href: '/workflows/5dayspass',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      status: 'Ready'
    },
    {
      id: 'employeekey',
      title: 'Employee Key Tagging, Submission & Retrieval',
      description: 'Test employee key submission and Retrieval',
      href: '/workflows/employeeKey/addTag',
      icon: GitBranch,
      color: 'from-blue-500 to-cyan-500',
      status: 'Ready'
    },
    {
      id: 'decisionmakers',
      title: "Decision Maker's Form Submission",
      description: "Test the decision maker's form subission flow",
      href: '/workflows/decisionMakers',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      status: 'Ready'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-white opacity-20 rounded-full"></div>
          </div>
        ))}
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl">
            <TestTube className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            UFC Fit & Gym Workflow Tester
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Test and simulate the UFC Fit & Gym workflows with this comprehensive testing suite. 
            Monitor performance, flow, catch bugs, and simulate smooth user experiences.
          </p>
          
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              System Online
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              {workflows.filter(w => w.status === 'Ready').length} Tests Available
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workflows.map((workflow, index) => {
            const Icon = workflow.icon;
            const isReady = workflow.status === 'Ready';
            
            return (
              <div
                key={workflow.id}
                className={`transition-all duration-700 transform ${
                  isLoaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredCard(workflow.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`
                  relative group h-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10
                  transition-all duration-500 hover:scale-105 hover:bg-white/10
                  ${hoveredCard === workflow.id ? 'shadow-2xl shadow-purple-500/20' : 'shadow-xl'}
                  ${!isReady ? 'opacity-75' : ''}
                `}>
                  {/* Gradient border effect */}
                  <div className={`
                    absolute inset-0 rounded-3xl bg-gradient-to-r ${workflow.color} p-[2px] opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500
                  `}>
                    <div className="w-full h-full bg-slate-900 rounded-3xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${isReady 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }
                      `}>
                        {workflow.status}
                      </div>
                      
                      <div className={`
                        p-3 rounded-2xl bg-gradient-to-r ${workflow.color} 
                        transform transition-transform duration-300 group-hover:scale-110
                      `}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {workflow.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                      {workflow.description}
                    </p>

                    {/* Action Button */}
                    {isReady ? (
                      <Link 
                        href={workflow.href}
                        className={`
                          w-full flex items-center justify-center gap-3 py-4 px-6 
                          bg-gradient-to-r ${workflow.color} rounded-2xl font-semibold text-white
                          transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                          focus:outline-none focus:ring-4 focus:ring-purple-500/50
                        `}
                      >
                        <Play className="w-5 h-5" />
                        Run Test
                        <ArrowRight className={`
                          w-5 h-5 transition-transform duration-300 
                          ${hoveredCard === workflow.id ? 'translate-x-1' : ''}
                        `} />
                      </Link>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-600/20 rounded-2xl font-semibold text-gray-500 cursor-not-allowed">
                        <TestTube className="w-5 h-5" />
                        In Development
                      </div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div className={`
                    absolute inset-0 rounded-3xl bg-gradient-to-r ${workflow.color} opacity-0 
                    group-hover:opacity-10 transition-opacity duration-500 pointer-events-none
                  `}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '800ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-gray-300">
            <Sparkles className="w-4 h-4" />
            More workflows coming soon
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </main>
    </div>
  );
}