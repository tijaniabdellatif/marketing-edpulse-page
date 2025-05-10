"use client";
import MDEditor from '@uiw/react-markdown-preview';
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Download } from "lucide-react";
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
  const mdEditorStyles = {
    backgroundColor: 'transparent',
    color: 'inherit',
  };
  const mdEditorClassName = 'p-3 max-w-[70vw] overflow-y-auto custom-markdown-preview';

  const [hasOpened, setHasOpened] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [generatingPath, setGeneratingPath] = useState(false);
  const [learningPath, setLearningPath] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debug state changes
  useEffect(() => {
    console.log("State changed - formSubmitted:", formSubmitted);
    console.log("State changed - visitorId:", visitorId);
    console.log("State changed - showLearningPath:", showLearningPath);
  }, [formSubmitted, visitorId, showLearningPath]);

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


  useEffect(() => {
    if (!isOpen) {
     
      setTimeout(() => {
        if (!isOpen) {
          setFormSubmitted(false);
          setShowLearningPath(false);
          setLearningPath(null);
          setError(null);
        }
      }, 300);
    }
  }, [isOpen]);

  const handleFormSuccess = (data?: any) => {
    console.log("Form success callback received:", data);

   
    setFormSubmitted(true);

   
    if (data?.visitorId) {
      console.log("Setting visitorId:", data.visitorId);
      setVisitorId(data.visitorId);
    } else {
      console.log("No visitorId found in response data");
     
    }
  };

  const generateLearningPath = async () => {
    if (!visitorId) {
      console.error("No visitorId available for generating learning path");
      setError("Unable to generate learning path: Missing visitor information");
      return;
    }

    setGeneratingPath(true);
    setError(null);

    try {
      console.log("Calling learning path API with visitorId:", visitorId);
      const response = await axios.post('/api/learning-path', { visitorId });
      console.log("Learning path API response:", response.data);

      if (response.data.success) {
        setLearningPath(response.data.learningPath);
        setStudentName(response.data.studentName);
        setShowLearningPath(true);
      } else {
        throw new Error(response.data.message || 'Failed to generate learning path');
      }
    } catch (err: any) {
      console.error('Error generating learning path:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate your learning path. Please try again.');
    } finally {
      setGeneratingPath(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="relative z-[7000] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md"
        style={{ position: 'fixed' }}
      >
        <DialogHeader className="bg-transparent pt-6 pb-2 z-10 relative w-full sm:w-[80%]">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            {showLearningPath ? "Your Personalized Learning Path" : title}
          </DialogTitle>
          <DialogDescription>
            {showLearningPath
              ? `Specially crafted for ${studentName || "you"}`
              : formSubmitted
                ? "Great! You're all set. Ready to see your personalized learning path?"
                : description
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 pb-6">
          {!formSubmitted ? (
          
            <MagnetForm
              onSuccess={handleFormSuccess}
            />
          ) : showLearningPath ? (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border border-blue-100 text-gray-700 shadow-sm">
                  {
                    learningPath ? (
                      <MDEditor
                        source={learningPath}
                        className={mdEditorClassName}
                        style={mdEditorStyles}
                      />
                    ) : (<span className="text-muted text-xl">Generating your answer...</span>)
                  }
                </div>
              </div>

              <div className="flex justify-center pt-4 gap-4">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="w-full max-w-md p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border border-blue-100 text-center space-y-4 shadow-sm">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Registration Complete!
                </h3>
                <p className="text-gray-600">
                  Thank you for joining us. We've analyzed your preferences and can create a personalized learning path just for you.
                </p>
                <Button
                  onClick={generateLearningPath}
                  disabled={generatingPath || !visitorId}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white px-6 py-5 mt-4 font-medium"
                >
                  {generatingPath ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your learning plan...
                    </>
                  ) : (
                    "Generate My Learning Path"
                  )}
                </Button>
                {!visitorId && (
                  <p className="text-sm text-amber-600 mt-2">
                    Visitor information not available. Please try again.
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};