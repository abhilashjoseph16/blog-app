import Header from "@/components/Header";
import "../../styles/global.scss";
export const metadata = {
  title: "Blog Application",
};

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}