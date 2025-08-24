import "../styles/global.scss";
export const metadata = {
  title: "Blog Application",
  description: "Blog Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
