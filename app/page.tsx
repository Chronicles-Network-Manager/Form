"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface IntroStep {
  type: "intro";
  content: string;
}

interface TosStep {
  type: "tos";
  content: string;
}

interface QuestionStep {
  type: "question";
  id: string;
  label: string;
  placeholder: string;
  inputType: string;
}

interface ThankYouStep {
  type: "thankyou";
  content: string;
}

type Step = IntroStep | TosStep | QuestionStep | ThankYouStep;

const steps: Step[] = [
  {
    type: "intro",
    content: `Hey there!\n\nHi! I’m Jonathan. Whether we’re old friends or new acquaintances, I’d love to get to know you better through this form. I’m especially interested in learning who to turn to when I need advice about moving to a new city (which you may have lived in at some point) or trying out new activities that you may be interested in.\n\nFeel free to answer as much as you like — the more details, the better! Without further ado, let’s get started.`,
  },
  {
    type: "tos",
    content: `Terms of Data Use\n\nThis is a personal project, and all the information you provide will be used solely for my personal use. Your data will be stored privately on my home computer and will not be shared publicly. If you don’t feel comfortable sharing this information, that’s completely fine!`,
  },
  {
    type: "question",
    id: "name",
    label: "What's your name?",
    placeholder: "John Doe",
    inputType: "text",
  },
  {
    type: "question",
    id: "email",
    label: "What's your email address?",
    placeholder: "john@example.com",
    inputType: "email",
  },
  {
    type: "question",
    id: "age",
    label: "How old are you?",
    placeholder: "25",
    inputType: "number",
  },
  {
    type: "thankyou",
    content: "", // We'll render custom thank you content
  },
];

export default function TypeformStyleForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [tosAccepted, setTosAccepted] = useState(false);

  const currentStep = steps[step];
  const progressValue = (step / (steps.length - 1)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentStep.type === "question") {
      setFormData({
        ...formData,
        [currentStep.id]: e.target.value,
      });
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      if (currentStep.type === "tos") {
        setTosAccepted(false);
      }
      if (currentStep.type === "question" && step === steps.length - 2) {
        // Last question submitted, here you can handle form submission
        console.log("Form Submitted:\n", JSON.stringify(formData, null, 2));
      }
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      if (steps[step - 1].type === "tos") {
        setTosAccepted(false);
      }
    }
  };

  const exitForm = () => {
    // Skip directly to thank you page on exit
    setStep(steps.length - 1);
  };

  // Disable Next/Submit button on question steps if empty input
  const isNextDisabled = () => {
    if (currentStep.type === "tos") {
      return !tosAccepted;
    }
    if (currentStep.type === "question") {
      return !formData[currentStep.id]?.trim();
    }
    return false;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-muted p-4">
      <Card className="w-full max-w-md shadow-2xl p-6">
        <CardContent>
          {currentStep.type !== "thankyou" && (
            <Progress value={progressValue} className="mb-6" />
          )}

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep.type === "intro" && (
              <div className="whitespace-pre-wrap text-center text-lg font-medium">
                {currentStep.content}
              </div>
            )}

            {currentStep.type === "tos" && (
              <div>
                <p className="text-lg font-medium">{currentStep.content}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  By continuing, you agree to our terms and conditions.
                </p>
                <div className="mt-6 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tosAccepted"
                    checked={tosAccepted}
                    onChange={() => setTosAccepted(!tosAccepted)}
                    className="cursor-pointer"
                  />
                  <Label htmlFor="tosAccepted" className="select-none cursor-pointer">
                    I accept the Terms of Data Use
                  </Label>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={exitForm}>
                    Exit
                  </Button>
                  <Button onClick={nextStep} disabled={!tosAccepted}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {currentStep.type === "question" && (
              <div>
                <Label htmlFor={currentStep.id} className="text-xl font-semibold">
                  {currentStep.label}
                </Label>
                <Input
                  id={currentStep.id}
                  type={currentStep.inputType}
                  placeholder={currentStep.placeholder}
                  value={formData[currentStep.id] || ""}
                  onChange={handleChange}
                  className="mt-4"
                />
              </div>
            )}

            {currentStep.type === "thankyou" && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">THANK YOU</h2>
                <p>
                  Thank you for taking out the time to answer this survey! If you'd like to know more about me, feel free to click this link:
                </p>
                <p>
                  If you'd like to learn more about how I stay in touch with people, head over to this link:
                </p>
                <p>Thanks once again :)</p>

                <div className="mt-6 flex justify-center space-x-4">
                  <a
                    href="https://linkedin.com/in/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://yourportfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    Portfolio
                  </a>
                </div>
              </div>
            )}

            {currentStep.type !== "tos" && currentStep.type !== "thankyou" && (
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={prevStep} disabled={step === 0}>
                  Back
                </Button>
                <Button onClick={nextStep} disabled={isNextDisabled()}>
                  {currentStep.type === "question" && step === steps.length - 2
                    ? "Submit"
                    : step < steps.length - 1
                    ? "Next"
                    : "Finish"}
                </Button>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
