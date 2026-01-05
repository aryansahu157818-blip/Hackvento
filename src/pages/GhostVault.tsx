import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Ghost } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { getProjects, Project } from '@/lib/firebase';
import { toast } from 'sonner';

const GhostVault = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects from the vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.ghostLog.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <h1 className="text-4xl font-bold neon-text-intense mb-4">Ghost Vault</h1>
          <p className="text-muted-foreground">
            Browse the collection of projects waiting for new maintainers.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto mb-8 flex gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cyber-input w-full pl-12"
            />
          </div>
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="cyber-button flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        {/* Projects Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Ghost className="w-16 h-16 text-primary animate-pulse mb-4" />
              <p className="text-muted-foreground">Channeling the spirits...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Ghost className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'No projects match your search. Try a different query.'
                  : 'The vault is empty. Be the first to submit a project!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GhostVault;
