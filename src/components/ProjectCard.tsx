import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Star, GitFork, User, Mail } from 'lucide-react';
import { Project } from '@/lib/firebase';
import { VitalityBar } from './VitalityBar';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const getStatusColor = () => {
    switch (project.status) {
      case 'active':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'dormant':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'haunted':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/project/${project.id}`} className="block">
        <div className="cyber-card group hover:neon-border-intense transition-all duration-300 h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground group-hover:neon-text transition-all truncate flex-1 mr-2">
              {project.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded border ${getStatusColor()} uppercase tracking-wider`}>
              {project.status}
            </span>
          </div>

          {/* Ghost Log */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {project.ghostLog}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-4 h-4" />
              <span>{project.stars || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <GitFork className="w-4 h-4" />
              <span>{project.forks || 0}</span>
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Vitality Bar */}
          <div className="mb-4">
            <VitalityBar score={project.vitalityScore} />
          </div>

          {/* Creator Info */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{project.creatorName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{project.creatorEmail}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
