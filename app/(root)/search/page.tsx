import UserCard from "@/components/cards/UserCard";
import SearchBar from "@/components/shared/SearchBar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Params = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

const Page = async ({ searchParams }: Params) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboardedStatus) redirect("/onboarding");

  // Fetch Users
  const results = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <SearchBar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {results.users.length === 0 ? (
          <p className="no-result">No users.</p>
        ) : (
          <>
            {results.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                userType={"User"}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
