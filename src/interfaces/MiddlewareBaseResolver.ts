interface Middleware {
  before?: Function;
  after?: Function;
}

export interface MiddlewareBaseResolver {
  create: Middleware;
  update: Middleware;
  delete: Middleware;
}
