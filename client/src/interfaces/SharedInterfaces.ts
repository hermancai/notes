export namespace SharedInterfaces {
  export interface ServerResponse {
    error: boolean;
    message: string;
    accessToken?: string;
    username?: string;
    status?: number;
  }

  export interface SortModes {
    sortMode: "Oldest" | "Newest" | "Last Updated";
  }
}
