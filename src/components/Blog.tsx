import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Calendar, Clock, ArrowUpRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Responsive IoT Dashboards with React',
    excerpt: 'Learn how I created real-time dashboards for IoT gas detection systems using React, WebSockets, and modern UI libraries.',
    content: `In my recent IoT Gas Detector project, I faced the challenge of creating a responsive dashboard that could display real-time sensor data while maintaining excellent user experience across devices.

## The Challenge
Creating a dashboard that updates in real-time while being responsive and performant required careful consideration of:
- WebSocket connections for live data
- Efficient state management
- Mobile-first responsive design
- Data visualization that works on all screen sizes

## Technical Implementation
I used React with TypeScript for type safety, Socket.io for real-time communication, and Chart.js for data visualization. The key was implementing proper error handling and reconnection logic for unstable network conditions.

## Key Learnings
- Always implement proper loading states for real-time data
- Use debouncing for frequent updates to prevent UI lag
- Consider offline scenarios in IoT applications
- Mobile users need simplified data views

This project taught me the importance of balancing real-time functionality with user experience.`,
    date: '2024-03-10',
    readTime: '5 min read',
    tags: ['React', 'IoT', 'WebSockets', 'Dashboard'],
    category: 'Development'
  },
  {
    id: '2',
    title: 'My Journey with Machine Learning: From Theory to Practice',
    excerpt: 'Reflections on transitioning from academic ML concepts to real-world applications during my AI-ML internship.',
    content: `During my AI-ML internship with AICTE, I discovered the significant gap between theoretical knowledge and practical implementation of machine learning solutions.

## Academic vs Real-World ML
University courses teach you algorithms and mathematical foundations, but real projects involve:
- Data cleaning and preprocessing (80% of the work!)
- Handling incomplete or biased datasets
- Model deployment and monitoring
- Explaining AI decisions to non-technical stakeholders

## Key Projects and Insights
Working on predictive modeling for real datasets taught me:
- The importance of domain knowledge
- How to validate model performance beyond accuracy metrics
- The ethical considerations in AI decision-making

## Tools and Technologies
- Python ecosystem: Pandas, NumPy, Scikit-learn
- TensorFlow for deep learning experiments
- Jupyter notebooks for experimentation
- Git for version control of ML experiments

## Advice for Beginners
Start with small, well-defined problems. Focus on understanding your data before jumping into complex algorithms. And always question your model's predictions!`,
    date: '2024-02-28',
    readTime: '7 min read',
    tags: ['Machine Learning', 'Python', 'Data Science', 'Career'],
    category: 'Learning'
  },
  {
    id: '3',
    title: 'Lessons from TNWISE Hackathon 2025',
    excerpt: 'What I learned about rapid prototyping, team collaboration, and innovative problem-solving during Tamil Nadu\'s premier hackathon.',
    content: `Participating in TNWISE Hackathon 2025 was an intense 48-hour journey that pushed my technical and collaborative skills to new limits.

## The Problem Statement
We tackled a social challenge related to rural education accessibility. Our team had to quickly understand the problem domain and develop a technology solution.

## Rapid Prototyping Approach
With limited time, we focused on:
- MVP (Minimum Viable Product) thinking
- Quick user research and validation
- Iterative development cycles
- Effective task delegation

## Technical Stack Decisions
We chose familiar technologies to move fast:
- React for quick UI development
- Firebase for rapid backend setup
- Progressive Web App for mobile accessibility
- Simple but effective design system

## Team Dynamics
Working with diverse skill sets taught me:
- The importance of clear communication
- How to leverage each team member's strengths
- Balancing perfectionism with time constraints
- Making quick technical decisions under pressure

## Key Takeaways
- Hackathons are about solving problems, not showcasing complex tech
- User research is crucial even in time-constrained environments
- Simple solutions often win over complex ones
- Presentation skills are as important as technical implementation

The experience reinforced my passion for using technology to solve real-world problems.`,
    date: '2024-01-15',
    readTime: '6 min read',
    tags: ['Hackathon', 'Team Work', 'Problem Solving', 'Innovation'],
    category: 'Experience'
  }
];

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Development', 'Learning', 'Experience'];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <section id="blog" className="py-16 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-4">INSIGHTS & EXPERIENCES</div>
          <h2 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black leading-none tracking-tighter uppercase mb-8">
            Blog & <br className="md:hidden" />Thoughts
          </h2>
          <p className="text-base md:text-lg opacity-70 max-w-2xl mx-auto">
            Sharing my journey, learnings, and insights from the world of technology and development.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-untold-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{post.readTime}</span>
              </div>
              
              <h3 className="text-xl font-bold text-untold-ink mb-3 group-hover:text-untold-accent transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-untold-accent text-sm font-medium">
                Read more <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Blog Post Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{selectedPost.readTime}</span>
                        <span className="ml-2 px-2 py-1 bg-untold-accent/10 text-untold-accent rounded-full text-xs">
                          {selectedPost.category}
                        </span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black text-untold-ink mb-4">
                        {selectedPost.title}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors ml-4"
                    >
                      ×
                    </button>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    {selectedPost.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-xl font-bold text-untold-ink mt-8 mb-4">
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <li key={index} className="text-gray-700 mb-2">
                            {paragraph.replace('- ', '')}
                          </li>
                        );
                      }
                      if (paragraph.trim()) {
                        return (
                          <p key={index} className="text-gray-700 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Thanks for reading! Feel free to reach out with questions or feedback.
                    </div>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="flex items-center gap-2 text-untold-accent hover:text-untold-ink transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Blog;