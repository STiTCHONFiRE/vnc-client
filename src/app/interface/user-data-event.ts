export interface UserDataEvent {
  username: string;
  eventType: string;
}

export interface UsersData {
  usernames: Set<string>;
}
