import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getSession, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

const Dashboard = () => {
  const { data: sessionData } = useSession();
  console.log("SESSION >>>>", sessionData);
  return (
    <div>
      Dashboard page
      <Button
        variant="primary"
        className="border border-transparent"
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req } = ctx;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default Dashboard;
