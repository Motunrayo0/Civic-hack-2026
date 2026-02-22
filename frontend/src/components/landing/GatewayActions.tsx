import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

export default function GatewayActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <Button variant="primary" onClick={() => navigate('/student')}>
        <BookOpen size={18} />
        I'm a Student
      </Button>
      <Button variant="ghost" onClick={() => navigate('/teacher')}>
        <BarChart3 size={18} />
        I'm a Teacher
      </Button>
    </div>
  );
}
