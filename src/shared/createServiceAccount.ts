import { NewServiceAccount } from '../types';

type Options = {
  name: string;
  token: string;
  sso: string;
};

export async function createServiceAccount({
  name,
  token,
  sso,
}: Options): Promise<NewServiceAccount> {
  const response = await fetch(
    `${sso}/realms/redhat-external/apis/service_accounts/v1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name }),
      method: 'POST',
    }
  );
  const sa = await response.json();
  return sa;
}
