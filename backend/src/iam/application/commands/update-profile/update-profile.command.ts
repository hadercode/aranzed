export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
  jobTitle?: string;
  bio?: string;
}

export class UpdateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly data: UpdateProfileData,
  ) {}
}
