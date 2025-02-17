import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type SelectCountryProps<T extends FieldValues> = {
  name: Path<T>;
  defaultCountry: string;
  countries: {
    name: string;
    flag: string;
    independent: boolean;
  }[];
  register: UseFormRegister<T>;
  disabled: boolean;
};

function SelectCountry<T extends FieldValues>({
  defaultCountry,
  name,
  countries,
  register,
  disabled,
}: SelectCountryProps<T>) {
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <select
      disabled={disabled}
      defaultValue={`${defaultCountry}%${flag}`}
      className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed  disabled:bg-primary-300"
      {...register(name)}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
