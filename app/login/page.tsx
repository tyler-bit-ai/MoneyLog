type Props = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const resolved = (await searchParams) ?? {};
  const hasError = resolved.error === "invalid";
  const hasConfigError = resolved.error === "config";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">MoneyLog 로그인</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">대시보드 비밀번호를 입력하세요.</p>

        <form action="/api/auth/login" method="post" className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-[var(--ink)]" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-[var(--line)] px-3 py-2 outline-none ring-0 transition focus:border-emerald-600"
          />
          {hasError ? <p className="text-sm text-rose-700">비밀번호가 올바르지 않습니다.</p> : null}
          {hasConfigError ? (
            <p className="text-sm text-rose-700">
              서버 환경변수가 없습니다. <code>.env.local</code> 파일을 설정하고 서버를 재시작하세요.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-700 px-4 py-2 font-medium text-white transition hover:bg-emerald-800"
          >
            로그인
          </button>
        </form>
      </section>
    </main>
  );
}
