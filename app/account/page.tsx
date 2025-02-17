import Spinner from "../_components/Spinner";
import { auth } from "@/auth";

async function Page() {
  const session = await auth();

  if (!session?.user) return <Spinner />;

  const firstName = session.user.name.split(" ")[0];

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}
    </h2>
  );
}

export default Page;
