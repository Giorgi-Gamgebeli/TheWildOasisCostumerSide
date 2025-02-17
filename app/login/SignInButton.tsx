import Image from "next/image";
import { signInAction } from "../_lib/actions";

function SignInButton() {
  return (
    <form action={signInAction}>
      <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
        <div className="relative h-6 w-6">
          <Image
            fill
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
          />
        </div>
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
