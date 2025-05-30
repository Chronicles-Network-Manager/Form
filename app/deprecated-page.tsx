// "use client";
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
// import { motion } from "framer-motion";
// import { DatePicker } from "./Utils/ShadCN/DatePicker";
// import { steps } from "./Utils/StepArray";

// interface FormData {
//   [key: string]: string | string[] | Anniversary[];
//   additionalPhones: string[];
//   additionalEmails: string[];
//   birthday: string; // ISO date string
//   otherAnniversaries: Anniversary[];
// }

// export interface Anniversary {
//   date: string; // ISO date string
//   comment: string;
// }

// export default function TypeformStyleForm() {
//   const [step, setStep] = useState(0);
//   const [formData, setFormData] = useState<FormData>({
//     additionalPhones: [],
//     additionalEmails: [],
//     birthday: "",
//     otherAnniversaries: [],
//   });

//   const [tosAccepted, setTosAccepted] = useState(false);

//   const currentStep = steps[step];
//   const progressValue = (step / (steps.length - 1)) * 100;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (currentStep.type === "question") {
//       setFormData({
//         ...formData,
//         [currentStep.id]: e.target.value,
//       });
//     }
//   };

//   const nextStep = () => {
//     if (step < steps.length - 1) {
//       // Before moving on from last question step, clean empty entries for additionalPhones and additionalEmails
//       if (currentStep.type === "question" && step === steps.length - 2) {
//         // Clean empty strings from additionalPhones and additionalEmails
//         const cleanedPhones = (formData.additionalPhones || []).filter(
//           (p) => typeof p === "string" && p.trim() !== ""
//         );
//         const cleanedEmails = (formData.additionalEmails || []).filter(
//           (e) => typeof e === "string" && e.trim() !== ""
//         );

//         const cleanedFormData = {
//           ...formData,
//           additionalPhones: cleanedPhones,
//           additionalEmails: cleanedEmails,
//         };

//         console.log("Form Submitted:\n", JSON.stringify(cleanedFormData, null, 2));
//         // You can now submit cleanedFormData to your backend or API here instead of formData
//       }

//       setStep(step + 1);
//       if (currentStep.type === "tos") {
//         setTosAccepted(false);
//       }
//     }
//   };

//   const prevStep = () => {
//     if (step > 0) {
//       setStep(step - 1);
//       if (steps[step - 1].type === "tos") {
//         setTosAccepted(false);
//       }
//     }
//   };

//   const exitForm = () => {
//     // Skip directly to thank you page on exit
//     setStep(steps.length - 1);
//   };

//   const isNextDisabled = () => {
//     if (currentStep.type === "tos") {
//       return !tosAccepted;
//     }
//     if (currentStep.type === "question") {
//       const val = formData[currentStep.id];
//       return typeof val !== "string" || !val.trim();
//     }

//     if (currentStep.type === "multi-input") {
//       // Validate required fields are not empty
//       return currentStep.fields.some(
//         (f) => f.required && !formData[f.id]?.toString().trim()
//       );
//     }
//     if (currentStep.type === "multi-select") {
//       const selected = formData[currentStep.id] as string[] | undefined;
//       return !selected || selected.length < currentStep.minRequired;
//     }
//     return false;
//   };

//   const handleMultiInputChange = (fieldId: string, value: string) => {
//     setFormData({
//       ...formData,
//       [fieldId]: value,
//     });
//   };

//   const handleMultiSelectToggle = (option: string) => {
//     const currentSelection = (formData["relationship"] as string[] | undefined) || [];
//     let updatedSelection;
//     if (currentSelection.includes(option)) {
//       updatedSelection = currentSelection.filter((o) => o !== option);
//     } else {
//       updatedSelection = [...currentSelection, option];
//     }
//     setFormData({
//       ...formData,
//       relationship: updatedSelection,
//     });
//   };

//   function formatInputValue(arg0: string | string[] | Anniversary[]): string | number | readonly string[] | undefined {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <div className="flex items-center justify-center h-screen bg-muted p-4">
//       <Card className="w-full max-w-md shadow-2xl p-6">
//         <CardContent>
//           {currentStep.type !== "thankyou" && (
//             <Progress value={progressValue} className="mb-6" />
//           )}

//           <motion.div
//             key={step}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             {currentStep.type === "intro" && (
//               <div className="whitespace-pre-wrap text-center text-lg font-medium">
//                 {currentStep.content}
//               </div>
//             )}

//             {currentStep.type === "tos" && (
//               <div>
//                 <p className="text-lg font-medium">{currentStep.content}</p>
//                 <p className="mt-4 text-sm text-muted-foreground">
//                   By continuing, you agree to our terms and conditions.
//                 </p>
//                 <div className="mt-6 flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="tosAccepted"
//                     checked={tosAccepted}
//                     onChange={() => setTosAccepted(!tosAccepted)}
//                     className="cursor-pointer"
//                   />
//                   <Label htmlFor="tosAccepted" className="select-none cursor-pointer">
//                     I accept the Terms of Data Use
//                   </Label>
//                 </div>
//                 <div className="mt-6 flex justify-between">
//                   <Button variant="secondary" onClick={exitForm}>
//                     Exit
//                   </Button>
//                   <Button onClick={nextStep} disabled={!tosAccepted}>
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {currentStep.type === "multi-input" && (
//               <div>
//                 {currentStep.fields.map((field) => (
//                   <div key={field.id} className="mb-4">
//                     <Label htmlFor={field.id} className="text-xl font-semibold">
//                       {field.label}
//                     </Label>
//                     <Input
//                       id={field.id}
//                       type={field.inputType}
//                       placeholder={field.placeholder || ""}
//                       value={(formData[field.id] as string) || ""}
//                       onChange={(e) => handleMultiInputChange(field.id, e.target.value)}
//                       className="mt-2"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {currentStep.type === "multi-select" && (
//               <div>
//                 <h3 className="text-xl font-semibold">{currentStep.question}</h3>
//                 <p className="mb-4 text-sm text-muted-foreground">{currentStep.secondaryHeading}</p>
//                 <div className="grid grid-cols-2 gap-2 max-w-md">
//                   {currentStep.options.map((option) => {
//                     const selected = (formData[currentStep.id] as string[] | undefined)?.includes(option) ?? false;
//                     return (
//                       <label
//                         key={option}
//                         className={`cursor-pointer rounded-md border p-2 ${
//                           selected ? "bg-blue-500 text-white" : "bg-white text-gray-700"
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selected}
//                           onChange={() => handleMultiSelectToggle(option)}
//                           className="mr-2 cursor-pointer"
//                         />
//                         {option}
//                       </label>
//                     );
//                   })}
//                 </div>
//                 {isNextDisabled() && (
//                   <p className="mt-2 text-red-600 text-sm">Please select at least one option.</p>
//                 )}
//               </div>
//             )}

//             {currentStep.type === "additionalContacts" && (
//   <div>
//     <h2 className="text-xl font-semibold mb-4">Additional Contacts (Optional)</h2>

//     {/* Additional Phone Numbers */}
//     <div className="mb-6">
//       <Label className="font-semibold">Additional Phone Numbers (max 3)</Label>
//       {((formData.additionalPhones as string[]) || []).map((phone, index) => (
//         <div key={`phone-${index}`} className="flex items-center space-x-2 mt-2">
//           <Input
//             type="tel"
//             placeholder={`Phone #${index + 1}`}
//             value={phone}
//             onChange={(e) => {
//               const newPhones = [...((formData.additionalPhones as string[]) || [])];
//               newPhones[index] = e.target.value;
//               setFormData({ ...formData, additionalPhones: newPhones });
//             }}
//             className="flex-grow"
//           />
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => {
//               const newPhones = [...((formData.additionalPhones as string[]) || [])];
//               newPhones.splice(index, 1);
//               setFormData({ ...formData, additionalPhones: newPhones });
//             }}
//           >
//             Delete
//           </Button>
//         </div>
//       ))}
//       <Button
//         variant="secondary"
//         className="mt-3"
//         onClick={() => {
//           const newPhones = [...((formData.additionalPhones as string[]) || [])];
//           if (newPhones.length < 3) {
//             newPhones.push("");
//             setFormData({ ...formData, additionalPhones: newPhones });
//           }
//         }}
//         disabled={((formData.additionalPhones as string[])?.length || 0) >= 3}
//       >
//         Add Phone Number
//       </Button>
//     </div>

//     {/* Additional Emails */}
//     <div>
//       <Label className="font-semibold">Additional Emails (max 3)</Label>
//       {((formData.additionalEmails as string[]) || []).map((email, index) => (
//         <div key={`email-${index}`} className="flex items-center space-x-2 mt-2">
//           <Input
//             type="email"
//             placeholder={`Email #${index + 1}`}
//             value={email}
//             onChange={(e) => {
//               const newEmails = [...((formData.additionalEmails as string[]) || [])];
//               newEmails[index] = e.target.value;
//               setFormData({ ...formData, additionalEmails: newEmails });
//             }}
//             className="flex-grow"
//           />
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => {
//               const newEmails = [...((formData.additionalEmails as string[]) || [])];
//               newEmails.splice(index, 1);
//               setFormData({ ...formData, additionalEmails: newEmails });
//             }}
//           >
//             Delete
//           </Button>
//         </div>
//       ))}
//       <Button
//         variant="secondary"
//         className="mt-3"
//         onClick={() => {
//           const newEmails = [...((formData.additionalEmails as string[]) || [])];
//           if (newEmails.length < 3) {
//             newEmails.push("");
//             setFormData({ ...formData, additionalEmails: newEmails });
//           }
//         }}
//         disabled={((formData.additionalEmails as string[])?.length || 0) >= 3}
//       >
//         Add Email
//       </Button>
//     </div>
//   </div>
// )}

// {currentStep.type === "birthdayAnniversaries" && (
//   <div>
//     <h2 className="text-xl font-semibold mb-4">Birthday & Anniversaries</h2>

//     {/* Birthday */}
//     <DatePicker
//       value={formData.birthday ? new Date(formData.birthday) : undefined}
//       onChange={(date) => {
//         setFormData({ ...formData, birthday: date ? date.toISOString().slice(0, 10) : "" });
//       }}
//       className="mt-2"
//       placeholder="Select birthday"
//     />

//     {/* Other Anniversaries */}
//     <div>
//       <Label className="font-semibold">Other Anniversaries (max 3)</Label>
//       {(formData.otherAnniversaries || []).map((anniversary, index) => (
//         <div key={`anniversary-${index}`} className="flex items-center gap-4 mt-2">
//           <DatePicker
//             value={anniversary.date ? new Date(anniversary.date) : undefined}
//             onChange={(date) => {
//               const newAnniversaries = [...(formData.otherAnniversaries || [])];
//               newAnniversaries[index].date = date ? date.toISOString().slice(0, 10) : "";
//               setFormData({ ...formData, otherAnniversaries: newAnniversaries });
//             }}
//             placeholder="Select date"
//           />
//           <Input
//             type="text"
//             placeholder="Comment"
//             value={anniversary.comment}
//             onChange={(e) => {
//               const newAnniversaries = [...(formData.otherAnniversaries || [])];
//               newAnniversaries[index].comment = e.target.value;
//               setFormData({ ...formData, otherAnniversaries: newAnniversaries });
//             }}
//             className="flex-1"
//           />
//           <Button
//             variant="destructive"
//             onClick={() => {
//               const newAnniversaries = [...(formData.otherAnniversaries || [])];
//               newAnniversaries.splice(index, 1);
//               setFormData({ ...formData, otherAnniversaries: newAnniversaries });
//             }}
//           >
//             Delete
//           </Button>
//         </div>
//       ))}

//       <Button
//         variant="secondary"
//         className="mt-3"
//         onClick={() => {
//           const newAnniversaries = [...(formData.otherAnniversaries || [])];
//           if (newAnniversaries.length < 3) {
//             newAnniversaries.push({ date: "", comment: "" });
//             setFormData({ ...formData, otherAnniversaries: newAnniversaries });
//           }
//         }}
//         disabled={(formData.otherAnniversaries?.length || 0) >= 3}
//       >
//         Add Anniversary
//       </Button>
//     </div>
//   </div>
// )}

//             {currentStep.type === "question" && (
//   <div>
//     <Label htmlFor={currentStep.id} className="text-xl font-semibold">
//       {currentStep.label}
//     </Label>
//     <Input
//       id={currentStep.id}
//       type={currentStep.inputType}
//       placeholder={currentStep.placeholder}
//       value={formatInputValue(formData[currentStep.id])}
//       onChange={handleChange}
//       className="mt-4"
//     />
//   </div>
// )}

//             {currentStep.type === "thankyou" && (
//               <div className="text-center space-y-4">
//                 <h2 className="text-2xl font-bold">THANK YOU</h2>
//                 <p>
//                   Thank you for taking out the time to answer this survey! If you'd like to know more about me, feel free to click this link:
//                 </p>
//                 <p>
//                   If you'd like to learn more about how I stay in touch with people, head over to this link:
//                 </p>
//                 <p>Thanks once again :)</p>

//                 <div className="mt-6 flex justify-center space-x-4">
//                   <a
//                     href="https://linkedin.com/in/yourprofile"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
//                   >
//                     LinkedIn
//                   </a>
//                   <a
//                     href="https://github.com/yourprofile"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
//                   >
//                     GitHub
//                   </a>
//                   <a
//                     href="https://yourportfolio.com"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
//                   >
//                     Portfolio
//                   </a>
//                 </div>
//               </div>
//             )}

//             {currentStep.type !== "tos" && currentStep.type !== "thankyou" && (
//               <div className="mt-6 flex justify-between">
//                 <Button variant="secondary" onClick={prevStep} disabled={step === 0}>
//                   Back
//                 </Button>
//                 <Button onClick={nextStep} disabled={isNextDisabled()}>
//                   {currentStep.type === "question" && step === steps.length - 2
//                     ? "Submit"
//                     : step < steps.length - 1
//                     ? "Next"
//                     : "Finish"}
//                 </Button>
//               </div>
//             )}
//           </motion.div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }