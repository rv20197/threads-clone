import CommunityCard from "@/components/cards/CommunityCard";
import SearchBar from "@/components/shared/SearchBar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
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

  // Fetch communities
  const results = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <div className="mt-5">
        <SearchBar routeType="communities" />
      </div>

      <div className="mt-14 flex flex-wrap gap-4">
        {results.communities.length === 0 ? (
          <p className="no-result">No communities.</p>
        ) : (
          <>
            {results.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
