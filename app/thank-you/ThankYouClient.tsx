"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");

  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 py-6 sm:px-6 md:p-10">
      <div className="w-full max-w-md">
        <ThankYouCard userName={user} />
      </div>
    </div>
  );
}

interface ThankYouCardProps extends React.ComponentProps<"div"> {
  userName?: string | null;
}

function ThankYouCard({ userName, className, ...props }: ThankYouCardProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl sm:text-3xl mb-4">
            Thank you <span className="text-red-500">{userName}</span>!
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            {userName
              ? `Thank you, ${userName}, for taking out the time to answer this survey! Hopefully I can get to know you better through this form.`
              : "Thank you for taking out the time to answer this survey! Hopefully I can get to know you better through this form."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            If you'd like to know more about me, feel free to click this link:
          </p>
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            If you'd like to learn more about how I stay in touch with people,
            head over to this link:
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a
                href="https://www.linkedin.com/in/jrs2002/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a
                href="https://github.com/JRS296"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a
                href="https://jrs-studios.web.cern.ch/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio Site
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Thanks once again :)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
