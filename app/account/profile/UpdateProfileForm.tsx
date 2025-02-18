"use client";

import Image from "next/image";
import { updateUser } from "../../_lib/actions";
import SubmitButton from "../../_components/SubmitButton";
import { useSession } from "next-auth/react";
import SelectCountry from "./SelectCountry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateUserSchema } from "@/app/_schemas/userSchemas";
import Input from "@/app/_components/Input";
import toast from "react-hot-toast";
import Spinner from "@/app/_components/Spinner";
import { useTransition } from "react";

type UpdateProfileForm = {
  countries: {
    name: string;
    flag: string;
    independent: boolean;
  }[];
};

function UpdateProfileForm({ countries }: UpdateProfileForm) {
  const { data, update } = useSession();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {},
  });
  const [isPending, startTransition] = useTransition();

  if (!data?.user) return <Spinner />;

  const { name, email, countryFlag, nationalID, nationality } = data?.user;

  async function onSubmit(values: z.infer<typeof UpdateUserSchema>) {
    startTransition(async () => {
      const res = await updateUser(values);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("User updated sucessfully!");
      update();
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 bg-primary-900 px-12 py-8 text-lg"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={name}
          name="fullName"
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          name="email"
          defaultValue={email}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {countryFlag && (
            <div className="relative h-5 w-5">
              <Image
                fill
                src={countryFlag}
                alt="Country flag"
                className="rounded-sm"
              />
            </div>
          )}
        </div>

        <SelectCountry
          name="nationalityAndCountryFlag"
          defaultCountry={nationality}
          countries={countries}
          register={register}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <Input
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-primary-300"
          name="nationalID"
          defaultValue={nationalID}
          register={register}
          errors={errors}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center justify-end gap-6">
        <SubmitButton pendingLabel="Updating..." disabled={isPending}>
          Update profile
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
