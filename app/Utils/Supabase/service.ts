import { createClient } from "@supabase/supabase-js";

export async function uploadFormData(values: any) {
  console.log("Form values received:", values);

  const data = "test"
  const error = null;

  if (error) {
    console.error("Error fetching profile:", error);
    return { data: null, error: error };
  } else {
    console.log("Fetched profile data:", data);
    return { data, error: null };
  }
}

export async function checkAuthStatus() {
  
}