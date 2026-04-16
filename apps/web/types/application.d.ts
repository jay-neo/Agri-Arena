type FormState =
  | {
      error?: string;
      message?: string;
      success?: string;
      next?: string;
    }
  | undefined;
