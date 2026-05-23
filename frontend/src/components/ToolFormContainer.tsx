import { AnimatePresence, motion } from 'framer-motion';
import { DatabaseZap } from 'lucide-react';
import type { AuditToolForm } from '../types/audit';
import AddToolButton from './AddToolButton';
import AuditFormCard from './AuditFormCard';

interface Props {
  tools: AuditToolForm[];
  onAddTool: () => void;
  onDuplicateTool: (id: string) => void;
  onRemoveTool: (id: string) => void;
  onToggleToolCollapse: (id: string) => void;
  onUpdateTool: (id: string, values: Partial<AuditToolForm>) => void;
}

export default function ToolFormContainer({
  tools,
  onAddTool,
  onDuplicateTool,
  onRemoveTool,
  onToggleToolCollapse,
  onUpdateTool,
}: Props) {
  return (
    <section className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tools.length ? (
          tools.map((tool, index) => (
            <AuditFormCard
              key={tool.id}
              form={tool}
              index={index}
              onChange={(values) => onUpdateTool(tool.id, values)}
              onDuplicate={() => onDuplicateTool(tool.id)}
              onRemove={() => onRemoveTool(tool.id)}
              onToggleCollapse={() => onToggleToolCollapse(tool.id)}
            />
          ))
        ) : (
          <motion.div
            key="empty-audit-tools"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-aqua/20 bg-aqua/10 text-aqua">
              <DatabaseZap className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-white">No tools in this audit yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#94A3B8]">
              Add a tool form to start building your spend baseline. Your cards will stay editable and saved locally.
            </p>
            <div className="mt-6">
              <AddToolButton onClick={onAddTool} label="Add Tool" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {tools.length > 0 && (
        <div className="flex justify-center pt-2">
          <AddToolButton onClick={onAddTool} />
        </div>
      )}
    </section>
  );
}
