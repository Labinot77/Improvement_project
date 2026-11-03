export interface AuthUser {
  id: string;
  email: string | undefined;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | undefined;

  app_metadata: {
    provider: string;
    providers: string[];
  };

  user_metadata: {
    avatar_url?: string;
    email?: string;
    email_verified?: boolean;
    preferred_username?: string;
    user_name?: string;
    provider_id?: string;
    sub?: string;
    iss?: string;
    phone_verified?: boolean;
  };

  identities: AuthIdentity[];
  is_anonymous: boolean;
  phone: string;
  role: string;
  aud: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
}

export interface AuthIdentity {
  identity_id: string;
  id: string;
  user_id: string;
  provider: string;
  identity_data: Record<string, unknown>;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
}