import { z } from "zod";
import { UserSchemaDatabase } from "./databaseSchemas";

export const UpdateUserSchema = z.object({
  nationalityAndCountryFlag: UserSchemaDatabase.shape.nationality,
  nationalID: UserSchemaDatabase.shape.nationalID,
});

export const CreateUserSchema = UserSchemaDatabase.pick({
  email: true,
  name: true,
});
