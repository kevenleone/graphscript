interface middlewareContent {
  before?: Function,
  after?: Function
}

export interface MiddlewareBaseResolver {
  create: middlewareContent,
  update: middlewareContent,
  delete: middlewareContent
}