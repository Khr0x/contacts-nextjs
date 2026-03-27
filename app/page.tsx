export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Bienvenido</h1>
        <p className="text-muted-foreground">
          Selecciona una opción del menú lateral para comenzar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Contactos</h3>
              <p className="text-sm text-muted-foreground">0 contactos</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Favoritos</h3>
              <p className="text-sm text-muted-foreground">0 favoritos</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" x2="4" y1="22" y2="15" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Recientes</h3>
              <p className="text-sm text-muted-foreground">0 recientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
