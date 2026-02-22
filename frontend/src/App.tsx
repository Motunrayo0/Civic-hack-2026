import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import EduPulse from './pages/EduPulse';
import ClassroomPulse from './pages/ClassroomPulse';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<EduPulse />} />
        <Route path="/teacher" element={<ClassroomPulse />} />
      </Routes>
    </BrowserRouter>
  );
}
