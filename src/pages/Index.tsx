import { motion } from 'framer-motion';
import { Ghost, Zap, Eye, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const features = [
  {
    icon: Ghost,
    title: 'Ghost Logs',
    description: 'AI-powered analysis of abandoned repositories, revealing hidden potential.',
  },
  {
    icon: Zap,
    title: 'Vitality Scores',
    description: 'Real-time health metrics based on GitHub activity and community engagement.',
  },
  {
    icon: Eye,
    title: 'Project Discovery',
    description: 'Browse a curated vault of projects waiting for new maintainers.',
  },
  {
    icon: Archive,
    title: 'Submit Projects',
    description: 'Add your own projects to the network and connect with interested developers.',
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen p-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center py-20"
        >
          <div className="relative inline-block mb-8">
            <Ghost className="w-24 h-24 text-primary mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-primary/30" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 neon-text-intense">
            Ghost Whisperer
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover abandoned code repositories and breathe new life into forgotten projects. 
            Connect with creators and continue their digital legacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vault"
              className="cyber-button inline-flex items-center justify-center gap-2 text-lg"
            >
              <Archive className="w-5 h-5" />
              Explore the Vault
            </Link>
            <Link
              to="/ghost"
              className="px-6 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <Ghost className="w-5 h-5" />
              Submit a Project
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-6xl mx-auto mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 neon-text">
            Channel the Digital Spirits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="cyber-card text-center group hover:neon-border-intense transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-4xl mx-auto mt-20 py-12 border-t border-b border-border"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold neon-text mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Projects Waiting</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-text mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Analysis</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-text mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto text-center mt-20 pb-20"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Whisper with the Ghosts?</h2>
          <p className="text-muted-foreground mb-6">
            Join the network of developers who give second life to abandoned code.
          </p>
          <Link
            to="/auth"
            className="cyber-button inline-flex items-center gap-2"
          >
            Initialize Connection
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;
