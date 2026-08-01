const columns = [
  {
    title: "Platform",
    links: ["How It Works", "Features", "Pricing", "API"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookies"],
  },
  {
    title: "Connect",
    links: ["Twitter", "LinkedIn", "GitHub", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="snap-end bg-background border-t border-border mt-auto">
      <div className="mx-auto max-w-[1280px] px-4 py-16 md:px-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="EvalCv Logo"
                className="w-8 h-8 rounded-lg object-cover border border-border shadow-xs"
              />
              <p className="text-xl font-extrabold tracking-tight">EVAL</p>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The intelligent layer between resumes and the right opportunities.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-label-md uppercase">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-label-sm uppercase tracking-wider text-muted-foreground">
            © 2024 EVAL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
