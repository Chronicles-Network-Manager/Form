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

  const sendEmailToUser = async () => {
    setOtpLoading(true);
    setMessage("");

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
    } else {
      setMessage(`OTP sent to ${email}. Please check your email.`);
    }

    setOtpLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Chronicles</CardTitle>
          <CardDescription>
            Hey there! To enter the form, please enter your email (the same one
            from which you received this link) and the OTP sent to your email.
            In case you haven't received an email. You can request a new OTP. Just enter your email and click the button below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">OTP</Label>
                </div>
                <div className="w-full flex items-center">
                  <InputOTP
                    required
                    maxLength={8}
                    className="justify-center"
                    value={otp}
                    onChange={(value) => setOtp(value)}
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Enter The Form!"}
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              {/* OTP Expired?{" "}
              <a href="#" className="underline underline-offset-4">
                Request a new OTP
              </a> */}
              <Button
                onClick={sendEmailToUser}
                className="w-full"
                variant={"outline"}
                disabled={otpLoading}
              >
                {otpLoading ? "Sending OTP..." : "Request a new OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
