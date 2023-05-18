import { ServiceAccount } from '../types';

type Options = {
  page?: number;
  perPage?: number;
  token: string;
  sso: string;
};

export async function fetchServiceAccounts({
  page = 1,
  perPage = 100,
  token,
  sso,
}: Options): Promise<{
  serviceAccounts: ServiceAccount[];
  state: 'no-service-accounts' | 'last-page' | 'results';
}> {
  const first = (page - 1) * perPage;
  const max = perPage;
  const response = await fetch(
    `${sso}/realms/redhat-external/apis/service_accounts/v1?first=${first}&max=${max}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();

  const state = (() => {
    switch (true) {
      case page === 1 && data.length === 0:
        return 'no-service-accounts';
      case (data.length < perPage && page > 1) || response.headers.has('Link'):
        return 'last-page';
      default:
        return 'results';
    }
  })();

  return {
    serviceAccounts: data,
    state,
  };
}
