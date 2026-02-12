export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Connect2 - Join the Waitlist</title>
        <meta
          name="description"
          content="Join the Connect2 waitlist to connect with top professionals from leading companies."
        />
      </head>
      <body className="antialiased">
        {/* No header/nav for waitlist pages */}
        <main>{children}</main>
      </body>
    </html>
  );
}
