// import { Anniversary } from "../page";

// // Utility function to format value for input
// function formatInputValue(value: string | string[] | Anniversary[] | undefined): string | string[] {
//   if (!value) return "";

//   if (typeof value === "string" || typeof value === "number") {
//     return value;
//   }

//   if (Array.isArray(value)) {
//     if (value.length === 0) return "";

//     if (typeof value[0] === "string") {
//       // Already a string[]
//       return value as string[];
//     }

//     if (typeof value[0] === "object" && "date" in value[0]) {
//       // Convert Anniversary[] to a comma-separated string or extract some property
//       return (value as Anniversary[]).map((ann) => ann.date).join(", ");
//     }
//   }

//   // fallback
//   return "";
// }
