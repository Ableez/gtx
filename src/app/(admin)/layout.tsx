import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const AdminLayout = (props: Props) => {
  return <>{props.children}</>;
};

export default AdminLayout;
