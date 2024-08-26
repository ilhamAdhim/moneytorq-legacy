import Link from "next/link";

function AuthCodeErrorPage() {
    return (<>
        <section className="flex flex-col items-center w-full py-12 text-center md:py-24">
            <img
                src="/authentication-failed.svg"
                width="300"
                height="400"
                alt="Illustration"
                className="rounded-xl object-cover"
                style={{ aspectRatio: "400/400", objectFit: "cover" }}
            />
            <div className="container flex flex-col items-center justify-center gap-2 px-4 md:gap-4 lg:gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Autentikasi Gagal</h1>
                    <p className="text-gray-500 md:w-full dark:text-gray-400">
                        Yuk, coba lagi dengan metode lain.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-flex h-9 items-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                >
                    Coba Metode Lain
                </Link>
            </div>
        </section>
    </>);
}

export default AuthCodeErrorPage;