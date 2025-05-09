"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  // You can add state for form fields here if needed
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // This is a placeholder for your future server action
  // You'll replace this with your actual server action later
  const handleSubmit = async (formData: FormData) => {
    // This will be replaced with your server action
    // e.g. await createUser(formData);
    console.log("Form submitted:", Object.fromEntries(formData.entries()));
    
    // Close modal after submission
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {/* Form - will be converted to use server action later */}
        <form action={(formData) => handleSubmit(formData)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Enter your email" 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Create a password" 
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
            >
              Create Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

