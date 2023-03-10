import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="mx-6 md:max-w-5xl md:mx-auto font-poppins">
      <Nav />
      <main>{children}</main>
    </div>
  );
}
