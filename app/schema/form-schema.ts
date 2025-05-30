import * as z from "zod"

export interface ActionResponse < T = any > {
  success: boolean
  message: string
  errors ? : {
    [K in keyof T] ? : string[]
  }
  inputs ? : T
}
export const formSchema = z.object({
  "Name": z.string(),
  "last-name": z.string().optional(),
  "your-email": z.string(),
  "phone-number": z.number().optional(),
  "preferences": z.array(z.string()).nonempty("Please at least one item").optional(),
  "Comment": z.string().optional()
});