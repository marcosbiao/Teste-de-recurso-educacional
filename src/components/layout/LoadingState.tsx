import * as React from 'react';
import { motion } from 'motion/react';
import { Code2 } from 'lucide-react';

/**
 * Componente de carregamento para estados iniciais.
 */
export function LoadingState() {
  return (
    <div className="global-state global-state--loading" role="status">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="global-state__icon"
      >
        <Code2 size={42} />
      </motion.div>
      <p>Carregando ambiente pedagógico...</p>
    </div>
  );
}
