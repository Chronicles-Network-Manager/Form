// // src/components/multi-step-form.tsx
// "use client";

// import * as React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";
// import { Badge } from "@/components/ui/badge";
// import { X } from "lucide-react";

// // Define form schema
// const formSchema = z.object({
//   acceptedTerms: z.boolean().default(false),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   middleName: z.string().optional(),
//   primaryPhone: z.string().min(1, "Primary phone is required"),
//   primaryEmail: z.string().email("Invalid email address"),
//   relationships: z.array(z.string()).min(1, "Select at least one relationship"),
//   additionalPhones: z.array(z.string()).max(3).optional(),
//   additionalEmails: z.array(z.string()).max(3).optional(),
//   birthday: z.string().min(1, "Birthday is required"),
//   anniversaries: z.array(z.string()).optional(),
//   company: z.string().optional(),
//   jobTitle: z.string().optional(),
//   yearsOfExperience: z.string().optional(),
//   scopeOfWork: z.array(z.string()).optional(),
//   workDescription: z.string().optional(),
//   portfolioLink: z.string().url("Invalid URL").optional(),
//   currentAddress: z.object({
//     address: z.string().min(1, "Address is required"),
//     address2: z.string().optional(),
//     city: z.string().min(1, "City is required"),
//     postCode: z.string().optional(),
//     state: z.string().optional(),
//     country: z.string().min(1, "Country is required"),
//   }),
//   previousLocations: z.array(
//     z.object({
//       address: z.string().min(1, "Address is required"),
//       address2: z.string().optional(),
//       city: z.string().min(1, "City is required"),
//       postCode: z.string().optional(),
//       state: z.string().optional(),
//       country: z.string().min(1, "Country is required"),
//     })
//   ),
//   dreamVacation: z.string().min(1, "Please share your dream vacation"),
//   visitedPlaces: z.array(z.string()),
//   interests: z.array(z.string()),
//   instagram: z.string().optional(),
//   linkedin: z.string().optional(),
//   github: z.string().optional(),
//   discord: z.string().optional(),
//   otherSocial: z.string().optional(),
// });

// const relationshipTypes = [
//   "Family",
//   "Friends",
//   "Work",
//   "School",
//   "College",
//   "Acquaintances",
//   "WE JUST MET",
//   "Community",
//   "Other",
// ] as const;

// const continents = [
//   "Africa",
//   "Antarctica",
//   "Asia",
//   "Europe",
//   "North America",
//   "Oceania",
//   "South America",
//   "Worldwide",
// ] as const;

// export function MultiStepForm() {
//   const [step, setStep] = React.useState(1);
//   const [visitedPlacesInput, setVisitedPlacesInput] = React.useState("");
//   const [interestsInput, setInterestsInput] = React.useState("");
//   const [newAnniversary, setNewAnniversary] = React.useState("");
//   const [newAdditionalPhone, setNewAdditionalPhone] = React.useState("");
//   const [newAdditionalEmail, setNewAdditionalEmail] = React.useState("");

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       acceptedTerms: false,
//       firstName: "",
//       lastName: "",
//       middleName: "",
//       primaryPhone: "",
//       primaryEmail: "",
//       relationships: [],
//       additionalPhones: [],
//       additionalEmails: [],
//       birthday: "",
//       anniversaries: [],
//       company: "",
//       jobTitle: "",
//       yearsOfExperience: "",
//       scopeOfWork: [],
//       workDescription: "",
//       portfolioLink: "",
//       currentAddress: {
//         address: "",
//         address2: "",
//         city: "",
//         postCode: "",
//         state: "",
//         country: "",
//       },
//       previousLocations: [
//         {
//           address: "",
//           address2: "",
//           city: "",
//           postCode: "",
//           state: "",
//           country: "",
//         },
//       ],
//       dreamVacation: "",
//       visitedPlaces: [],
//       interests: [],
//       instagram: "",
//       linkedin: "",
//       github: "",
//       discord: "",
//       otherSocial: "",
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     toast({
//       title: "Form submitted successfully",
//       description: "Thank you for completing the form!",
//     });
//     setStep(16); // Go to thank you page
//   }

//   const handleNext = () => {
//     // Validate current step before proceeding
//     if (step === 2 && !form.getValues("acceptedTerms")) {
//       form.setError("acceptedTerms", {
//         type: "manual",
//         message: "You must accept the terms to continue",
//       });
//       return;
//     }

//     if (step === 3) {
//       form.trigger(["firstName", "lastName", "primaryPhone", "primaryEmail"]);
//       if (
//         !form.getValues("firstName") ||
//         !form.getValues("lastName") ||
//         !form.getValues("primaryPhone") ||
//         !form.getValues("primaryEmail")
//       ) {
//         return;
//       }
//     }

//     if (step === 4 && form.getValues("relationships").length === 0) {
//       form.setError("relationships", {
//         type: "manual",
//         message: "Select at least one relationship type",
//       });
//       return;
//     }

//     setStep((prev) => Math.min(prev + 1, 15));
//   };

//   const handleBack = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleExitTerms = () => {
//     setStep(16); // Skip to thank you page
//   };

//   const addVisitedPlace = () => {
//     if (visitedPlacesInput.trim() && !form.getValues("visitedPlaces").includes(visitedPlacesInput)) {
//       form.setValue("visitedPlaces", [...form.getValues("visitedPlaces"), visitedPlacesInput]);
//       setVisitedPlacesInput("");
//     }
//   };

//   const removeVisitedPlace = (place: string) => {
//     form.setValue(
//       "visitedPlaces",
//       form.getValues("visitedPlaces").filter((p) => p !== place)
//     );
//   };

//   const addInterest = () => {
//     if (interestsInput.trim() && !form.getValues("interests").includes(interestsInput)) {
//       form.setValue("interests", [...form.getValues("interests"), interestsInput]);
//       setInterestsInput("");
//     }
//   };

//   const removeInterest = (interest: string) => {
//     form.setValue(
//       "interests",
//       form.getValues("interests").filter((i) => i !== interest)
//     );
//   };

//   const addAnniversary = () => {
//     if (newAnniversary.trim()) {
//       form.setValue("anniversaries", [...(form.getValues("anniversaries") || []), newAnniversary]);
//       setNewAnniversary("");
//     }
//   };

//   const removeAnniversary = (anniversary: string) => {
//     form.setValue(
//       "anniversaries",
//       form.getValues("anniversaries")?.filter((a) => a !== anniversary) || []
//     );
//   };

//   const addAdditionalPhone = () => {
//     if (newAdditionalPhone.trim() && (form.getValues("additionalPhones")?.length || 0) < 3) {
//       form.setValue("additionalPhones", [...(form.getValues("additionalPhones") || []), newAdditionalPhone]);
//       setNewAdditionalPhone("");
//     }
//   };

//   const removeAdditionalPhone = (phone: string) => {
//     form.setValue(
//       "additionalPhones",
//       form.getValues("additionalPhones")?.filter((p) => p !== phone) || []
//     );
//   };

//   const addAdditionalEmail = () => {
//     if (newAdditionalEmail.trim() && (form.getValues("additionalEmails")?.length || 0) < 3) {
//       form.setValue("additionalEmails", [...(form.getValues("additionalEmails") || []), newAdditionalEmail]);
//       setNewAdditionalEmail("");
//     }
//   };

//   const removeAdditionalEmail = (email: string) => {
//     form.setValue(
//       "additionalEmails",
//       form.getValues("additionalEmails")?.filter((e) => e !== email) || []
//     );
//   };

//   const addPreviousLocation = () => {
//     form.setValue("previousLocations", [
//       ...form.getValues("previousLocations"),
//       {
//         address: "",
//         address2: "",
//         city: "",
//         postCode: "",
//         state: "",
//         country: "",
//       },
//     ]);
//   };

//   const removePreviousLocation = (index: number) => {
//     const prevLocs = form.getValues("previousLocations");
//     if (prevLocs.length > 1) {
//       form.setValue(
//         "previousLocations",
//         prevLocs.filter((_, i) => i !== index)
//       );
//     }
//   };

//   const progress = (step / 15) * 100;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <Progress value={progress} className="mb-6" />
      
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Page 1: Introduction */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Welcome to Our Form</h2>
//               <p>
//                 This form will guide you through several steps to collect information about you.
//                 Please take your time to fill out each section accurately.
//               </p>
//               <p>Click "Next" to begin.</p>
//             </div>
//           )}

//           {/* Page 2: Terms of Service */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Terms of Service</h2>
//               <div className="border p-4 rounded-md max-h-96 overflow-y-auto">
//                 <h3 className="font-bold mb-2">Terms and Conditions</h3>
//                 <p className="mb-4">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget
//                   ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
//                   Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
//                   ultricies nisl nisl eget nisl.
//                 </p>
//                 <h3 className="font-bold mb-2">Privacy Policy</h3>
//                 <p>
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget
//                   ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
//                   Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
//                   ultricies nisl nisl eget nisl.
//                 </p>
//               </div>
//               <FormField
//                 control={form.control}
//                 name="acceptedTerms"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>I agree to the Terms of Service</FormLabel>
//                       <FormDescription>
//                         You must agree to the terms to continue
//                       </FormDescription>
//                       {form.formState.errors.acceptedTerms && (
//                         <FormMessage>{form.formState.errors.acceptedTerms.message}</FormMessage>
//                       )}
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleExitTerms}>
//                   Exit
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 3: Personal Information */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Personal Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>First Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="John" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Last Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Doe" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="middleName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Middle Name (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Michael" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="primaryPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Primary Phone Number</FormLabel>
//                       <FormControl>
//                         <Input placeholder="+1 (555) 123-4567" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="primaryEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Primary Email Address</FormLabel>
//                       <FormControl>
//                         <Input placeholder="john.doe@example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 4: Relationship Types */}
//           {step === 4 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Relationship Types</h2>
//               <p>Select all that apply to our relationship:</p>
//               <FormField
//                 control={form.control}
//                 name="relationships"
//                 render={() => (
//                   <FormItem>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {relationshipTypes.map((item) => (
//                         <FormField
//                           key={item}
//                           control={form.control}
//                           name="relationships"
//                           render={({ field }) => {
//                             return (
//                               <FormItem
//                                 key={item}
//                                 className="flex flex-row items-start space-x-3 space-y-0"
//                               >
//                                 <FormControl>
//                                   <Checkbox
//                                     checked={field.value?.includes(item)}
//                                     onCheckedChange={(checked) => {
//                                       return checked
//                                         ? field.onChange([...field.value, item])
//                                         : field.onChange(
//                                             field.value?.filter(
//                                               (value) => value !== item
//                                             )
//                                           );
//                                     }}
//                                   />
//                                 </FormControl>
//                                 <FormLabel className="font-normal">
//                                   {item}
//                                 </FormLabel>
//                               </FormItem>
//                             );
//                           }}
//                         />
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 5: Additional Contact Info */}
//           {step === 5 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Additional Contact Information</h2>
              
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Additional Phone Numbers (Max 3)</h3>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Additional phone number"
//                     value={newAdditionalPhone}
//                     onChange={(e) => setNewAdditionalPhone(e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     onClick={addAdditionalPhone}
//                     disabled={!newAdditionalPhone.trim() || (form.getValues("additionalPhones")?.length || 0) >= 3}
//                   >
//                     Add
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {form.getValues("additionalPhones")?.map((phone, index) => (
//                     <Badge key={index} variant="outline" className="flex items-center gap-1">
//                       {phone}
//                       <button
//                         type="button"
//                         onClick={() => removeAdditionalPhone(phone)}
//                         className="text-muted-foreground hover:text-foreground"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Additional Email Addresses (Max 3)</h3>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Additional email address"
//                     value={newAdditionalEmail}
//                     onChange={(e) => setNewAdditionalEmail(e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     onClick={addAdditionalEmail}
//                     disabled={!newAdditionalEmail.trim() || (form.getValues("additionalEmails")?.length || 0) >= 3}
//                   >
//                     Add
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {form.getValues("additionalEmails")?.map((email, index) => (
//                     <Badge key={index} variant="outline" className="flex items-center gap-1">
//                       {email}
//                       <button
//                         type="button"
//                         onClick={() => removeAdditionalEmail(email)}
//                         className="text-muted-foreground hover:text-foreground"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 6: Birthday and Anniversaries */}
//           {step === 6 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Important Dates</h2>
              
//               <FormField
//                 control={form.control}
//                 name="birthday"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Birthday</FormLabel>
//                     <FormControl>
//                       <Input type="date" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Anniversaries (Optional)</h3>
//                 <div className="flex gap-2">
//                   <Input
//                     type="date"
//                     placeholder="Anniversary date"
//                     value={newAnniversary}
//                     onChange={(e) => setNewAnniversary(e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     onClick={addAnniversary}
//                     disabled={!newAnniversary.trim()}
//                   >
//                     Add
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {form.getValues("anniversaries")?.map((anniversary, index) => (
//                     <Badge key={index} variant="outline" className="flex items-center gap-1">
//                       {anniversary}
//                       <button
//                         type="button"
//                         onClick={() => removeAnniversary(anniversary)}
//                         className="text-muted-foreground hover:text-foreground"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 7: Professional Information */}
//           {step === 7 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Professional Information</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="company"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Company</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Acme Inc." {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="jobTitle"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Job Title</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Software Engineer" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="yearsOfExperience"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Years of Experience</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="5" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="scopeOfWork"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Scope of Work (Select all that apply)</FormLabel>
//                     <Select
//                       onValueChange={(value) => {
//                         if (value === "Worldwide") {
//                           field.onChange(["Worldwide"]);
//                         } else {
//                           const current = field.value || [];
//                           if (current.includes("Worldwide")) {
//                             field.onChange([value]);
//                           } else if (current.includes(value)) {
//                             field.onChange(current.filter((v) => v !== value));
//                           } else {
//                             field.onChange([...current, value]);
//                           }
//                         }
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select continents" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {continents.map((continent) => (
//                           <SelectItem key={continent} value={continent}>
//                             {continent}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {field.value?.map((continent) => (
//                         <Badge key={continent} variant="outline">
//                           {continent}
//                         </Badge>
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="workDescription"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>What do you do?</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Describe your work..."
//                         className="resize-none"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="portfolioLink"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Portfolio Link (Optional)</FormLabel>
//                     <FormControl>
//                       <Input placeholder="https://yourportfolio.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 8: Current Location */}
//           {step === 8 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Current Location</h2>
              
//               <FormField
//                 control={form.control}
//                 name="currentAddress.address"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="123 Main St" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="currentAddress.address2"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address Line 2 (Optional)</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Apt 4B" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="currentAddress.city"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>City</FormLabel>
//                       <FormControl>
//                         <Input placeholder="New York" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="currentAddress.postCode"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Postal Code (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="10001" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="currentAddress.state"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>State/Province (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="NY" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="currentAddress.country"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Country</FormLabel>
//                     <FormControl>
//                       <Input placeholder="United States" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 9: Previous Locations */}
//           {step === 9 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Previous Locations</h2>
              
//               {form.getValues("previousLocations").map((_, index) => (
//                 <div key={index} className="space-y-4 border p-4 rounded-md">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-lg font-semibold">Location {index + 1}</h3>
//                     {index > 0 && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removePreviousLocation(index)}
//                       >
//                         Remove
//                       </Button>
//                     )}
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name={`previousLocations.${index}.address`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Address</FormLabel>
//                         <FormControl>
//                           <Input placeholder="123 Main St" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name={`previousLocations.${index}.address2`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Address Line 2 (Optional)</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Apt 4B" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`previousLocations.${index}.city`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>City</FormLabel>
//                           <FormControl>
//                             <Input placeholder="New York" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name={`previousLocations.${index}.postCode`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Postal Code (Optional)</FormLabel>
//                           <FormControl>
//                             <Input placeholder="10001" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name={`previousLocations.${index}.state`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>State/Province (Optional)</FormLabel>
//                           <FormControl>
//                             <Input placeholder="NY" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name={`previousLocations.${index}.country`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Country</FormLabel>
//                         <FormControl>
//                           <Input placeholder="United States" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               ))}

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={addPreviousLocation}
//                 className="w-full"
//               >
//                 Add Another Previous Location
//               </Button>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 10: Dream Vacation */}
//           {step === 10 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Dream Vacation</h2>
              
//               <FormField
//                 control={form.control}
//                 name="dreamVacation"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>If you could take a dream vacation, where would it be?</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Describe your dream vacation destination..."
//                         className="resize-none"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 11: Visited Places */}
//           {step === 11 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Places You've Visited</h2>
//               <p className="text-sm text-muted-foreground">
//                 Please enter places in the format "City - Country"
//               </p>
              
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Paris - France"
//                   value={visitedPlacesInput}
//                   onChange={(e) => setVisitedPlacesInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       addVisitedPlace();
//                     }
//                   }}
//                 />
//                 <Button
//                   type="button"
//                   onClick={addVisitedPlace}
//                   disabled={!visitedPlacesInput.trim()}
//                 >
//                   Add
//                 </Button>
//               </div>
              
//               <div className="flex flex-wrap gap-2">
//                 {form.getValues("visitedPlaces").map((place, index) => (
//                   <Badge key={index} variant="outline" className="flex items-center gap-1">
//                     {place}
//                     <button
//                       type="button"
//                       onClick={() => removeVisitedPlace(place)}
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 ))}
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 12: Interests and Hobbies */}
//           {step === 12 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Interests and Hobbies</h2>
              
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Photography, Hiking, etc."
//                   value={interestsInput}
//                   onChange={(e) => setInterestsInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       addInterest();
//                     }
//                   }}
//                 />
//                 <Button
//                   type="button"
//                   onClick={addInterest}
//                   disabled={!interestsInput.trim()}
//                 >
//                   Add
//                 </Button>
//               </div>
              
//               <div className="flex flex-wrap gap-2">
//                 {form.getValues("interests").map((interest, index) => (
//                   <Badge key={index} variant="outline" className="flex items-center gap-1">
//                     {interest}
//                     <button
//                       type="button"
//                       onClick={() => removeInterest(interest)}
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 ))}
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 13: Social Media */}
//           {step === 13 && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Social Media Profiles</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="instagram"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Instagram</FormLabel>
//                       <FormControl>
//                         <Input placeholder="@username" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="linkedin"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>LinkedIn</FormLabel>
//                       <FormControl>
//                         <Input placeholder="linkedin.com/in/username" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="github"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>GitHub</FormLabel>
//                       <FormControl>
//                         <Input placeholder="github.com/username" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="discord"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Discord</FormLabel>
//                       <FormControl>
//                         <Input placeholder="username#1234" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="otherSocial"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Other Social Media</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Your other social media profile" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <Button type="button" onClick={handleNext}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Page 14: Review Answers */}
//           {step === 14 && (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold">Review Your Answers</h2>
              
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Personal Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-muted-foreground">First Name</p>
//                     <p>{form.getValues("firstName")}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Last Name</p>
//                     <p>{form.getValues("lastName")}</p>
//                   </div>
//                   {form.getValues("middleName") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Middle Name</p>
//                       <p>{form.getValues("middleName")}</p>
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-sm text-muted-foreground">Primary Phone</p>
//                     <p>{form.getValues("primaryPhone")}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Primary Email</p>
//                     <p>{form.getValues("primaryEmail")}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Birthday</p>
//                     <p>{form.getValues("birthday")}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Relationships</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {form.getValues("relationships").map((rel) => (
//                     <Badge key={rel} variant="outline">
//                       {rel}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {form.getValues("additionalPhones")?.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Additional Phone Numbers</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {form.getValues("additionalPhones").map((phone, index) => (
//                       <Badge key={index} variant="outline">
//                         {phone}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {form.getValues("additionalEmails")?.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Additional Email Addresses</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {form.getValues("additionalEmails").map((email, index) => (
//                       <Badge key={index} variant="outline">
//                         {email}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {form.getValues("anniversaries")?.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Anniversaries</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {form.getValues("anniversaries").map((anniversary, index) => (
//                       <Badge key={index} variant="outline">
//                         {anniversary}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Professional Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {form.getValues("company") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Company</p>
//                       <p>{form.getValues("company")}</p>
//                     </div>
//                   )}
//                   {form.getValues("jobTitle") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Job Title</p>
//                       <p>{form.getValues("jobTitle")}</p>
//                     </div>
//                   )}
//                   {form.getValues("yearsOfExperience") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Years of Experience</p>
//                       <p>{form.getValues("yearsOfExperience")}</p>
//                     </div>
//                   )}
//                   {form.getValues("scopeOfWork")?.length > 0 && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Scope of Work</p>
//                       <div className="flex flex-wrap gap-2">
//                         {form.getValues("scopeOfWork").map((scope) => (
//                           <Badge key={scope} variant="outline">
//                             {scope}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {form.getValues("workDescription") && (
//                     <div className="col-span-full">
//                       <p className="text-sm text-muted-foreground">Work Description</p>
//                       <p>{form.getValues("workDescription")}</p>
//                     </div>
//                   )}
//                   {form.getValues("portfolioLink") && (
//                     <div className="col-span-full">
//                       <p className="text-sm text-muted-foreground">Portfolio Link</p>
//                       <a
//                         href={form.getValues("portfolioLink")}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:underline"
//                       >
//                         {form.getValues("portfolioLink")}
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Current Location</h3>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Address</p>
//                   <p>{form.getValues("currentAddress.address")}</p>
//                   {form.getValues("currentAddress.address2") && (
//                     <p>{form.getValues("currentAddress.address2")}</p>
//                   )}
//                   <p>
//                     {form.getValues("currentAddress.city")}
//                     {form.getValues("currentAddress.state")
//                       ? `, ${form.getValues("currentAddress.state")}`
//                       : ""}
//                     {form.getValues("currentAddress.postCode")
//                       ? ` ${form.getValues("currentAddress.postCode")}`
//                       : ""}
//                   </p>
//                   <p>{form.getValues("currentAddress.country")}</p>
//                 </div>
//               </div>

//               {form.getValues("previousLocations").length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Previous Locations</h3>
//                   {form.getValues("previousLocations").map((loc, index) => (
//                     <div key={index} className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Location {index + 1}</p>
//                       <p>{loc.address}</p>
//                       {loc.address2 && <p>{loc.address2}</p>}
//                       <p>
//                         {loc.city}
//                         {loc.state ? `, ${loc.state}` : ""}
//                         {loc.postCode ? ` ${loc.postCode}` : ""}
//                       </p>
//                       <p>{loc.country}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Dream Vacation</h3>
//                 <p>{form.getValues("dreamVacation")}</p>
//               </div>

//               {form.getValues("visitedPlaces").length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Places You've Visited</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {form.getValues("visitedPlaces").map((place, index) => (
//                       <Badge key={index} variant="outline">
//                         {place}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {form.getValues("interests").length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Interests and Hobbies</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {form.getValues("interests").map((interest, index) => (
//                       <Badge key={index} variant="outline">
//                         {interest}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Social Media</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {form.getValues("instagram") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Instagram</p>
//                       <p>{form.getValues("instagram")}</p>
//                     </div>
//                   )}
//                   {form.getValues("linkedin") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">LinkedIn</p>
//                       <p>{form.getValues("linkedin")}</p>
//                     </div>
//                   )}
//                   {form.getValues("github") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">GitHub</p>
//                       <p>{form.getValues("github")}</p>
//                     </div>
//                   )}
//                   {form.getValues("discord") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Discord</p>
//                       <p>{form.getValues("discord")}</p>
//                     </div>
//                   )}
//                   {form.getValues("otherSocial") && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Other Social</p>
//                       <p>{form.getValues("otherSocial")}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <Button type="button" variant="outline" onClick={handleBack}>
//                   Back
//                 </Button>
//                 <div className="space-x-2">
//                   <Button type="button" variant="outline" onClick={() => setStep(1)}>
//                     Edit All
//                   </Button>
//                   <Button type="submit">Submit</Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Page 15: Thank You */}
//           {step === 15 && (
//             <div className="space-y-4 text-center">
//               <h2 className="text-2xl font-bold">Thank You!</h2>
//               <p>Your form has been submitted successfully.</p>
//               <p>We appreciate your time and information.</p>
//             </div>
//           )}
//         </form>
//       </Form>
//     </div>
//   );
// }