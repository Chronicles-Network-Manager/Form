// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import { supabase } from "../Utils/Supabase/client";

// export default function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Verify the email and OTP combination
//       const { data, error: otpError } = await supabase
//         .from("otp_verifications")
//         .select("*")
//         .single();

//       console.log("OTP verification data:", data);

//       if (otpError || !data) {
//         setError("Invalid email/OTP combination or OTP has expired");
//         return;
//       }

//       // Mark OTP as used
//       await supabase
//         .from("otp_verifications")
//         .update({ used: true })
//         .eq("id", data.id);

//       // Create session using OTP as password
//       const { error } = await supabase.auth.signInWithOtp({
//         email, // or phone
//         options: {
//           shouldCreateUser: true, // optional
//         },
//       });

//       console.log("Authentication error:", error);

//       if (error) throw error;

//       // Redirect to protected form
//       router.push("/form");
//     } catch (err) {
//       setError("Authentication failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Chronicles</CardTitle>
//           <CardDescription>
//             Hey there! To enter the form, please enter your email (the same one
//             from which you received this link) and the OTP sent to your email.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-3">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">OTP</Label>
//                 </div>
//                 <div className="w-full flex items-center">
//                   <InputOTP
//                     required
//                     maxLength={8}
//                     className="justify-center"
//                     value={otp}
//                     onChange={(value) => setOtp(value)}
//                   >
//                     <InputOTPGroup>
//                       <InputOTPSlot index={0} />
//                       <InputOTPSlot index={1} />
//                       <InputOTPSlot index={2} />
//                     </InputOTPGroup>
//                     <InputOTPSeparator />
//                     <InputOTPGroup>
//                       <InputOTPSlot index={3} />
//                       <InputOTPSlot index={4} />
//                       <InputOTPSlot index={5} />
//                     </InputOTPGroup>
//                   </InputOTP>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? "Verifying..." : "Enter The Form!"}
//                 </Button>
//               </div>
//             </div>
//             {error && (
//               <div className="mt-4 text-center text-sm text-red-500">
//                 {error}
//               </div>
//             )}
//             <div className="mt-4 text-center text-sm">
//               OTP Expired?{" "}
//               <a href="#" className="underline underline-offset-4">
//                 Request a new OTP
//               </a>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "../Utils/Supabase/client";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify email + OTP token via Supabase auth
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError("Invalid OTP or email. Please try again.");
        setLoading(false);
        return;
      }

      // On success, user is signed in
      router.push("/form");
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [otpLoading, setOtpLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendEmailToUser = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setOtpLoading(true);
    setMessage("");
    setError("");

    if (!email) {
      setMessage("Please enter a valid email.");
      setOtpLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://chronicles-form.netlify.app/form", // Optional: your redirect URL after click
      },
    });

    if (error) {
      setMessage(`Failed to send OTP: ${error.message}`);
      setOtpRequested(false);
    } else {
      setMessage(`OTP sent to ${email}. Please check your email.`);
      setOtpRequested(true);
    }

    setOtpLoading(false);
  };

  const handleBackToEmail = () => {
    setOtpRequested(false);
    setOtp("");
    setMessage("");
    setError("");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Chronicles</CardTitle>
          <CardDescription>
            {!otpRequested
              ? "Hey there! To enter the form, please enter your email address. We'll send you an OTP to verify your identity. We recommend that you access this form on your laptop rather than your mobile device."
              : `OTP has been sent to ${email}. If you are a fisrt time user, you may receive an email to confirm your email address. Please enter the OTP you received, or in case of the confirmation link, please click on the link to continue.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpRequested ? (
            // Step 1: Email Input
            <form onSubmit={sendEmailToUser}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpLoading}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Sending OTP..." : "Request OTP"}
                  </Button>
                </div>
                {message && (
                  <div
                    className={`text-center text-sm ${
                      message.includes("Failed")
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </form>
          ) : (
            // Step 2: OTP Input
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otp">OTP</Label>
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Change Email
                    </button>
                  </div>
                  <div className="w-full flex items-center">
                    <InputOTP
                      required
                      maxLength={8}
                      className="justify-center"
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Enter The Form!"}
                  </Button>
                </div>
                {error && (
                  <div className="text-center text-sm text-red-500">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="text-center text-sm text-green-600">
                    {message}
                  </div>
                )}
                <div className="mt-2 text-center text-sm">
                  <Button
                    type="button"
                    onClick={sendEmailToUser}
                    variant={"outline"}
                    className="w-full"
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Sending OTP..." : "Resend OTP"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
