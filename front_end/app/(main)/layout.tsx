import Header from "@/UI/userHeader/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <>
      <Header />
      {children}
      {/* <Footer /> */}
    </>
  );
}