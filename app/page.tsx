export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <main className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            ⚡ Inazuma Avatar Hub
          </h1>
          <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Partagez et découvrez les meilleurs <span className="font-semibold text-blue-600">Codes d&apos;Avatar</span> pour{' '}
            <span className="font-semibold">Inazuma Eleven: Victory Road</span>
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="/gallery"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Explorer la galerie
          </a>
          <a
            href="/upload"
            className="rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Partager mon avatar
          </a>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Partage facile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload ton screenshot et ton code</p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Découvre</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore les créations de la communauté</p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Copie en 1 clic</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Copie instantanée du code d&apos;avatar</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            🚧 <span className="font-semibold">Site en construction</span> - Prochainement disponible sur{' '}
            <a href="https://inazuma.wireredblue.xyz" className="font-semibold text-blue-600 hover:underline">
              inazuma.wireredblue.xyz
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
