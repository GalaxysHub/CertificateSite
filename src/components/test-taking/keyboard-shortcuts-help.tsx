'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KeyboardShortcut {
  key: string;
  description: string;
  enabled: boolean;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  className?: string;
}

export function KeyboardShortcutsHelp({
  shortcuts,
  className = ''
}: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 ${className}`}
        title="Show keyboard shortcuts (Press ? for help)"
      >
        <Keyboard className="w-4 h-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      {/* Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Keyboard className="w-5 h-5" />
                      <span>Keyboard Shortcuts</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm text-gray-700">
                          {shortcut.description}
                        </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Keyboard shortcuts work when not typing in text fields. 
                      Press <Badge variant="outline" className="mx-1 font-mono text-xs">Esc</Badge> 
                      to cancel any active input.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}