"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/ui/tags-input";
import { Separator } from "@/components/ui/separator";
import { uploadFormData } from "./../Utils/Supabase/service";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "../Utils/Supabase/client";

const formSchema = z.object({
  firstName: z.string().min(1).nonempty("First name is required"),
  middleNames: z.string().min(1).optional(),
  lastName: z.string().min(1).nonempty("Last name is required"),
  phone: z.string(),
  email: z.string(),
  otherPhones: z.array(z.string()).optional(),
  otherEmails: z.array(z.string()).optional(),
  groups: z.array(z.string()).nonempty("Please add at least one item"),
  birthday: z.coerce.date(),
  anniversaries: z.array(
    z.object({
      label: z.string().optional(),
      date: z.coerce.date().optional(),
    })
  ),
  company: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  yoe: z.coerce.number().min(0, "Must be a non-negative number"),
  work: z.string().optional(),
  workLink: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  address2: z.string().min(1).optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1),
  dreamVacation: z.string().min(1).optional(),
  previous: z.array(
    z.object({
      city: z.string(),
      country: z.string(),
    })
  ),
  visited: z.array(z.string()).nonempty("Please add at least one item"),
  interests: z.array(z.string()).optional(),
  instagram: z.string().min(1).optional(),
  linkedin: z.string().min(1).optional(),
  github: z.string().min(1).optional(),
  reddit: z.string().min(1).optional(),
  discord: z.string().min(1).optional(),
  other: z.string().min(1).optional(),
});

export default function MyForm() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      } else {
        setPageLoad(true);
      }
    };
    checkAuth();
  }, [router, supabase]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groups: [],
      visited: ["Paris - France"],
      birthday: new Date(),
      previous: [{ city: "", country: "" }],
      anniversaries: [{ label: "", date: new Date() }],
      otherPhones: [""],
      otherEmails: [""],
    },
  });

  const {
    fields: anniversaryFields,
    append: appendAnniversary,
    remove: removeAnniversary,
  } = useFieldArray({
    control: form.control,
    name: "anniversaries",
  });

  const {
    fields: previousFields,
    append: appendPrevious,
    remove: removePrevious,
  } = useFieldArray({
    control: form.control,
    name: "previous",
  });

  const otherPhones = form.watch("otherPhones") || [];

  const addPhone = () => {
    form.setValue("otherPhones", [...otherPhones, ""]);
  };

  const removePhone = (index: number) => {
    const updated = [...otherPhones];
    updated.splice(index, 1);
    form.setValue("otherPhones", updated);
  };

  const otherEmails = form.watch("otherEmails") || [];

  const addEmail = () => {
    form.setValue("otherEmails", [...otherEmails, ""]);
  };

  const removeEmail = (index: number) => {
    const updated = [...otherPhones];
    updated.splice(index, 1);
    form.setValue("otherEmails", updated);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");

    try {
      const result = await uploadFormData(values);

      if (result.error) {
        toast.error("Failed to Upload Data " + result);
      } else {
        toast.success("Profile uploaded successfully!");
        const userName = values.firstName || "";
        await supabase.auth.signOut();
        router.push(`/thank-you?user=${encodeURIComponent(userName)}`);
      }
    } catch (err) {
      setError("Form submission failed");
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!pageLoad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  } else {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-4 md:py-10 px-4"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border p-4 gap-4 md:gap-0">
            <div className="space-y-0.5">
              <FormLabel>Hey there {}!</FormLabel>
              <FormDescription className="text-sm md:text-base">
                Hi! I'm Jonathan. Whether we're old friends or new
                acquaintances, I'd love to get to know you better through this
                form. I'm especially interested in learning who to turn to when
                I need advice about moving to a new city (which you may have
                lived in at some point) or trying out new activities that you
                may be interested in. Feel free to answer as much as you like —
                the more details, the better! Without further ado, let's get
                started.
              </FormDescription>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border p-4 gap-4 md:gap-0">
            <div className="space-y-0.5 flex-1">
              <p className="text-sm font-medium leading-none">
                Terms of Data Use<span className="text-red-600">*</span>
              </p>
              <p className="text-sm text-muted-foreground">
                This is a personal project, and all the information you provide
                will be used solely for my personal use. Your data will be
                stored privately on my home computer and will not be shared
                publicly. If you don't feel comfortable sharing this
                information, that's completely fine!
              </p>
            </div>
            <Switch
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              aria-readonly
              className="mt-2 md:mt-0 md:ml-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="Jonathan" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="middleNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name(s)</FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="Rufus!?" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="Samuel" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel>
                      Phone number<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl
                      className={`w-full ${
                        !termsAccepted ? "disabled-overlay" : ""
                      }`}
                    >
                      <PhoneInput
                        placeholder="+91-8197604647"
                        {...field}
                        defaultCountry="IN"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your primary phone number, ideally the one you use
                      Whatsapp with.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={`${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                        placeholder="your-email@gmail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your primary email. Ideally the one you check the
                      most.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="groups"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      How do we know each other?
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                        className={`min-w-full ${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Select connection type" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            <MultiSelectorItem value="Family">
                              Family
                            </MultiSelectorItem>
                            <MultiSelectorItem value="Friends">
                              Friends
                            </MultiSelectorItem>
                            <MultiSelectorItem value="Work">
                              Work
                            </MultiSelectorItem>
                            <MultiSelectorItem value="School">
                              School
                            </MultiSelectorItem>
                            <MultiSelectorItem value="College">
                              College
                            </MultiSelectorItem>
                            <MultiSelectorItem value="Acquaintances">
                              Acquaintances
                            </MultiSelectorItem>
                            <MultiSelectorItem value="WE JUST MET">
                              WE JUST MET
                            </MultiSelectorItem>
                            <MultiSelectorItem value="Community">
                              Community
                            </MultiSelectorItem>
                            <MultiSelectorItem value="Other">
                              Other
                            </MultiSelectorItem>
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormDescription>
                      Feel free to select as many that apply! Any 3rd places
                      would go into Community (The Library, Through Sports,
                      Online, etc)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Add your Birthday!<span className="text-red-600">*</span>
                </FormLabel>
                <DatetimePicker
                  className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                  {...field}
                  format={[["days", "months", "years"], []]}
                />
                <FormDescription>
                  Funnily enough this is what inspired me to build this project
                  XD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anniversaries"
            render={() => (
              <FormItem>
                <FormLabel>Special Dates & Descriptions</FormLabel>
                <FormDescription>
                  Add any memorable dates along with a description.
                </FormDescription>

                {anniversaryFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`mb-4 flex flex-col md:flex-row items-start md:items-center gap-2 ${
                      !termsAccepted ? "disabled-overlay" : ""
                    }`}
                  >
                    {/* Label Input */}
                    <FormControl>
                      <Input
                        placeholder="E.g. Wedding Anniversary"
                        {...form.register(`anniversaries.${index}.label`)}
                        className="w-full md:w-1/2"
                      />
                    </FormControl>

                    {/* Date Picker */}
                    <FormControl>
                      <DatetimePicker
                        {...form.register(
                          `anniversaries.${index}.date` as const
                        )}
                        value={form.watch(`anniversaries.${index}.date`)}
                        onChange={(val) =>
                          form.setValue(
                            `anniversaries.${index}.date`,
                            val ?? new Date()
                          )
                        }
                        format={[["days", "months", "years"], []]}
                        className="w-full md:w-1/2"
                      />
                    </FormControl>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAnniversary(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                  onClick={() =>
                    appendAnniversary({ label: "", date: new Date() })
                  }
                >
                  + Add Row
                </Button>

                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border p-4 gap-4 md:gap-0">
            <div className="space-y-0.5">
              <FormLabel>Your Work</FormLabel>
              <FormDescription>
                Completely Optional! But I'd still love to know more about what
                you do!
              </FormDescription>
            </div>
          </div>

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Company</FormLabel>
                <FormControl>
                  <Input
                    className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    placeholder="CERN"
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the name of the current company you work in!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Job Title</FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="DevOps Engineer" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="yoe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="4" type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Other Phone Numbers */}
            <div className="md:col-span-6 space-y-4">
              {(form.watch("otherPhones") || []).map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`otherPhones.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <div className="flex-1 space-y-2 flex flex-col">
                        <FormLabel>Work Phone Number</FormLabel>
                        <FormControl
                          className={`w-full ${
                            !termsAccepted ? "disabled-overlay" : ""
                          }`}
                        >
                          <PhoneInput
                            placeholder="+41-22-766-67-59"
                            {...field}
                            defaultCountry="CH"
                          />
                        </FormControl>
                        <FormDescription>
                          Your primary phone number (e.g. WhatsApp).
                        </FormDescription>
                        <FormMessage />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        disabled={!termsAccepted}
                        onClick={() => {
                          const current = form.getValues("otherPhones") || [];
                          const updated = [...current];
                          updated.splice(index, 1);
                          form.setValue("otherPhones", updated);
                        }}
                      >
                        X
                      </Button>
                    </FormItem>
                  )}
                />
              ))}

              {/* Add Phone Button outside map for better UX */}
              <Button
                type="button"
                onClick={() => {
                  const current = form.getValues("otherPhones") || [];
                  form.setValue("otherPhones", [...current, ""]);
                }}
                variant="outline"
                className={`${!termsAccepted ? "disabled-overlay" : ""}`}
              >
                + Add Phone
              </Button>
            </div>

            {/* Other Emails */}
            <div className="md:col-span-6 space-y-4">
              {(form.watch("otherEmails") || []).map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`otherEmails.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <div className="flex-1 space-y-2 flex flex-col">
                        <FormLabel>Work Email</FormLabel>
                        <FormControl>
                          <Input
                            className={`${
                              !termsAccepted ? "disabled-overlay" : ""
                            }`}
                            placeholder="jonathan.rufus.samuel@cern.ch"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The email you check most often.
                        </FormDescription>
                        <FormMessage />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        disabled={!termsAccepted}
                        onClick={() => {
                          const current = form.getValues("otherEmails") || [];
                          const updated = [...current];
                          updated.splice(index, 1);
                          form.setValue("otherEmails", updated);
                        }}
                      >
                        X
                      </Button>
                    </FormItem>
                  )}
                />
              ))}

              {/* Add Email Button outside map */}
              <Button
                type="button"
                onClick={() => {
                  const current = form.getValues("otherEmails") || [];
                  form.setValue("otherEmails", [...current, ""]);
                }}
                variant="outline"
                className={`${!termsAccepted ? "disabled-overlay" : ""}`}
              >
                + Add Email
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="work"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Is there anything interesting that you work on?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Feel free to mention something interesting that you work on! (Especially if it's within Computer Science XD)"
                    className={`resize-none ${
                      !termsAccepted ? "disabled-overlay" : ""
                    }`}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Links</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://jrs-studios.web.cern.ch/"
                    type=""
                    className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  If you have a site that you think would be worth visitng, drop
                  it below!{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border p-4 gap-4 md:gap-0">
            <div className="space-y-0.5">
              <FormLabel>Your Global Footprint</FormLabel>
              <FormDescription>
                This was another important reason for building this. You'd be
                surprised by how much of a global reach one may have, and I hope
                to learn from you about the places you have been to, and the
                places you would like to go to! Please do take the time to fill
                out your previous addresses, as well as places that you have
                visited. It's not a requirement, but it would be awesome to
                know!
              </FormDescription>
            </div>
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    placeholder="115 Rue de Pouilly"
                    type=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="01630" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input
                        placeholder="St-Genis Pouilly"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="01630" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl
                      className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    >
                      <Input placeholder="01630" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="previous"
            render={() => (
              <FormItem>
                <FormLabel>Places You've Lived in Previously</FormLabel>
                <FormDescription>
                  Add any place that you have lived in previously. It could be
                  as part of University, Internships, or even your childhood
                  home! Please do try to include as many as you can!
                </FormDescription>

                {previousFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-2 mb-2 ${
                      !termsAccepted ? "disabled-overlay" : ""
                    }`}
                  >
                    <FormControl>
                      <Input
                        placeholder="City"
                        {...form.register(`previous.${index}.city`)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        placeholder="Country"
                        {...form.register(`previous.${index}.country`)}
                        className="w-full"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePrevious(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => appendPrevious({ city: "", country: "" })}
                  variant="outline"
                  className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                >
                  + Add a new City - Country
                </Button>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dreamVacation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  If you had to take a dream vacation, Where would it be?
                </FormLabel>
                <FormControl>
                  <Input
                    className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    placeholder="Tromsø - Norway"
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Feel free to share it as City - Country. Eg: Barcelona -
                  Spain.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visited"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Other Places that you have visited
                  <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl
                  className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                >
                  <TagsInput
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                    placeholder="Enter your tags"
                  />
                </FormControl>
                <FormDescription>
                  Feel free to share it as City - Country. Eg: Barcelona -
                  Spain.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests and Hobbies</FormLabel>
                <FormControl
                  className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                >
                  <TagsInput
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                    placeholder="Enter your tags"
                  />
                </FormControl>
                <FormDescription>
                  Are there any interests or hobbies that you have? Enter them
                  one by one! Same format. Music - I play the Piano, Sports - I
                  love Football!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border p-4 gap-4 md:gap-0">
            <div className="space-y-0.5">
              <FormLabel>Socials</FormLabel>
              <FormDescription>
                And Last but not the least, your socials! I would love to
                connect with you on these platforms. Feel free to share as many
                as you like!
              </FormDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        className={`${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                        placeholder="https://www.instagram.com/"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        className={`${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                        placeholder="https://www.linkedin.com/in/jrs2002/"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord</FormLabel>
                    <FormControl>
                      <Input
                        className={`${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                        placeholder="JRS296"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="reddit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reddit</FormLabel>
                    <FormControl>
                      <Input
                        className={`${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                        placeholder="u/jrs296"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input
                        className={`${
                          !termsAccepted ? "disabled-overlay" : ""
                        }`}
                        placeholder="JRS296"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Others</FormLabel>
                <FormControl>
                  <Input
                    className={`${!termsAccepted ? "disabled-overlay" : ""}`}
                    placeholder="Facebook?"
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Add any other socials you would like to stay connected
                  through!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <div className="">
            <FormLabel>Review Your Answers</FormLabel>
            <FormDescription>Please Review All your Answers</FormDescription>
          </div>

          <Button type="submit">{loading ? "Submitting..." : "Submit"}</Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </Form>
    );
  }
}
