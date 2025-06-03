import { createClient } from "@supabase/supabase-js";
import { supabase } from "./client";

type FormValues = {
  firstName: string;
  middleNames?: string;
  lastName: string;
  phone: string;
  email: string;
  otherPhones?: string[];
  otherEmails?: string[];
  jobTitle?: string;
  company?: string;
  work?: string;
  birthday: Date;
  anniversaries?: { label?: string; date?: Date }[];
  groups: string[];
  interests?: string[];
  favourites?: string;
  yoe?: number;
  workLink?: string;  
  otherAddress?: string;
  currentLocation: { city: string; country: string, state?: string, latitude: number, longitude: number, formatted: string, address: string, address2: string, postcode: string }[];
  dreamVacation?: string;
  previous?: { city: string; country: string, latitude: number, longitude: number }[];
  visited?: { city: string; country: string, latitude: number, longitude: number }[];
  instagram?: string;
  linkedin?: string;
  github?: string;
  reddit?: string;
  discord?: string;
  other?: string;
};

export async function uploadFormData(values: FormValues) {
  try {
    //console.log("🔍 Checking if contact already exists...");

    const { data: existingUser, error: userCheckError } = await supabase
      .from("Contacts")
      .select("userId")
      .eq("email", values.email)
      .maybeSingle();

    if (userCheckError && userCheckError.code !== "PGRST116") {
      //console.error("❌ Error checking existing user:", userCheckError);
      return { data: null, error: userCheckError };
    }

    let userId: string;

    if (existingUser) {
      //console.log("✅ Existing user found:", existingUser.userId);
      userId = existingUser.userId;
    } else {
      const insertPayload = {
        firstName: values.firstName,
        middleNames: values.middleNames ?? null,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        otherPhones: values.otherPhones ?? [],
        otherEmails: values.otherEmails ?? [],
        jobTitle: values.jobTitle ?? null,
        company: values.company ?? null,
        work: values.work ?? null,
        birthday: values.birthday,
        anniversaries: values.anniversaries?.map((a) => a.date) ?? [],
        groups: values.groups ?? [],
        interests: values.interests ?? [],
        yoe: values.yoe ?? null,
        workLink: values.workLink ?? null,
        favourites: values.favourites ?? null,
      };

      //console.log("📦 Inserting new contact with payload:", insertPayload);

      const { data: newContact, error: insertError } = await supabase
        .from("Contacts")
        .insert(insertPayload)
        .select("userId")
        .single();

      if (insertError || !newContact) {
        //console.error("❌ Error inserting contact:", insertError);
        return { data: null, error: insertError };
      }

      //console.log("✅ New contact inserted:", newContact.userId);
      userId = newContact.userId;
    }

    const locationError = await insertLocations(userId, values);
    if (locationError) {
      //console.error("❌ Error inserting locations:", locationError);
      return { data: null, error: locationError };
    }

    const socialsPayload = {
      userId,
      instagram: values.instagram ?? null,
      linkedin: values.linkedin ?? null,
      github: values.github ?? null,
      reddit: values.reddit ?? null,
      discord: values.discord ?? null,
      other: values.other ?? null,
    };

    //console.log("🌐 Inserting socials:", socialsPayload);

    const { error: socialsError } = await supabase
      .from("Socials")
      .insert(socialsPayload);

    if (socialsError) {
      //console.error("❌ Error inserting socials:", socialsError);
      return { data: null, error: socialsError };
    }

    //console.log("✅ All data uploaded successfully for user:", userId);

    return { data: { userId }, error: null };
  } catch (err) {
    //console.error("🔥 Unexpected error during upload:", err);
    return { data: null, error: err };
  }
}

// Assuming `values` has these fields:
// values.address, values.address2, values.city, values.postalCode, values.state, values.country
// values.previous: { city: string; country: string }[]
// values.visited: { city: string; country: string }[]

const insertLocations = async (userId: string, values: FormValues) => {
  // Insert CURRENT location if at least one address field is non-null/non-empty
  if (
    values.currentLocation
  ) {
    const currentLocationPayload = {
      userId,
      address: values.currentLocation[0].address ?? null,
      address2: values.currentLocation[0].address2 ?? null,
      city: values.currentLocation[0].city ?? null,
      postalcode: values.currentLocation[0].postcode ?? null,
      state: values.currentLocation[0].state ?? null,
      country: values.currentLocation[0].country ?? null,
      latitude: values.currentLocation[0].latitude ?? 0,
      longitude: values.currentLocation[0].longitude ?? 0,
      type: "CURRENT",
    };
    //console.log("📍 Inserting CURRENT location:", currentLocationPayload);
    const { error: currentError } = await supabase
      .from("Location")
      .insert(currentLocationPayload);
    if (currentError) return currentError;
  }

  // Insert PREVIOUS locations - array of { city, country }
  if (Array.isArray(values.previous)) {
    for (const prev of values.previous) {
      if (prev.city && prev.country) {
        const previousPayload = {
          userId,
          address: null,
          address2: null,
          city: prev.city,
          postalcode: null,
          state: null,
          country: prev.country,
          latitude: prev.latitude ?? 0,
          longitude: prev.longitude ?? 0,
          type: "PREVIOUS",
        };
        //console.log("📍 Inserting PREVIOUS location:", previousPayload);
        const { error: prevError } = await supabase
          .from("Location")
          .insert(previousPayload);
        if (prevError) return prevError;
      }
    }
  }

  // Insert VISITED locations - array of { city, country }
  if (Array.isArray(values.visited)) {
    for (const visit of values.visited) {
      if (visit.city && visit.country) {
        const visitedPayload = {
          userId,
          address: null,
          address2: null,
          city: visit.city,
          postalcode: null,
          state: null,
          country: visit.country,
          latitude: visit.latitude ?? 0,
          longitude: visit.longitude ?? 0,
          type: "VISITED",
        };
        //console.log("📍 Inserting VISITED location:", visitedPayload);
        const { error: visitError } = await supabase
          .from("Location")
          .insert(visitedPayload);
        if (visitError) return visitError;
      }
    }
  }

  return null; // no errors
};
