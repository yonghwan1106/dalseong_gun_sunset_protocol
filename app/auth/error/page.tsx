import Link from 'next/link';

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  const errorMessages: Record<string, string> = {
    AccessDenied: '@dalseong.go.kr 이메일 주소로만 로그인할 수 있습니다.',
    Configuration: '서버 설정 오류가 발생했습니다.',
    Verification: '인증 토큰이 만료되었거나 이미 사용되었습니다.',
    Default: '인증 중 오류가 발생했습니다.',
  };

  const errorMessage = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">로그인 실패</h1>
        </div>

        <div className="mb-6 rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>

        {error === 'AccessDenied' && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-xs text-blue-800">
              <strong>안내:</strong> 이 시스템은 달성군 직원 전용입니다.
              <br />
              @dalseong.go.kr 이메일 주소로 로그인해 주세요.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            다시 로그인 시도
          </Link>

          <Link
            href="/"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            문제가 지속되면 시스템 관리자에게 문의하세요.
            <br />
            <a
              href="mailto:sanoramyun8@gmail.com"
              className="text-blue-600 hover:underline"
            >
              sanoramyun8@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
