import { ServiceAccount } from '../../types';

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
  hasMore: boolean;
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
  return { serviceAccounts: data, hasMore: response.headers.has('Link') };
}
