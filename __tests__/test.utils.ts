const next: any = () => ({});

const ctx: any = {
  context: {
    req: {
      body: {
        query: `
          {
            getAllUser {
              id
              firstName
              lastName
            }
          }`,
      },
      headers: {
        authorization: '',
      },
    },
    res: {},
  },
};

export { next, ctx };
