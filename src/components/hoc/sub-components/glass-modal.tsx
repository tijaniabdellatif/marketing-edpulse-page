"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import MagnetForm from "../magnet-form";

interface SignupModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const GlassModal: React.FC<SignupModalProps> = ({
  isOpen,
  onOpenChange,
  title = "Sign Up",
  description = "Create your account to get started with our platform",
}) => {
  // State to track if the modal has been opened
  const [hasOpened, setHasOpened] = useState(false);

  // Effect to scroll to top of modal content when opened
  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
      
      // Scroll to the top of the modal with a small delay to ensure it's rendered
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"]');
        if (dialogContent) {
          dialogContent.scrollTop = 0;
          
          // Ensure the modal is positioned in the viewport
          dialogContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="relative z-[7000] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md"
        // Auto-position in the center of the viewport
        style={{ position: 'fixed' }}
      >
        <DialogHeader className="sticky top-0 bg-white/95 backdrop-blur-md pt-6 pb-2 z-10">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 pb-6">
          <MagnetForm 
            onSuccess={() => {
              // Close modal after successful submission with a small delay
              setTimeout(() => onOpenChange(false), 2000);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};