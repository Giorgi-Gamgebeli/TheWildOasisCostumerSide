import UpdateProfileForm from "@/app/account/profile/UpdateProfileForm";
import { getCountries } from "@/app/_lib/data-service";

export default async function Page() {
  const countries = await getCountries();

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm countries={countries} />
    </div>
  );
}
