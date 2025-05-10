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
 
  const [hasOpened, setHasOpened] = useState(false);

  // Effect to scroll to top of modal content when opened
  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
     
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"]');
        if (dialogContent) {
          dialogContent.scrollTop = 0;
          
          dialogContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="relative z-[7000] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md"
       
        style={{ position: 'fixed' }}
      >
        <DialogHeader className="bg-transparent pt-6 pb-2 z-10 relative w-[70%]">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 pb-6">
          <MagnetForm 
            onSuccess={() => {
      
              setTimeout(() => onOpenChange(false), 2000);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};