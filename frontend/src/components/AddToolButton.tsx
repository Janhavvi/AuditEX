import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  label?: string;
}

export default function AddToolButton({ onClick, label = 'Add Another Tool' }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-aqua/25 bg-aqua/10 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-xl transition hover:border-aqua/45 hover:bg-aqua/15 hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]"
    >
      <span className="grid h-7 w-7 place-items-center rounded-xl bg-aqua/15 text-aqua transition group-hover:bg-aqua/25">
        <Plus className="h-4 w-4" />
      </span>
      {label}
    </motion.button>
  );
}
