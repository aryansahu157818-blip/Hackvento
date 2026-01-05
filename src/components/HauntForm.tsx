import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { sendHauntEmail } from '@/lib/emailjs';
import { toast } from 'sonner';

interface HauntFormProps {
  projectTitle: string;
  creatorEmail: string;
  onSuccess?: () => void;
}

export const HauntForm = ({ projectTitle, creatorEmail, onSuccess }: HauntFormProps) => {
  const [formData, setFormData] = useState({
    fromName: '',
    fromEmail: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await sendHauntEmail({
        ...formData,
        projectTitle,
        toEmail: creatorEmail,
      });

      if (success) {
        toast.success('Your interest has been transmitted to the project creator!');
        setFormData({ fromName: '', fromEmail: '', message: '' });
        onSuccess?.();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card"
    >
      <h3 className="text-xl font-bold mb-4 neon-text">Haunt this Project</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Express your interest in this project. Your message will be transmitted directly to the creator.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Your Name</label>
          <input
            type="text"
            value={formData.fromName}
            onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
            className="cyber-input w-full"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Your Email</label>
          <input
            type="email"
            value={formData.fromEmail}
            onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
            className="cyber-input w-full"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="cyber-input w-full h-32 resize-none"
            placeholder="Why are you interested in this project?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cyber-button w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Transmitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Interest
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
