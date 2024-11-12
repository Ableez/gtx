import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Schemas for input validation
const emailAddressSchema = z.object({
  email_address: z.string().email(),
  id: z.string(),
  verification: z.object({
    status: z.string(),
    strategy: z.string(),
  }),
});

const userDataSchema = z.object({
  id: z.string(),
  email_addresses: z.array(emailAddressSchema),
  primary_email_address_id: z.string(),
  username: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  image_url: z.string().url().optional(),
  profile_image_url: z.string().url().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
  password_enabled: z.boolean(),
  two_factor_enabled: z.boolean(),
  external_id: z.string().optional().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
  metadata: z.record(z.string()).optional(),
});
export type UserDataType = z.infer<typeof userDataSchema>;

const updateUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().optional(),
  emailVerified: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
  profileImageUrl: z.string().url().optional(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  passwordEnabled: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  externalId: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
  lastSignInAt: z.string().optional().nullable(),
  disabled: z.boolean().optional(),
});
export type UpdateUserDataType = z.infer<typeof updateUserSchema>;

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userDataSchema)
    .mutation(async ({ ctx, input }) => {
      const { email_addresses, primary_email_address_id, ...rest } = input;
      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      if (!primaryEmail) {
        throw new Error("Primary email not found");
      }

      try {
        await ctx.db.insert(user).values({
          id: rest.id,
          email: primaryEmail.email_address,
          emailVerified: primaryEmail.verification.status === "verified",
          imageUrl: rest.image_url,
          profileImageUrl: rest.profile_image_url,
          username: rest.username ?? undefined,
          firstName: rest.first_name ?? undefined,
          lastName: rest.last_name ?? undefined,
          birthday: rest.birthday ? new Date(rest.birthday) : undefined,
          gender: rest.gender,
          passwordEnabled: rest.password_enabled,
          twoFactorEnabled: rest.two_factor_enabled,
          externalId: rest.external_id,
          createdAt: new Date(rest.created_at),
          updatedAt: new Date(rest.updated_at),
        });
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
        throw new Error("Failed to create user");
      }
    }),

  update: publicProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("INPUT ONE_", input);
        await ctx.db
          .update(user)
          .set({
            ...input,
            birthday: input.birthday ? new Date(input.birthday) : undefined,
            updatedAt: new Date(),
            lastSignInAt: input.lastSignInAt
              ? new Date(input.lastSignInAt)
              : undefined,
          })
          .where(eq(user.id, input.id));
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
        throw new Error("Failed to update user");
      }
    }),

  softDelete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(user)
          .set({
            deleted: true,
            deletedAt: new Date(),
          })
          .where(eq(user.id, input.id));
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
        throw new Error("Failed to delete user");
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const userRecord = await ctx.db
          .select()
          .from(user)
          .where(eq(user.id, input.id))
          .execute();
        return userRecord[0];
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
        throw new Error("Failed to fetch user");
      }
    }),

  updateLastSignIn: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(user)
          .set({
            lastSignInAt: new Date(),
          })
          .where(eq(user.id, input.id));
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
        throw new Error("Failed to update last sign-in");
      }
    }),
});
