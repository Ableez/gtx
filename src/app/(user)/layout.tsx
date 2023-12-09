import AuthProvider from "@/lib/context/AuthProvider";

type Props = {
  children: React.ReactNode;
};

const UserLayout = (props: Props) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <AuthProvider>{props.children}</AuthProvider>
    </div>
  );
};

export default UserLayout;
