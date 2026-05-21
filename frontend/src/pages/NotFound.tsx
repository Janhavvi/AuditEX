import { Link } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[75vh] max-w-3xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">404</p>
        <h1 className="mt-4 text-5xl font-bold text-white">This report path is empty</h1>
        <p className="mt-4 text-[#94A3B8]">Return to AuditEX and generate a fresh AI spend audit.</p>
        <Link to="/" className="mt-8 inline-flex">
          <AnimatedButton>Back to home</AnimatedButton>
        </Link>
      </div>
    </div>
  );
}
